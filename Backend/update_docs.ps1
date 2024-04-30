cd ./src
go run github.com/swaggo/swag/cmd/swag init  -g ./main/main.go -o main/docs --parseInternal --parseDependency
cd ..