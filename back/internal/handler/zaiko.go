package handler

import (
	"hanbai_kanri/internal/service"
	"hanbai_kanri/internal/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// ZaikoHandler は在庫関連の HTTP ハンドラー
type ZaikoHandler struct {
	service *service.ZaikoService
}

// NewZaikoHandler はハンドラーを初期化
func NewZaikoHandler(s *service.ZaikoService) *ZaikoHandler {
	return &ZaikoHandler{service: s}
}

// GetZaikoList は在庫一覧を取得するエンドポイント
func (h *ZaikoHandler) GetZaikoList(c *gin.Context) {
	code := c.Query("code")
	name := c.Query("name")

	// zaikoSuMax を整数に変換（空の場合は 0）
	zaikoSuMax, err := strconv.Atoi(c.Query("zaikoSuMax"))
	if err != nil {
		zaikoSuMax = 0
	}

	// lowStockOnly を bool に変換
	lowStockOnly := c.Query("lowStockOnly") == "true"

	// isLeftMatch を bool に変換
	isLeftMatch := c.Query("isLeftMatch") == "true"

	// サービス層を呼び出して在庫一覧を取得
	zaikoList, err := h.service.GetZaikoList(code, isLeftMatch, name, zaikoSuMax, lowStockOnly)
	if err != nil {
		utils.RespondWithError(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondWithJSON(c, http.StatusOK, zaikoList)
}
