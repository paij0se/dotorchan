# Showcase
![Diseño sin título (2)](https://github.com/paij0se/dotorchan/assets/156923829/b95c04c3-3e42-443c-a36a-0ebd0c308ef4)


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
- [ ] Templates for the boards (with components)

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
