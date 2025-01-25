-- 区分値マスタの初期データ
INSERT INTO kbn_item (kbn_name, kbn_value, kbn_value_name, hyoji_jun) VALUES
-- 商品カテゴリ
('ITEM_CATEGORY', '1', '武器', 1),
('ITEM_CATEGORY', '2', '防具', 2),
('ITEM_CATEGORY', '3', '素材', 3),
('ITEM_CATEGORY', '4', '鉱石', 4),
('ITEM_SUB_CATEGORY', '11', '剣', 1),
('ITEM_SUB_CATEGORY', '12', '斧', 2),
('ITEM_SUB_CATEGORY', '21', '盾', 1),
('ITEM_SUB_CATEGORY', '22', '鎧', 2);

-- 初期商品データ
INSERT INTO syohin (syohin_code, syohin_name, price, syohin_type, category, sub_category, stock_unit, is_active) VALUES
('11001', '鉄の剣', 100, true, '1', '1', '個', true),
('11002', '鋼の剣', 150, true, '1', '1', '個', true),
('21001', '鉄の盾', 80, true, '2', '1', '個', true),
('21002', 'おなべのふた', 20, true, '2', '1', '個', true),
('30001', '鉄インゴット', 30, false, '3', '0', '個', true),
('30002', '木の棒', 5, false, '3', '0', '個', true),
('40001', '鉄鉱石', 10, false, '4', '0', '個', true);

-- 商品構成データ
INSERT INTO syohin_kosei (syohin_code, sozai, sozai_su) VALUES
('11001', '30001', 3),
('11001', '30002', 2),
('21001', '30001', 5),
('21002', '30002', 3);

-- 初期在庫データ
INSERT INTO zaiko (syohin_code, zaiko_su, alert_threshold) VALUES
('11001', 10, 3),
('11002', 8, 2),
('21001', 10, 3),
('21002', 5, 3),
('30001', 40, 15),
('30002', 30, 10),
('40001', 30, 10);


-- 初期ユーザー
INSERT INTO users (user_id, password, user_name) VALUES 
('admin', 'hashed_password', '管理者');