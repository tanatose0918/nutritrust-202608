// ==========================================
// NutriTrust Traceability Layer Interfaces
// ==========================================

// 1. Provider (ผู้ผลิตสารสกัด/โรงงานวัตถุดิบต้นน้ำ)
export interface IProvider {
    id: string; // P_Key (เช่น prov_001)
    name: string;
    traceability_process: string; // คำอธิบายระบบตรวจสอบย้อนกลับ
}

// 2. Ingredient (ส่วนประกอบ/สารอาหารหลัก)
export interface IIngredient {
    id: string; // P_Key (เช่น igd_001)
    name: string;
    provider_id: string; // F_Key ชี้ไปที่ Provider
}

// 3. Brand (แบรนด์อาหารเสริม)
export interface IBrand {
    id: string; // P_Key (เช่น br_001)
    name: string;
    provide_at: string; // แหล่งประเทศต้นกำเนิดหรือจัดส่ง (เช่น Australia, USA)
    provider_list: string[]; // F_Keys[] ชี้ไปที่ Providers ที่ใช้ในสินค้าแบรนด์นี้
}

// 4. Ingredient Item Sub-document (รายการสารสกัดในสินค้า)
export interface IIngredientItem {
    igd_id: string; // F_Key ชี้ไปที่ Ingredient
    volume: string; // ปริมาณต่อหน่วยบริโภค เช่น "1000mg", "40mg"
}

// 5. Product (ผลิตภัณฑ์ปลายน้ำที่ผู้ใช้ค้นหา)
export interface IProduct {
    id: string; // P_Key (เช่น p_001)
    brand_id: string; // F_Key ชี้ไปที่ Brand
    name: string; // ชื่ออาหารเสริม เช่น "Blackmores Bio C 1000 mg"
    category_slug: string; // หมวดหมู่ เช่น "vitamin-c", "magnesium"
    sub_category: string | null; // หมวดหมู่ย่อย ถ้ามี
    ingredient_list: IIngredientItem[]; // รายการสารสกัด
    serving_package: string; // บรรจุภัณฑ์ เช่น "tablet-150"
    min_price: number; // ราคาเริ่มต้น
    max_price: number | null; // ราคาสูงสุด ถ้ามี
}
