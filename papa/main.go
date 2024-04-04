package main

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"math/rand"
	"net/http"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/gorilla/mux"
	"github.com/paij0se/doctorchan/web/aws/peo"
	"github.com/rs/cors"
)

type File struct {
	Name string `json:"name"`
	Data string `json:"data"`
}

func UploadtoS3(w http.ResponseWriter, r *http.Request) {
	var IncomingFile File
	reqBody, err := io.ReadAll(r.Body)
	if err != nil {
		fmt.Fprintf(w, "Kindly enter data with the file name only in order to update")
	}
	json.Unmarshal(reqBody, &IncomingFile)
	fmt.Println(IncomingFile.Name)
	// Decode the incoming File because it is encoded in base64
	data, err := base64.StdEncoding.DecodeString(IncomingFile.Data)
	if err != nil {
		fmt.Println("Error decoding file:", err)
		return
	}
	err = os.WriteFile(IncomingFile.Name, data, 0666)
	if err != nil {
		fmt.Println("Error writing file to disk:", err)
		return
	}

	region := "us-east-1"

	sess, err := session.NewSession(&aws.Config{
		Region: aws.String(region),
		Credentials: credentials.NewStaticCredentials(
			os.Getenv("AWS_ACCESS_KEY_ID"),
			os.Getenv("AWS_SECRET_ACCESS_KEY"),
			"",
		),
	})
	if err != nil {
		fmt.Println("Error creating session:", err)
		return
	}
	svc := s3.New(sess)

	bucket := "dotorchan"
	filePath := IncomingFile.Name

	file, err := os.Open(filePath)
	if err != nil {
		fmt.Fprintln(os.Stderr, "Error opening file:", err)
		return
	}
	defer file.Close()

	key := fmt.Sprint(rand.Intn(10000000)) + IncomingFile.Name

	// Read the contents of the file into a buffer
	var buf bytes.Buffer
	if _, err := io.Copy(&buf, file); err != nil {
		fmt.Fprintln(os.Stderr, "Error reading file:", err)
		return
	}

	// This uploads the contents of the buffer to S3
	_, err = svc.PutObject(&s3.PutObjectInput{
		Bucket: aws.String(bucket),
		Key:    aws.String(key),
		Body:   bytes.NewReader(buf.Bytes()),
	})
	if err != nil {
		fmt.Println("Error uploading file:", err)
		return
	}

	fmt.Println("File uploaded successfully!!!")
	// send the s3 link to the client
	s3Url := "https://" + bucket + ".s3.amazonaws.com/" + key
	fileSize := buf.Len()
	// get the file format after the dot
	fileFormat := key[len(key)-3:]
	fmt.Println(s3Url)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"url":      s3Url,
		"size":     fileSize,
		"filename": IncomingFile.Name,
		"format":   fileFormat,
	})
	// delete the file from the disk
	err = os.Remove(IncomingFile.Name)
	if err != nil {
		fmt.Println("Error deleting file from disk:", err)
		return
	}
}

func main() {
	r := mux.NewRouter().StrictSlash(true)
	r.HandleFunc("/", UploadtoS3)
	r.HandleFunc("/totalSize", peo.SendTotalSize)
	port, ok := os.LookupEnv("PORT")

	if !ok {
		port = "5000"
	}
	fmt.Println("Go microservice running on port: ", port)
	handler := cors.Default().Handler(r)
	http.ListenAndServe(":"+port, handler)

}
