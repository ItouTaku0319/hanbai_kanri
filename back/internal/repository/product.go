package repository

import (
	"context"
	"hanbai_kanri/models"

	"gorm.io/gorm"
)

type ProductRepository interface {
	Create(ctx context.Context, product *models.Product) error
	FindByID(ctx context.Context, id uint) (*models.Product, error)
	FindAll(ctx context.Context) ([]models.Product, error)
	Update(ctx context.Context, product *models.Product) error
	Delete(ctx context.Context, id uint) error
}

type productRepository struct {
	db *gorm.DB
}

func NewProductRepository(db *gorm.DB) ProductRepository {
	return &productRepository{
		db: db,
	}
}

func (r *productRepository) Create(ctx context.Context, product *models.Product) error {
	return r.db.WithContext(ctx).Create(product).Error
}

func (r *productRepository) FindByID(ctx context.Context, id uint) (*models.Product, error) {
	var product models.Product
	if err := r.db.WithContext(ctx).First(&product, id).Error; err != nil {
		return nil, err
	}
	return &product, nil
}

func (r *productRepository) FindAll(ctx context.Context) ([]models.Product, error) {
	var products []models.Product
	if err := r.db.WithContext(ctx).Find(&products).Error; err != nil {
		return nil, err
	}
	return products, nil
}

func (r *productRepository) Update(ctx context.Context, product *models.Product) error {
	return r.db.WithContext(ctx).Save(product).Error
}

func (r *productRepository) Delete(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&models.Product{}, id).Error
}
