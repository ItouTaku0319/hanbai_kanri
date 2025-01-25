// ファイル: internal/service/zaiko.go
package service

import (
	"hanbai_kanri/internal/repository"
	"hanbai_kanri/models"
)

type ZaikoService struct {
	repo *repository.ZaikoRepository
}

func NewZaikoService(r *repository.ZaikoRepository) *ZaikoService {
	return &ZaikoService{repo: r}
}

func (s *ZaikoService) GetZaikoList(code string, isLeftMatch bool, name string, zaikoSuMax int, lowStockOnly bool) ([]models.Zaiko, error) {
	return s.repo.GetZaikoList(code, isLeftMatch, name, zaikoSuMax, lowStockOnly)
}
