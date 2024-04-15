# Dotorchan

![Screenshot from 2024-04-13 16-21-18](https://github.com/paij0se/dotorchan/assets/156923829/ef0d8f92-f24a-4a34-a5fc-64dc9e7735a9)

# Showcase
![image](https://github.com/paij0se/dotorchan/assets/156923829/0069ec7d-3446-414b-a32b-d660b2839f6d)



## Structure

| Codebase              |      Description          |
| :-------------------- | :-----------------------: |
| [butifarra](butifarra)    |      Elixir API           |
| [papa](papa)  |     GO/AWS/S3         |
| [lechuga](lechuga)      | Svelte fronted     |

**TODO**

- [x] Captcha
- [x] Threads (still in progress)
- [ ] admin dashboard
- [x] able to upload files
- [ ] Templates for the boards

# Run with Docker

```bash
docker-compose up
```

Dont forget to add your aws credentials in the dockerfile of `web/aws/Dockerfile`

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
