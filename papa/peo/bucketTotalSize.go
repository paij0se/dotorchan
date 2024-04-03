package peo

import (
	"context"
	"fmt"
	"net/http"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

func S3ObjectsSize(bucket string, s3client S3Client) (int64, error) {
	output, err := s3client.ListObjectsV2(context.TODO(), &s3.ListObjectsV2Input{
		Bucket: aws.String(bucket),
	})

	if err != nil {
		return -1, fmt.Errorf("cannot ListObjectsV2 in %s: %s", bucket, err.Error())
	}

	var size int64
	for _, object := range output.Contents {
		size += *object.Size
	}

	return size, nil

}

type S3Client interface {
	ListObjectsV2(ctx context.Context, params *s3.ListObjectsV2Input, optFns ...func(*s3.Options)) (*s3.ListObjectsV2Output, error)
}

func SendTotalSize(w http.ResponseWriter, r *http.Request) {
	// Create an S3 client
	cfg, _ := config.LoadDefaultConfig(context.TODO())
	s3client := s3.NewFromConfig(cfg)

	size, err := S3ObjectsSize("dotorchan", s3client)
	if err != nil {
		fmt.Println("Error getting size of objects in bucket: ", err)
		return
	}

	// send a json response
	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(w, `{"bucketTotalSize": %d}`, size)
}
