package repository

import (
	"context"
	"hanbai_kanri/config"
	"hanbai_kanri/models"

	"gorm.io/gorm"
)

type InventoryRepository interface {
	FindAll(ctx context.Context) ([]models.Inventory, error)
}

type inventoryRepository struct {
	db *gorm.DB
}

func NewInventoryRepository() InventoryRepository {
	return &inventoryRepository{
		db: config.DB,
	}
}

func (r *inventoryRepository) FindAll(ctx context.Context) ([]models.Inventory, error) {
	var inventories []models.Inventory
	if err := r.db.WithContext(ctx).Find(&inventories).Error; err != nil {
		return nil, err
	}
	return inventories, nil
}
