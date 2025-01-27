package handler

import (
	"hanbai_kanri/internal/service"
	"hanbai_kanri/internal/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

type KbnItemHandler struct {
	service *service.KbnItemService
}

func NewKbnItemHandler(s *service.KbnItemService) *KbnItemHandler {
	return &KbnItemHandler{service: s}
}

func (h *KbnItemHandler) GetKbnItems(c *gin.Context) {
	kbnName := c.Param("kbnName")

	items, err := h.service.GetKbnItems(kbnName)
	if err != nil {
		utils.RespondWithError(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondWithJSON(c, http.StatusOK, items)
}
