package db

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/schema"
)

var dsn = "host=localhost user=admin password=docker dbname=postgres port=5432"
var DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
	NamingStrategy: schema.NamingStrategy{
		TablePrefix:   "system.", // table name prefix, table for `User` would be `t_users`
		SingularTable: true,      // use singular table name, table for `User` would be `user` with this option enabled
	}})

func init() {
	if err != nil {
		panic("failed to connect database")
	}
}
