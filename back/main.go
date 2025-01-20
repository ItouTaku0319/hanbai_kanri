package main

import (
	"log"
	"net/http"

	"hanbai_kanri/config"
	"hanbai_kanri/internal/handler"
	"hanbai_kanri/internal/repository"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	// データベース初期化
	if err := config.InitDatabase(); err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	// リポジトリの初期化
	inventoryRepo := repository.NewInventoryRepository()
	inventoryHandler := handler.NewInventoryHandler(inventoryRepo)

	// ルーターの初期化
	r := mux.NewRouter()

	// エンドポイントの設定
	r.HandleFunc("/inventory", inventoryHandler.GetAllInventory).Methods(http.MethodGet)

	// CORS設定
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"}, // すべてのオリジンを許可
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"},
		AllowedHeaders:   []string{"*"}, // すべてのヘッダーを許可
		ExposedHeaders:   []string{"*"},
		AllowCredentials: false, // '*'を使用する場合はfalseにする必要がある
		Debug:            true,
	})

	// ハンドラーの設定
	handler := c.Handler(r)

	// サーバー起動
	log.Println("Server starting on :8080")
	if err := http.ListenAndServe(":8080", handler); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
