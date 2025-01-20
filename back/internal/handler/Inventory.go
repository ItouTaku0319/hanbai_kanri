package handler

import (
	"encoding/json"
	"hanbai_kanri/internal/repository"
	"net/http"
)

type InventoryResponse struct {
	ID          uint   `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Price       int    `json:"price"`
	Stock       int    `json:"stock"`
}

type InventoryHandler struct {
	repo repository.InventoryRepository
}

func NewInventoryHandler(repo repository.InventoryRepository) *InventoryHandler {
	return &InventoryHandler{
		repo: repo,
	}
}

func (h *InventoryHandler) GetAllInventory(w http.ResponseWriter, r *http.Request) {
	inventories, err := h.repo.FindAll(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// レスポンスデータを整形
	response := make([]InventoryResponse, len(inventories))
	for i, inv := range inventories {
		response[i] = InventoryResponse{
			ID:          inv.ID,
			Name:        inv.Syohin,
			Description: "", // 現状は空文字列
			Price:       13, // 現状は0
			Stock:       inv.ZaikoSu,
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
