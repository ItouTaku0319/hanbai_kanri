package service

import (
	"hanbai_kanri/internal/repository"
	"hanbai_kanri/internal/utils"
	"hanbai_kanri/models"
)

// ZaikoService は在庫関連のビジネスロジックを担当
type ZaikoService struct {
	Repo *repository.ZaikoRepository
}

func NewZaikoService(r *repository.ZaikoRepository) *ZaikoService {
	return &ZaikoService{Repo: r}
}

// GetZaikoList は在庫一覧を取得する
func (s *ZaikoService) GetZaikoList(code string, isLeftMatch bool, name string, zaikoSuMax int, lowStockOnly bool) ([]models.Zaiko, error) {
	zaikoList, err := s.Repo.GetZaikoList(code, isLeftMatch, name, zaikoSuMax, lowStockOnly)
	if err != nil {
		return nil, utils.WrapError("ZaikoService.GetZaikoList", err)
	}

	return zaikoList, nil
}
