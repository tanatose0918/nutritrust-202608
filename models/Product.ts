import { Schema, model, models, Document } from 'mongoose';
import { IProduct } from '@/types/traceability';

export interface IProductDocument extends IProduct, Document {}

const SafetyProfileSchema = new Schema({
    warnings: [{ type: String }],
    contraindications: [{ type: String }],
    optimal_intake: { type: String, required: true },
    pros: [{ type: String }],
    considerations: [{ type: String }]
}, { _id: false });

const ProductSchema = new Schema<IProductDocument>({
    id: { type: String, required: true, unique: true },
    brand_id: { type: String, required: true, ref: 'Brand' },
    name: { type: String, required: true },
    category_slug: { type: String, required: true },
    sub_category: { type: String, default: null },
    ingredient_list: [{
        igd_id: { type: String, required: true, ref: 'Ingredient' },
        volume: { type: String, required: true }
    }],
    serving_package: { type: String, required: true },
    min_price: { type: Number, required: true },
    max_price: { type: Number, default: null },
    safety_profile: { type: SafetyProfileSchema },
    evidence_ids: [{ type: String, ref: 'Evidence' }]
}, { timestamps: true });

export const ProductModel = models.Product || model<IProductDocument>('Product', ProductSchema);
