-- docker/postgres/init/01_create_tables.sql

-- ユーザーマスタ
CREATE TABLE users (
    user_id TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    mail TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 受注
CREATE TABLE orders (
    jyutyu_no TEXT PRIMARY KEY,
    jyutyu_date DATE NOT NULL,
    noki DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 受注明細
CREATE TABLE order_details (
    jyutyu_no TEXT,
    jyutyu_line_no INTEGER,
    syohin TEXT NOT NULL,
    jyutyu_su INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (jyutyu_no, jyutyu_line_no),
    FOREIGN KEY (jyutyu_no) REFERENCES orders(jyutyu_no)
);

-- 受注管理
CREATE TABLE order_status (
    jyutyu_no TEXT PRIMARY KEY,
    jyotai BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (jyutyu_no) REFERENCES orders(jyutyu_no)
);

-- 出荷
CREATE TABLE shipments (
    syukka_no TEXT PRIMARY KEY,
    jyutyu_no TEXT NOT NULL,
    jyutyu_line_no INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (jyutyu_no, jyutyu_line_no) REFERENCES order_details(jyutyu_no, jyutyu_line_no)
);

-- 出荷管理
CREATE TABLE shipment_status (
    syukka_no TEXT PRIMARY KEY,
    jyotai BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (syukka_no) REFERENCES shipments(syukka_no)
);

-- 在庫
CREATE TABLE inventory (
    syohin TEXT PRIMARY KEY,
    zaiko_su INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 商品
CREATE TABLE products (
    syohin TEXT PRIMARY KEY,
    price INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 商品構成
CREATE TABLE product_materials (
    syohin TEXT,
    sozai TEXT,
    sozai_su INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (syohin, sozai),
    FOREIGN KEY (syohin) REFERENCES products(syohin)
);