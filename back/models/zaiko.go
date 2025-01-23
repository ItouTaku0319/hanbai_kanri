package models

// models/zaiko.go
type Zaiko struct {
	SyohinCode     string `json:"syohin_code" gorm:"primary_key"`
	ZaikoSu        int    `json:"zaiko_su"`
	AlertThreshold int    `json:"alert_threshold"`
	Syohin         Syohin `json:"syohin" gorm:"foreignKey:SyohinCode"`
}

type Syohin struct {
	SyohinCode string `json:"syohin_code" gorm:"primary_key"`
	SyohinName string `json:"syohin_name"`
	StockUnit  string `json:"stock_unit"`
}
