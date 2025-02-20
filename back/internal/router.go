package router

import (
	"hanbai_kanri/internal/handler"

	"github.com/gin-gonic/gin"
)

func SetupRouter(zaikoHandler *handler.ZaikoHandler) *gin.Engine {
	r := gin.Default()

	// 在庫一覧取得のエンドポイント
	r.GET("/zaiko", zaikoHandler.GetZaikoList)
	// 商品一覧取得のエンドポイント
	r.GET("/syohin", syohinHandler.GetSyohinList)

	return r
}
