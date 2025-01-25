// ファイル: internal/handler/zaiko.go
package handler

import (
	"hanbai_kanri/internal/service"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// ZaikoHandler は service.ZaikoService を使う
type ZaikoHandler struct {
	service *service.ZaikoService
}

// NewZaikoHandler はハンドラーの初期化
func NewZaikoHandler(s *service.ZaikoService) *ZaikoHandler {
	return &ZaikoHandler{service: s}
}

// 在庫一覧を取得（検索機能付き）
func (h *ZaikoHandler) GetZaikoList(c *gin.Context) {
	code := c.Query("code")
	name := c.Query("name")

	// zaikoSuMax を整数に変換（空の場合は 0）
	zaikoSuMax, err := strconv.Atoi(c.Query("zaikoSuMax"))
	if err != nil {
		zaikoSuMax = 0 // デフォルト値
	}

	// lowStockOnly が "true" の場合のみ有効にする
	lowStockOnly := c.Query("lowStockOnly") == "true"

	// `isLeftMatch` を `bool` に変換
	isLeftMatch := false
	if c.Query("isLeftMatch") == "true" {
		isLeftMatch = true
	}

	// サービス層に検索条件を渡してデータを取得
	zaikoList, err := h.service.GetZaikoList(code, isLeftMatch, name, zaikoSuMax, lowStockOnly)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// 結果を JSON で返す
	c.JSON(http.StatusOK, zaikoList)
}
