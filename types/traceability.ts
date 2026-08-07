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

// 5. Evidence / Science Summary (คลังงานวิจัยกลาง - Collection science_summaries)
export interface IEvidence {
    evidence_id: string; // P_Key (เช่น ev_fishoil_001)
    id?: string;
    benefit_title: string; // หัวข้อประโยชน์หลัก/ผลลัพธ์วิจัย
    evidence_level: string; // ระดับความน่าเชื่อถือ
    summary: string; // บทสรุปทางวิทยาศาสตร์
    pubmed_ids?: string[]; // อาร์เรย์ของ ID งานวิจัย เช่น ["PMC123456", "PMC789012"]
}

// 6. Safety Profile Sub-document (ข้อมูลความปลอดภัยเฉพาะตัวผลิตภัณฑ์ - Embedded Sub-document ใหม่)
export interface ISafetyProfile {
    warnings: string[]; // คำเตือนทั่วไป
    contraindications: string[]; // ข้อควรระวังพิเศษ/ยาตีกัน (เช่น "ห้ามทานร่วมกับยาละลายลิ่มเลือด")
    optimal_intake: string; // คำแนะนำการทานที่เห็นผลดีที่สุด (เช่น "ควรทานพร้อมอาหารเช้า")
    pros: string[]; // จุดเด่นของแบรนด์นี้
    considerations: string[]; // ข้อควรพิจารณา (ใช้คำนี้เพื่อความเป็นกลางแทนคำว่า ข้อเสีย)
}

// 7. Product (ผลิตภัณฑ์ปลายน้ำที่ผู้ใช้สืบค้น)
export interface IProduct {
    id: string; // P_Key (เช่น p_001)
    brand_id: string; // F_Key ชี้ไปที่ Brand
    name: string; // ชื่ออาหารเสริม เช่น "Blackmores Bio C 1000 mg"
    category_slug: string; // หมวดหมู่ เช่น "vitamin-c", "fish-oil"
    sub_category: string | null; // หมวดหมู่ย่อย ถ้ามี
    ingredient_list: IIngredientItem[]; // รายการสารสกัดที่มี
    serving_package: string; // ขนาดบรรจุ เช่น "tablet-150"
    min_price: number; // ราคาเริ่มต้นสำหรับทำ Price Comparison
    max_price: number | null; // ราคาสูงสุด ถ้ามี
    safety_profile: ISafetyProfile; // ข้อมูลความปลอดภัย (ฝังตัวอยู่ในสินค้าเลย)
    evidence_ids: string[]; // รายการ ID เปเปอร์วิจัยที่เกี่ยวข้อง (อ้างอิงข้าม Collection)
}