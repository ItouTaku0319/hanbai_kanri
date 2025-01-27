package repository

import (
	"fmt" // Add this line
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

	query := r.db.Table("kbn_item AS k").
		Where("k.kbn_name = ? AND k.is_active = true", kbnName).
		Order("k.hyoji_jun")

	// 🔹 `ITEM_SUB_CATEGORY` の場合、カテゴリ情報を結合
	if kbnName == "ITEM_SUB_CATEGORY" {
		query = query.Select(`
		k.*, 
		LEFT(k.kbn_value::TEXT, 1) AS category_value, 
		c.kbn_value_name AS category_label
	`).Joins(`
		LEFT JOIN kbn_item AS c 
		ON LEFT(k.kbn_value::TEXT, 1) = c.kbn_value 
		AND c.kbn_name = 'ITEM_CATEGORY'
	`)

	}

	err := query.Find(&items).Error
	if err != nil {
		return nil, utils.WrapError("KbnItemRepository.GetKbnItems", err)
	}
	fmt.Println(items)
	return items, nil
}
