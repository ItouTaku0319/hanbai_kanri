package service

import (
	"hanbai_kanri/internal/repository"
	"hanbai_kanri/internal/utils"
	"hanbai_kanri/models"
)

// SyohinService は商品関連のビジネスロジックを担当
type SyohinService struct {
	Repo *repository.SyohinRepository
}

func NewSyohinService(r *repository.SyohinRepository) *SyohinService {
	return &SyohinService{Repo: r}
}

// GetSyohinList は商品一覧を取得する
func (s *SyohinService) GetSyohinList(code string, isLeftMatch bool, name string, syohinType *bool, lowStockOnly bool) ([]models.Syohin, error) {
	syohinList, err := s.Repo.GetSyohinList(code, isLeftMatch, name, syohinType, lowStockOnly)
	if err != nil {
		return nil, utils.WrapError("SyohinService.GetSyohinList", err)
	}

	return syohinList, nil
}

// GetSyohinKosei は商品構成情報を取得する
func (s *SyohinService) GetSyohinKosei(syohinCode string) ([]models.SyohinKosei, error) {
	koseiList, err := s.Repo.GetSyohinKoseiList(syohinCode)
	if err != nil {
		return nil, utils.WrapError("SyohinService.GetSyohinKosei", err)
	}

	return koseiList, nil
}
