package config

import (
	"fmt"
	"hanbai_kanri/models"
	"log"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	DBName   string
}

var DB *gorm.DB

func InitDatabase() error {
	config := DatabaseConfig{
		// docker-compose.ymlの環境変数に合わせたデフォルト値
		// Host:     getEnv("DB_HOST", "postgres"), // コンテナ名がpostgres
		Host:     getEnv("DB_HOST", "localhost"),
		Port:     getEnv("DB_PORT", "5432"),
		User:     getEnv("DB_USER", "vendor_user"),     // POSTGRES_USERの値
		Password: getEnv("DB_PASSWORD", "vendor_pass"), // POSTGRES_PASSWORDの値
		DBName:   getEnv("DB_NAME", "vendor_db"),
	}

	log.Printf("Attempting database connection with config: Host=%s, Port=%s, User=%s, DBName=%s\n",
		config.Host, config.Port, config.User, config.DBName)

	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		config.Host,
		config.Port,
		config.User,
		config.Password,
		config.DBName,
	)

	newLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags),
		logger.Config{
			SlowThreshold:             time.Second,
			LogLevel:                  logger.Info,
			IgnoreRecordNotFoundError: true,
			Colorful:                  true,
		},
	)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: newLogger,
	})
	if err != nil {
		log.Printf("Failed to connect to database: %v\n", err)
		return fmt.Errorf("failed to connect to database: %v", err)
	}

	log.Println("Successfully connected to database")

	sqlDB, err := DB.DB()
	if err != nil {
		log.Printf("Failed to get database instance: %v\n", err)
		return fmt.Errorf("failed to get database instance: %v", err)
	}

	// Connection Pool の設定
	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	log.Println("Database connection pool configured successfully")

	// マイグレーションの実行
	if err := DB.AutoMigrate(&models.Product{}); err != nil {
		log.Printf("Failed to migrate database: %v\n", err)
		return fmt.Errorf("failed to migrate database: %v", err)
	}
	log.Println("Database migration completed successfully")

	return nil
}

func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}
