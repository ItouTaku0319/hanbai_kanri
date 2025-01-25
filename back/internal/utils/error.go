package utils

import (
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
)

// WrapError はエラーメッセージを統一し、ログを記録する
func WrapError(context string, err error) error {
	if err != nil {
		log.Printf("[%s] Error: %v\n", context, err) // Go の組み込み `log` に変更
		return fmt.Errorf("[%s] %v", context, err)
	}
	return nil
}

// RespondWithError はエラーハンドリングを統一する
func RespondWithError(c *gin.Context, statusCode int, message string) {
	c.JSON(statusCode, gin.H{"error": message})
}
