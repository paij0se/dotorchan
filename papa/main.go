package main

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"image"
	_ "image/gif"
	_ "image/jpeg"
	_ "image/png"
	"io"
	"log"
	"math/rand"
	"net/http"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/rekognition"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/gorilla/mux"
	"github.com/paij0se/doctorchan/web/aws/captcha"
	"github.com/paij0se/doctorchan/web/aws/peo"
	"github.com/rs/cors"
)

type File struct {
	Name string `json:"name"`
	Data string `json:"data"`
}
type RequestBody struct {
	Image string
}

func getImageDimension(imagePath string) (int, int) {
	file, err := os.Open(imagePath)
	if err != nil {
		fmt.Fprintf(os.Stderr, "%v\n", err)
	}

	image, _, err := image.DecodeConfig(file)
	if err != nil {
		fmt.Fprintf(os.Stderr, "%s: %v\n", imagePath, err)
	}
	return image.Width, image.Height
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
	// XD
	var fileFormat string
	if filePath[len(filePath)-3:] == "peg" {
		fileFormat = "jpeg"
	} else {
		fileFormat = filePath[len(filePath)-3:]
	}
	key := fmt.Sprint(rand.Intn(10000000000000000)) + "." + fileFormat

	// Read the contents of the file into a buffer
	var buf bytes.Buffer
	if _, err := io.Copy(&buf, file); err != nil {
		fmt.Fprintln(os.Stderr, "Error reading file:", err)
		return
	}
	rekognitionSvc := rekognition.New(sess)
	input := &rekognition.DetectModerationLabelsInput{
		Image: &rekognition.Image{
			Bytes: buf.Bytes(),
		},
	}
	result, err := rekognitionSvc.DetectModerationLabels(input)
	if err != nil {
		fmt.Println("Error detecting moderation labels:", err)
		return
	}
	for _, label := range result.ModerationLabels {
		fmt.Println("Label: ", *label.Name)
		fmt.Println("Confidence: ", *label.Confidence)
	}
	if len(result.ModerationLabels) > 0 {
		log.Println("Image contains explicit content")
		os.Remove(IncomingFile.Name)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Image contains explicit content",
		})
	} else {
		if buf.Len() > 26214400 {
			json.NewEncoder(w).Encode(map[string]string{
				"error": "File size too large",
			})
		} else {
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
			s3Url := "https://" + bucket + ".s3.amazonaws.com/" + key
			fileSize := buf.Len()
			fmt.Println(getImageDimension(IncomingFile.Name))
			fmt.Println(s3Url)
			width, height := getImageDimension(IncomingFile.Name)
			json.NewEncoder(w).Encode(map[string]interface{}{
				"url":        s3Url,
				"size":       fileSize,
				"filename":   IncomingFile.Name,
				"format":     fileFormat,
				"dimensions": map[string]int{"height": height, "width": width},
			})
			err = os.Remove(IncomingFile.Name)
			if err != nil {
				fmt.Println("Error deleting file from disk:", err)
				return
			}
		}

	}

}

func main() {
	r := mux.NewRouter().StrictSlash(true)
	r.HandleFunc("/", UploadtoS3)
	r.HandleFunc("/totalSize", peo.SendTotalSize)
	r.Handle("/captcha", http.HandlerFunc(captcha.CaptchaHandle)) // Fix: Wrap the CaptchaHandle function with http.HandlerFunc
	r.Handle("/captcha/verify", http.HandlerFunc(captcha.CaptchaVerify))
	port, ok := os.LookupEnv("PORT")

	if !ok {
		port = "5000"
	}
	fmt.Println("Go microservice running on port: ", port)
	handler := cors.Default().Handler(r)
	http.ListenAndServe(":"+port, handler)

}
