// ファイル: internal/service/zaiko.go

package service

import (
	// models は hanbai_kanri/models に
	"hanbai_kanri/models"

	// repository は internal/repository/zaiko.go (package repository)
	"hanbai_kanri/internal/repository"
)

type ZaikoService struct {
	repo *repository.ZaikoRepository
}

func NewZaikoService(repo *repository.ZaikoRepository) *ZaikoService {
	return &ZaikoService{repo: repo}
}

func (s *ZaikoService) GetZaikoList() ([]models.Zaiko, error) {
	return s.repo.GetZaikoList()
}
