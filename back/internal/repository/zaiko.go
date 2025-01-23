package repository

import (
	"hanbai_kanri/models"

	"gorm.io/gorm"
)

type ZaikoRepository struct {
	db *gorm.DB
}

func NewZaikoRepository(db *gorm.DB) *ZaikoRepository {
	return &ZaikoRepository{db: db}
}

func (r *ZaikoRepository) GetZaikoList() ([]models.Zaiko, error) {
	var zaikoList []models.Zaiko

	err := r.db.Table("zaiko").
		Select("zaiko.*, syohin.syohin_name, syohin.stock_unit").
		Joins("LEFT JOIN syohin ON zaiko.syohin_code = syohin.syohin_code").
		Find(&zaikoList).Error

	return zaikoList, err
}
