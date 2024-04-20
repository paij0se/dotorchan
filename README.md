# Showcase

![Screenshot from 2024-04-16 21-37-49](https://github.com/paij0se/dotorchan/assets/156923829/906d7afb-0cd8-46ac-8983-f8d75b99a259)

![Screenshot from 2024-04-16 21-37-56](https://github.com/paij0se/dotorchan/assets/156923829/ef8821f1-3cba-4e40-9cc6-0ac68ab148a5)

# Threads

![image](https://github.com/paij0se/dotorchan/assets/156923829/71a9e730-e75b-4334-8c83-153f5cc09a96)


## Structure

| Codebase              |      Description          |
| :-------------------- | :-----------------------: |
| [butifarra](butifarra)    |      Elixir API           |
| [papa](papa)  |     GO/AWS/S3         |
| [lechuga](lechuga)      | Svelte fronted     |

**TODO**

- [x] Captcha
- [ ] Captcha for the replies
- [x] Threads (still in progress)
- [ ] admin dashboard
- [x] able to upload files
- [x] Templates for the boards (with components)

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
