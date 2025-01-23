// ファイル: internal/handler/zaiko.go

package handler

import (
	"net/http"

	// service は internal/service/zaiko.go (package service)
	// というパッケージをインポートしているので、以下のように書く
	"hanbai_kanri/internal/service"

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

func (h *ZaikoHandler) GetZaikoList(c *gin.Context) {
	zaikoList, err := h.service.GetZaikoList()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, zaikoList)
}
