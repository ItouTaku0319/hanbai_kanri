package models

// models/zaiko.go
type Zaiko struct {
	SyohinCode     string `json:"syohin_code"`
	ZaikoSu        int    `json:"zaiko_su"`
	AlertThreshold int    `json:"alert_threshold"`
	SyohinName     string `json:"syohin_name"`
	StockUnit      string `json:"stock_unit"`
}
type Syohin struct {
	SyohinCode string `json:"syohin_code" gorm:"primary_key"`
	SyohinName string `json:"syohin_name"`
	StockUnit  string `json:"stock_unit"`
}
