package repository

import (
	"hanbai_kanri/internal/utils"
	"hanbai_kanri/models"

	"gorm.io/gorm"
)

type KbnItemRepository struct {
	db *gorm.DB
}

func NewKbnItemRepository(db *gorm.DB) *KbnItemRepository {
	return &KbnItemRepository{db: db}
}

func (r *KbnItemRepository) GetKbnItems(kbnName string) ([]models.KbnItem, error) {
	var items []models.KbnItem
	err := r.db.Where("kbn_name = ? AND is_active = true", kbnName).
		Order("hyoji_jun").
		Find(&items).Error
	if err != nil {
		return nil, utils.WrapError("KbnItemRepository.GetKbnItems", err)
	}
	return items, nil
}
