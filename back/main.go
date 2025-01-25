package main

import (
	"log"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"hanbai_kanri/config"
	"hanbai_kanri/internal/handler"
	"hanbai_kanri/internal/logger"
	"hanbai_kanri/internal/repository"
	"hanbai_kanri/internal/service"
)

func main() {
	// ロガーの初期化
	logger.InitLogger()

	logger.InfoLogger.Println("Server is starting...")

	if err := config.InitDatabase(); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	// 依存関係の初期化
	zaikoRepo := repository.NewZaikoRepository(config.DB)
	zaikoService := service.NewZaikoService(zaikoRepo)
	zaikoHandler := handler.NewZaikoHandler(zaikoService)

	r := gin.Default()

	// ✅ CORS ミドルウェアの適用
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"}, // フロントエンドのURL
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"*"},
		ExposeHeaders:    []string{"*"},
		AllowCredentials: false, // クッキーや認証情報を含める場合
		MaxAge:           12 * time.Hour,
	}))
	// CORS設定
	// c := cors.New(cors.Options{
	// 	AllowedOrigins:   []string{"*"}, // すべてのオリジンを許可
	// 	AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"},
	// 	AllowedHeaders:   []string{"*"}, // すべてのヘッダーを許可
	// 	ExposedHeaders:   []string{"*"},
	// 	AllowCredentials: false, // '*'を使用する場合はfalseにする必要がある
	// 	Debug:            true,
	// })
	// ✅ `OPTIONS` リクエストを許可 (CORS プリフライト対応)
	r.OPTIONS("/*path", func(c *gin.Context) {
		c.Status(204)
	})

	// ルートの設定
	r.GET("/zaiko", zaikoHandler.GetZaikoList)

	log.Println("Server starting on :8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
