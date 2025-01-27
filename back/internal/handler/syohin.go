package handler

import (
	"hanbai_kanri/internal/service"
	"hanbai_kanri/internal/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

// ZaikoHandler は在庫関連の HTTP ハンドラー
type SyohinHandler struct {
	service *service.SyohinService
}

// NewSyohinHandler はハンドラーを初期化
func NewSyohinHandler(s *service.SyohinService) *SyohinHandler {
	return &SyohinHandler{service: s}
}

// GetSyohinList は商品一覧を取得するエンドポイント
func (h *SyohinHandler) GetSyohinList(c *gin.Context) {
	code := c.Query("code")
	name := c.Query("name")

	// lowStockOnly を bool に変換
	lowStockOnly := c.Query("lowStockOnly") == "true"

	// isLeftMatch を bool に変換
	isLeftMatch := c.Query("isLeftMatch") == "true"

	// syohinType パラメータの処理
	var syohinType *bool
	if typeStr := c.Query("syohinType"); typeStr != "" {
		isProduct := typeStr == "true"
		syohinType = &isProduct
	}

	// カテゴリーとサブカテゴリーのパラメータを取得
	category := c.Query("category")
	subCategory := c.Query("subCategory")
	// var category, subCategory *string
	// if categoryStr := c.Query("category"); categoryStr != "" {
	// 	categoryVal, err := strconv.Atoi(categoryStr)
	// 	if err == nil {
	// 		category = &categoryVal
	// 	}
	// }
	// if subCategoryStr := c.Query("subCategory"); subCategoryStr != "" {
	// 	subCategoryVal, err := strconv.Atoi(subCategoryStr)
	// 	if err == nil {
	// 		subCategory = &subCategoryVal
	// 	}
	// }

	// サービス層を呼び出して在庫一覧を取得
	syohinList, err := h.service.GetSyohinList(code, isLeftMatch, name, syohinType, category, subCategory, lowStockOnly)
	if err != nil {
		utils.RespondWithError(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondWithJSON(c, http.StatusOK, syohinList)
}

// GetSyohinKosei は商品構成情報を取得するエンドポイント
func (h *SyohinHandler) GetSyohinKosei(c *gin.Context) {
	syohinCode := c.Param("syohinCode")

	koseiList, err := h.service.GetSyohinKosei(syohinCode)
	if err != nil {
		utils.RespondWithError(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondWithJSON(c, http.StatusOK, koseiList)
}
