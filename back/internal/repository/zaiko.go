package repository

import (
	"hanbai_kanri/models"

	"gorm.io/gorm"
)

type ZaikoRepository struct {
	db *gorm.DB
}

func NewZaikoRepository(db *gorm.DB) *ZaikoRepository {
	return &ZaikoRepository{db: db}
}

func (r *ZaikoRepository) GetZaikoList(code string, isLeftMatch bool, name string, zaikoSuMax int, lowStockOnly bool) ([]models.Zaiko, error) {
	var zaikoList []models.Zaiko
	dbQuery := r.db.Table("zaiko").
		Select("zaiko.*, syohin.syohin_name AS syohin_name, syohin.stock_unit AS stock_unit, syohin.price AS price, syohin.reorder_point AS reorder_point").
		Joins("INNER  JOIN syohin ON zaiko.syohin_code = syohin.syohin_code")

	// 商品コード検索（先頭一致 or 部分一致を切り替え）
	if code != "" {
		if isLeftMatch {
			dbQuery = dbQuery.Where("zaiko.syohin_code LIKE ?", code+"%") // 先頭一致
		} else {
			dbQuery = dbQuery.Where("zaiko.syohin_code ILIKE ?", "%"+code+"%") // 部分一致
		}
	}

	// 商品名で検索
	if name != "" {
		dbQuery = dbQuery.Where("syohin.syohin_name ILIKE ?", "%"+name+"%")
	}

	// 在庫数以下のデータを取得
	if zaikoSuMax > 0 {
		dbQuery = dbQuery.Where("zaiko.zaiko_su <= ?", zaikoSuMax)
	}

	// 在庫数が発注点の 1.5 倍以下のデータを取得
	if lowStockOnly {
		dbQuery = dbQuery.Where("zaiko.zaiko_su <= syohin.reorder_point * 1.5")
	}

	err := dbQuery.Find(&zaikoList).Error
	return zaikoList, err
}
