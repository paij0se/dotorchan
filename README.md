# Dotorchan

**TODO**

- [ ] Captcha
- [ ] Threads
- [ ] admin dashboard
- [x] able to upload files
- [ ] Templates for the boards

# Run with Docker

```bash
docker-compose up
```

<b>Dont forget to add your aws credentials in the dockerfile of `web/aws/Dockerfile`</br>

```dockerfile
FROM golang:1.22
WORKDIR /app
COPY . .
ENV AWS_ACCESS_KEY_ID=""
ENV AWS_SECRET_ACCESS_KEY=""
RUN go mod download
COPY *.go ./
RUN CGO_ENABLED=0 GOOS=linux go build -o /aws
CMD ["/aws"]
```
