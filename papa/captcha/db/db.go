package db

import (
	"context"
	"fmt"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func DbInsert(client *mongo.Client, ip string, text string) {
	collection := client.Database("dotorchan").Collection("ips-to-verify")
	// check if the ip already exists in the database
	var result bson.M
	err := collection.FindOne(context.Background(), bson.M{"ip": ip}).Decode(&result)
	if err != nil {
		// insert the ip and text into the database
		_, err = collection.InsertOne(context.Background(), bson.M{"ip": ip, "text": text, "verified": false})
		if err != nil {
			log.Fatal(err)
		}
		fmt.Println("Inserted document")
	}
	fmt.Println("Document already exists")
	// return the _id

}
func ChangeVerified(client *mongo.Client, ip string) {
	collection := client.Database("dotorchan").Collection("ips-to-verify")
	_, err := collection.UpdateOne(context.Background(), bson.M{"ip": ip}, bson.M{"$set": bson.M{"verified": true}})
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Changed verified to true")
}
func ConnectToDB() *mongo.Client {
	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	opts := options.Client().ApplyURI("mongodb://localhost:27017/dotorchan").SetServerAPIOptions(serverAPI)
	client, err := mongo.Connect(context.Background(), opts)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Connected to database!!!")
	return client
}

func DbGet(client *mongo.Client, ip string) string {
	collection := client.Database("dotorchan").Collection("ips-to-verify")
	var result bson.M
	err := collection.FindOne(context.Background(), bson.M{"ip": ip}).Decode(&result)
	if err != nil {
		return "IP not found"
	}
	text := result["text"].(string)
	return text
}

func DeleteDocument(client *mongo.Client, ip string) {
	collection := client.Database("dotorchan").Collection("ips-to-verify")
	_, err := collection.DeleteOne(context.Background(), bson.M{"ip": ip})
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Deleted document")
}
