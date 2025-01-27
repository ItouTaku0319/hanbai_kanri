package models

// models/zaiko.go
type Zaiko struct {
	SyohinCode   string `json:"syohin_code"`
	ZaikoSu      int    `json:"zaiko_su"`
	SyohinName   string `json:"syohin_name"`
	StockUnit    string `json:"stock_unit"`
	Price        int    `json:"price"`
	ReorderPoint int    `json:"reorder_point"` // syohin から取得
}

// 明示的にテーブル名を指定
func (Zaiko) TableName() string {
	return "zaiko"
}

type Syohin struct {
	SyohinCode      string `json:"syohin_code" gorm:"primaryKey"`
	SyohinName      string `json:"syohin_name"`
	Price           int    `json:"price"`
	SyohinType      bool   `json:"syohin_type"`
	Category        int    `json:"category"`
	SubCategory     int    `json:"sub_category"`
	CategoryName    string `json:"category_name"`
	SubCategoryName string `json:"sub_category_name"`
	StockUnit       string `json:"stock_unit"`
	SafetyStock     int    `json:"safety_stock"`
	ReorderPoint    int    `json:"reorder_point"`
}

// 明示的にテーブル名を指定
func (Syohin) TableName() string {
	return "syohin"
}
