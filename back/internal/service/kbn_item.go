package service

import (
	"hanbai_kanri/internal/repository"
	"hanbai_kanri/internal/utils"
	"hanbai_kanri/models"
)

type KbnItemService struct {
	Repo *repository.KbnItemRepository
}

func NewKbnItemService(r *repository.KbnItemRepository) *KbnItemService {
	return &KbnItemService{Repo: r}
}

func (s *KbnItemService) GetKbnItems(kbnName string) ([]models.KbnItem, error) {
	items, err := s.Repo.GetKbnItems(kbnName)
	if err != nil {
		return nil, utils.WrapError("KbnItemService.GetKbnItems", err)
	}
	return items, nil
}
