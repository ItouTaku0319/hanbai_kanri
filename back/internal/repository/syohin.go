package repository

import (
	"hanbai_kanri/internal/utils"
	"hanbai_kanri/models"

	"gorm.io/gorm"
)

// SyohinRepository は商品データの操作を担当
type SyohinRepository struct {
	db *gorm.DB
}

// NewZaikoRepository は ZaikoRepository のインスタンスを生成
func NewSyohinRepository(db *gorm.DB) *SyohinRepository {
	return &SyohinRepository{db: db}
}

// GetSyohinList は商品一覧を取得（検索条件付き）
func (r *SyohinRepository) GetSyohinList(code string, isLeftMatch bool, name string, syohinType *bool, category string, subCategory string, lowStockOnly bool) ([]models.Syohin, error) {
	var syohinList []models.Syohin
	query := r.db.Table("syohin").
		Select(`
			syohin.syohin_code, 
			syohin.syohin_name, 
			syohin.stock_unit, 
			syohin.price, 
			syohin.reorder_point,
			syohin.category, 
			syohin.sub_category, 
			syohin.syohin_type, 
			syohin.safety_stock, 
			COALESCE(kbn1.kbn_value_name, '') as category_name, 
			COALESCE(kbn2.kbn_value_name, 'なし') as sub_category_name
		`).
		Joins("LEFT JOIN kbn_item AS kbn1 ON CAST(syohin.category AS TEXT) = kbn1.kbn_value AND kbn1.kbn_name = ?", "ITEM_CATEGORY").
		Joins("LEFT JOIN kbn_item AS kbn2 ON CAST(CONCAT(syohin.category, syohin.sub_category) AS TEXT) = kbn2.kbn_value AND kbn2.kbn_name = ?", "ITEM_SUB_CATEGORY")

	// 商品コードでの検索
	if code != "" {
		if isLeftMatch {
			query = query.Where("syohin.syohin_code LIKE ?", code+"%")
		} else {
			query = query.Where("syohin.syohin_code LIKE ?", "%"+code+"%")
		}
	}

	// 商品名での検索
	if name != "" {
		query = query.Where("syohin.syohin_name LIKE ?", "%"+name+"%")
	}

	// 商品素材区分での検索
	if syohinType != nil {
		query = query.Where("syohin.syohin_type = ?", *syohinType)
	}

	// カテゴリーでの検索
	if category != "" {
		query = query.Where("syohin.category = ?", category)
	}

	// サブカテゴリーでの検索
	if subCategory != "" {
		// 先頭一桁を削除
		if len(subCategory) > 1 {
			subCategory = subCategory[1:]
		}
		query = query.Where("syohin.sub_category = ?", subCategory)
	}

	err := query.Find(&syohinList).Error
	if err != nil {
		return nil, utils.WrapError("SyohinRepository.GetSyohinList", err)
	}

	return syohinList, nil
}

// GetSyohinKoseiList は指定された商品コードの商品構成一覧を取得
func (r *SyohinRepository) GetSyohinKoseiList(syohinCode string) ([]models.SyohinKosei, error) {
	var koseiList []models.SyohinKosei

	query := r.db.Table("syohin_kosei").
		Select(`
			syohin_kosei.syohin_code,
			syohin_kosei.sozai as sozai_code,
			syohin_kosei.sozai_su,
			s.syohin_name as sozai_name,
			s.stock_unit as sozai_unit,
			COALESCE(k.kbn_value_name, '') as category_name,
			s.syohin_type
		`).
		Joins("LEFT JOIN syohin s ON syohin_kosei.sozai = s.syohin_code").
		Joins("LEFT JOIN kbn_item k ON CAST(s.category AS TEXT) = k.kbn_value AND k.kbn_name = ?", "ITEM_CATEGORY").
		Where("syohin_kosei.syohin_code = ?", syohinCode)

	err := query.Find(&koseiList).Error
	if err != nil {
		return nil, utils.WrapError("SyohinRepository.GetSyohinKoseiList", err)
	}

	return koseiList, nil
}

// GetSyohinWithKosei は商品情報と構成情報を一緒に取得
func (r *SyohinRepository) GetSyohinWithKosei(syohinCode string) (*models.Syohin, []models.SyohinKosei, error) {
	// 商品基本情報の取得
	var syohin models.Syohin
	err := r.db.Table("syohin").
		Select(`
			syohin.syohin_code,
			syohin.syohin_name,
			syohin.stock_unit,
			syohin.price,
			syohin.reorder_point,
			syohin.category,
			syohin.sub_category,
			syohin.syohin_type,
			syohin.safety_stock,
			COALESCE(kbn1.kbn_value_name, '') as category_name,
			COALESCE(kbn2.kbn_value_name, 'なし') as sub_category_name
		`).
		Joins("LEFT JOIN kbn_item AS kbn1 ON CAST(syohin.category AS TEXT) = kbn1.kbn_value AND kbn1.kbn_name = ?", "ITEM_CATEGORY").
		Joins("LEFT JOIN kbn_item AS kbn2 ON CAST(CONCAT(syohin.category, syohin.sub_category) AS TEXT) = kbn2.kbn_value AND kbn2.kbn_name = ?", "ITEM_SUB_CATEGORY").
		Where("syohin.syohin_code = ?", syohinCode).
		First(&syohin).Error
	if err != nil {
		return nil, nil, utils.WrapError("SyohinRepository.GetSyohinWithKosei", err)
	}

	// 商品構成情報の取得
	koseiList, err := r.GetSyohinKoseiList(syohinCode)
	if err != nil {
		return nil, nil, err
	}

	return &syohin, koseiList, nil
}
