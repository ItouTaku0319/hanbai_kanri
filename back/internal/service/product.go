package service

import (
	"context"
	"errors"

	"hanbai_kanri/internal/repository"
	"hanbai_kanri/models"
)

type ProductService interface {
	CreateProduct(ctx context.Context, product *models.Product) error
	GetProduct(ctx context.Context, id uint) (*models.Product, error)
	GetAllProducts(ctx context.Context) ([]models.Product, error)
	UpdateProduct(ctx context.Context, product *models.Product) error
	DeleteProduct(ctx context.Context, id uint) error
}

type productService struct {
	repo repository.ProductRepository
}

func NewProductService(repo repository.ProductRepository) ProductService {
	return &productService{
		repo: repo,
	}
}

func (s *productService) CreateProduct(ctx context.Context, product *models.Product) error {
	if product.Name == "" {
		return errors.New("product name is required")
	}
	if product.Price < 0 {
		return errors.New("price must be positive")
	}
	if product.Stock < 0 {
		return errors.New("stock must be positive")
	}
	return s.repo.Create(ctx, product)
}

func (s *productService) GetProduct(ctx context.Context, id uint) (*models.Product, error) {
	return s.repo.FindByID(ctx, id)
}

func (s *productService) GetAllProducts(ctx context.Context) ([]models.Product, error) {
	return s.repo.FindAll(ctx)
}

func (s *productService) UpdateProduct(ctx context.Context, product *models.Product) error {
	if product.ID == 0 {
		return errors.New("product ID is required")
	}
	return s.repo.Update(ctx, product)
}

func (s *productService) DeleteProduct(ctx context.Context, id uint) error {
	return s.repo.Delete(ctx, id)
}
