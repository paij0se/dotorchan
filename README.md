# Dotorchan
![Screenshot from 2024-04-03 18-48-52](https://github.com/paij0se/dotorchan/assets/156923829/62297e4c-9a42-4126-b590-6a78155f0144)

## Structure

| Codebase              |      Description          |
| :-------------------- | :-----------------------: |
| [butifarra](butifarra)    |      Elixir API           |
| [papa](papa)  |     GO/AWS/S3         |
| [lechuga](lechuga)      | Svelte fronted     |

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
