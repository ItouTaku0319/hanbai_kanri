package utils

import (
	"github.com/gin-gonic/gin"
)

// 成功時のレスポンスを返す（Gin Context 対応）
func RespondWithJSON(c *gin.Context, statusCode int, payload interface{}) {
	c.JSON(statusCode, payload)
}
