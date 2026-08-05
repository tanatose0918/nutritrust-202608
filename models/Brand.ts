import { Schema, model, models, Document } from 'mongoose';
import { IBrand } from '@/types/traceability';

export interface IBrandDocument extends IBrand, Document {}

const BrandSchema = new Schema<IBrandDocument>({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    provide_at: { type: String, required: true },
    provider_list: [{ type: String, ref: 'Provider' }]
}, { timestamps: true });

export const BrandModel = models.Brand || model<IBrandDocument>('Brand', BrandSchema);
