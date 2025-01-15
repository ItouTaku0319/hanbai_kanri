# docker/api/Dockerfile
FROM golang:1.21-alpine

WORKDIR /app

RUN apk add --no-cache gcc musl-dev

# Air for hot reloading（バージョンを指定）
RUN go install github.com/cosmtrek/air@v1.49.0

COPY back/go.mod back/go.sum ./

RUN go mod download

COPY back .

EXPOSE 8080

CMD ["air", "-c", ".air.toml"]