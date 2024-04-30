# Start from the latest golang base image
FROM golang:1.22-alpine

# Set the Current Working Directory inside the container
WORKDIR /app/src

# Copy go mod and sum files
COPY /src .

# Download all dependencies. Dependencies will be cached if the go.mod and go.sum files are not changed
RUN go mod download

RUN go get -u github.com/swaggo/swag/cmd/swag

RUN go run github.com/swaggo/swag/cmd/swag init  -g ./main/main.go -o main/docs --parseInternal --parseDependency

# Build the Go app
RUN go build -o /bin ./main


# Expose port 8080 to the outside world
EXPOSE 8080

# Command to run the executable
CMD ["/bin/main"]