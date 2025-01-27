package models

// models/syohin.go

type KbnItem struct {
	KbnValue     string `json:"kbn_value" gorm:"primaryKey"`
	KbnName      string `json:"kbn_name"`
	KbnValueName string `json:"kbn_value_name"`
	HyojiJun     string `json:"hyoji_jun"`
	Category     string `json:"category"`
}

// 明示的にテーブル名を指定
func (KbnItem) TableName() string {
	return "kbn_item"
}

// SyohinKosei は商品構成を表す構造体
type SyohinKosei struct {
	SyohinCode   string  `json:"syohin_code"`
	SozaiCode    string  `json:"sozai_code"`
	SozaiSu      float64 `json:"sozai_su"`
	SozaiName    string  `json:"sozai_name"`    // JOINで取得
	SozaiUnit    string  `json:"sozai_unit"`    // JOINで取得
	CategoryName string  `json:"category_name"` // JOINで取得
	SyohinType   bool    `json:"syohin_type"`   // JOINで取得
}

func (SyohinKosei) TableName() string {
	return "syohin_kosei"
}
