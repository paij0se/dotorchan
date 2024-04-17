# Showcase
![image](https://github.com/paij0se/dotorchan/assets/156923829/4c9f8065-9b3c-4a3a-aec0-ab9562d8227f)
![Screenshot from 2024-04-16 20-41-49](https://github.com/paij0se/dotorchan/assets/156923829/ba85f691-28ad-4ff3-a0c3-68bdd196d632)




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
