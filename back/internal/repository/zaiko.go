package repository

import (
	"hanbai_kanri/internal/utils"
	"hanbai_kanri/models"

	"gorm.io/gorm"
)

// ZaikoRepository は在庫データの操作を担当
type ZaikoRepository struct {
	db *gorm.DB
}

// NewZaikoRepository は ZaikoRepository のインスタンスを生成
func NewZaikoRepository(db *gorm.DB) *ZaikoRepository {
	return &ZaikoRepository{db: db}
}

// GetZaikoList は在庫一覧を取得（検索条件付き）
func (r *ZaikoRepository) GetZaikoList(code string, isLeftMatch bool, name string, zaikoSuMax int, lowStockOnly bool) ([]models.Zaiko, error) {
	var zaikoList []models.Zaiko
	query := r.db.Table("zaiko").
		Select("zaiko.syohin_code, zaiko.zaiko_su, syohin.syohin_name, syohin.stock_unit, syohin.price, syohin.reorder_point").
		Joins("INNER JOIN syohin ON zaiko.syohin_code = syohin.syohin_code")

	// 商品コードでの検索
	if code != "" {
		if isLeftMatch {
			query = query.Where("zaiko.syohin_code LIKE ?", code+"%")
		} else {
			query = query.Where("zaiko.syohin_code LIKE ?", "%"+code+"%")
		}
	}

	// 商品名での検索
	if name != "" {
		query = query.Where("syohin.syohin_name LIKE ?", "%"+name+"%")
	}

	// 在庫数以下の条件
	if zaikoSuMax > 0 {
		query = query.Where("zaiko.zaiko_su <= ?", zaikoSuMax)
	}

	// 発注点以下の条件
	if lowStockOnly {
		query = query.Where("zaiko.zaiko_su <= syohin.reorder_point * 1.5")
	}

	err := query.Find(&zaikoList).Error
	if err != nil {
		return nil, utils.WrapError("ZaikoRepository.GetZaikoList", err)
	}

	return zaikoList, nil
}
