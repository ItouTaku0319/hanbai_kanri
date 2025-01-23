-- docker/postgres/init/01_create_tables.sql

--トラン系

-- 受注
CREATE TABLE jyutyu (
    jyutyu_no TEXT PRIMARY KEY,
    jyutyu_date DATE NOT NULL,
    noki DATE NOT NULL,
    note TEXT,
    create_type INTEGER NOT NULL DEFAULT 0,  -- 0:画面入力 1:CSV取込 2:その他
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE jyutyu IS '受注';

COMMENT ON COLUMN jyutyu.jyutyu_no IS '受注番号';
COMMENT ON COLUMN jyutyu.jyutyu_date IS '受注日';
COMMENT ON COLUMN jyutyu.noki IS '納期';
COMMENT ON COLUMN jyutyu.note IS '備考';
COMMENT ON COLUMN jyutyu.create_type IS '作成区分';
COMMENT ON COLUMN jyutyu.created_at IS '作成日時';
COMMENT ON COLUMN jyutyu.updated_at IS '更新日時';

-- 受注明細
CREATE TABLE jyutyu_meisai (
    jyutyu_no TEXT,
    jyutyu_line_no INTEGER,
    syohin_code TEXT NOT NULL,
    jyutyu_su INTEGER NOT NULL,
    tanka INTEGER,
    shoukei INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (jyutyu_no, jyutyu_line_no)
);

COMMENT ON TABLE jyutyu_meisai IS '受注明細';

COMMENT ON COLUMN jyutyu_meisai.jyutyu_no IS '受注番号';
COMMENT ON COLUMN jyutyu_meisai.jyutyu_line_no IS '受注行番号';
COMMENT ON COLUMN jyutyu_meisai.syohin_code IS '商品コード';
COMMENT ON COLUMN jyutyu_meisai.jyutyu_su IS '受注数';
COMMENT ON COLUMN jyutyu_meisai.tanka IS '単価';
COMMENT ON COLUMN jyutyu_meisai.shoukei IS '小計';
COMMENT ON COLUMN jyutyu_meisai.created_at IS '作成日時';
COMMENT ON COLUMN jyutyu_meisai.updated_at IS '更新日時';

-- 受注状態履歴
CREATE TABLE jyutyu_kanri (
    jyutyu_no TEXT,
    jyutyu_line_no INTEGER,
    status INTEGER NOT NULL,            -- 0:受注 1:出荷完了
    syukka_zumi_su INTEGER NOT NULL DEFAULT 0,
    change_datetime TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (jyutyu_no, jyutyu_line_no)
);

COMMENT ON TABLE jyutyu_kanri IS '受注管理';

COMMENT ON COLUMN jyutyu_kanri.jyutyu_no IS '受注番号';
COMMENT ON COLUMN jyutyu_kanri.jyutyu_line_no IS '行番号';
COMMENT ON COLUMN jyutyu_kanri.status IS '状態';
COMMENT ON COLUMN jyutyu_kanri.syukka_zumi_su IS '出荷済数量';
COMMENT ON COLUMN jyutyu_kanri.change_datetime IS '状態変更日時';
COMMENT ON COLUMN jyutyu_kanri.note IS '備考';
COMMENT ON COLUMN jyutyu_kanri.created_at IS '作成日時';
COMMENT ON COLUMN jyutyu_kanri.updated_at IS '更新日時';

-- 出荷
CREATE TABLE shukka (
    syukka_no TEXT PRIMARY KEY,
    syukka_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE shukka IS '出荷';

COMMENT ON COLUMN shukka.syukka_no IS '出荷番号';
COMMENT ON COLUMN shukka.syukka_date IS '出荷日';
COMMENT ON COLUMN shukka.created_at IS '作成日時';
COMMENT ON COLUMN shukka.updated_at IS '更新日時';

-- 出荷明細
CREATE TABLE shukka_meisai (
    syukka_no TEXT,
    syukka_line_no INTEGER,
    jyutyu_no TEXT NOT NULL,
    jyutyu_line_no INTEGER NOT NULL,
    syohin_code TEXT NOT NULL,
    syukka_su INTEGER NOT NULL,
    add_flg BOOLEAN NOT NULL DEFAULT false,  -- 追加商品フラグ
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (syukka_no, syukka_line_no)
);

COMMENT ON TABLE shukka_meisai IS '出荷明細';

COMMENT ON COLUMN shukka_meisai.syukka_no IS '出荷番号';
COMMENT ON COLUMN shukka_meisai.syukka_line_no IS '出荷行番号';
COMMENT ON COLUMN shukka_meisai.jyutyu_no IS '受注番号';
COMMENT ON COLUMN shukka_meisai.jyutyu_line_no IS '受注行番号';
COMMENT ON COLUMN shukka_meisai.syohin_code IS '商品コード';
COMMENT ON COLUMN shukka_meisai.syukka_su IS '出荷数';
COMMENT ON COLUMN shukka_meisai.add_flg IS '追加商品フラグ';
COMMENT ON COLUMN shukka_meisai.created_at IS '作成日時';
COMMENT ON COLUMN shukka_meisai.updated_at IS '更新日時';

--マスタ系

-- ユーザーマスタ
CREATE TABLE users (
    user_id TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    user_name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- テーブルのコメント
COMMENT ON TABLE users IS 'ユーザーマスタ';
-- カラムごとのコメント
COMMENT ON COLUMN users.user_id IS 'ユーザーID';
COMMENT ON COLUMN users.password IS 'パスワード';
COMMENT ON COLUMN users.user_name IS 'ユーザー名';
COMMENT ON COLUMN users.is_active IS '有効状態';
COMMENT ON COLUMN users.created_at IS '作成日時';
COMMENT ON COLUMN users.updated_at IS '更新日時';

-- 商品
CREATE TABLE syohin (
    syohin_code TEXT PRIMARY KEY,
    syohin_name TEXT NOT NULL,
    price INTEGER NOT NULL,
    syohin_type BOOLEAN DEFAULT false, -- falseだったら商品ではない＝素材
    category TEXT NOT NULL, --区分値マスタに値を持ってあげたほうが良さそう。
    stock_unit TEXT NOT NULL,
    note TEXT,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE syohin IS '商品';

COMMENT ON COLUMN syohin.syohin_code IS '商品コード';
COMMENT ON COLUMN syohin.syohin_name IS '商品名';
COMMENT ON COLUMN syohin.price IS '価格';
COMMENT ON COLUMN syohin.syohin_type IS '商品素材タイプ';
COMMENT ON COLUMN syohin.category IS 'カテゴリー';
COMMENT ON COLUMN syohin.stock_unit IS '商品単位';
COMMENT ON COLUMN syohin.note IS '備考';
COMMENT ON COLUMN syohin.is_active IS '有効状態';
COMMENT ON COLUMN syohin.created_at IS '作成日時';
COMMENT ON COLUMN syohin.updated_at IS '更新日時';

-- 商品構成
CREATE TABLE syohin_kosei (
    syohin_code TEXT,
    sozai TEXT,
    sozai_su INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (syohin_code, sozai)
);
COMMENT ON TABLE syohin_kosei IS '商品構成';

COMMENT ON COLUMN syohin_kosei.syohin_code IS '商品コード';
COMMENT ON COLUMN syohin_kosei.sozai IS '素材';
COMMENT ON COLUMN syohin_kosei.sozai_su IS '素材数';
COMMENT ON COLUMN syohin_kosei.created_at IS '作成日時';
COMMENT ON COLUMN syohin_kosei.updated_at IS '更新日時';

-- 区分値マスタ
CREATE TABLE kbn_item (
    kbn_name TEXT,
    kbn_value TEXT,
    kbn_value_name TEXT NOT NULL,
    hyoji_jun INTEGER DEFAULT 0,
    joken_name TEXT,
    joken_naiyo TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (kbn_name, kbn_value)
);
COMMENT ON TABLE kbn_item IS '区分値マスタ';

COMMENT ON COLUMN kbn_item.kbn_name IS '区分名称';
COMMENT ON COLUMN kbn_item.kbn_value IS '区分値';
COMMENT ON COLUMN kbn_item.kbn_value_name IS '区分値名称';
COMMENT ON COLUMN kbn_item.hyoji_jun IS '表示順';
COMMENT ON COLUMN kbn_item.joken_name IS '条件名称';
COMMENT ON COLUMN kbn_item.joken_naiyo IS '条件内容';
COMMENT ON COLUMN kbn_item.is_active IS '有効状態';
COMMENT ON COLUMN kbn_item.created_at IS '作成日時';
COMMENT ON COLUMN kbn_item.updated_at IS '更新日時';


-- 在庫
CREATE TABLE zaiko (
    syohin_code TEXT PRIMARY KEY,
    zaiko_su INTEGER NOT NULL DEFAULT 0,
    alert_threshold INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE zaiko IS '在庫';

COMMENT ON COLUMN zaiko.syohin_code IS '商品コード';
COMMENT ON COLUMN zaiko.zaiko_su IS '在庫数';
COMMENT ON COLUMN zaiko.alert_threshold IS '在庫警告レベル';
COMMENT ON COLUMN zaiko.created_at IS '作成日時';
COMMENT ON COLUMN zaiko.updated_at IS '更新日時';

-- 在庫履歴
CREATE TABLE zaiko_rireki (
    rireki_id SERIAL PRIMARY KEY,
    syohin_code TEXT NOT NULL,
    denpyo_type INTEGER NOT NULL,     -- 1:出荷,2:製錬,3:在庫補充
    denpyo_no_line_no TEXT NOT NULL,
    nyuko_type INTEGER,            -- 1:製錬,2:在庫補充
    shukko_type INTEGER,           -- 1:出荷,2:製錬材料消費
    genzai_zaikosu INTEGER NOT NULL,
    idou_su INTEGER NOT NULL,      -- 常に正の値
    koushin_user TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE zaiko_rireki IS '在庫履歴';

COMMENT ON COLUMN zaiko_rireki.rireki_id IS 'ID';
COMMENT ON COLUMN zaiko_rireki.syohin_code IS '商品コード';
COMMENT ON COLUMN zaiko_rireki.denpyo_type IS '伝票タイプ';
COMMENT ON COLUMN zaiko_rireki.denpyo_no_line_no IS '伝票番号-行番号';
COMMENT ON COLUMN zaiko_rireki.nyuko_type IS '入庫タイプ';
COMMENT ON COLUMN zaiko_rireki.shukko_type IS '出庫タイプ';
COMMENT ON COLUMN zaiko_rireki.genzai_zaikosu IS '現在在庫数';
COMMENT ON COLUMN zaiko_rireki.idou_su IS '移動数';
COMMENT ON COLUMN zaiko_rireki.koushin_user IS '更新者';
COMMENT ON COLUMN zaiko_rireki.created_at IS '作成日時';

/*
-- 製錬関連後から機能追加する
-- 製錬レシピ
CREATE TABLE seiren_recipe (
    recipe_code TEXT PRIMARY KEY,
    output_code TEXT NOT NULL,    -- 生成物の商品コード
    output_su INTEGER NOT NULL,   -- 生成数
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 製錬レシピ明細
CREATE TABLE seiren_recipe_meisai (
    recipe_code TEXT,
    sozai_code TEXT,             -- 必要素材の商品コード
    hitsuyou_su INTEGER NOT NULL, -- 必要数
    PRIMARY KEY (recipe_code, sozai_code)
);

-- 製錬実績
CREATE TABLE seiren_jisseki (
    seiren_no TEXT PRIMARY KEY,
    recipe_code TEXT NOT NULL,
    seiren_date DATE NOT NULL,
    output_su INTEGER NOT NULL
);
*/
