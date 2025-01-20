package models

import (
	"time"
)

type Inventory struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Syohin    string    `gorm:"column:syohin" json:"name"`
	ZaikoSu   int       `gorm:"column:zaiko_su" json:"stock"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// TableName is used to set the table name for GORM
func (Inventory) TableName() string {
	return "inventory"
}
