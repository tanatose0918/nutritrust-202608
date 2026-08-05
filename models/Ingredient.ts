import { Schema, model, models, Document } from 'mongoose';
import { IIngredient } from '@/types/traceability';

export interface IIngredientDocument extends IIngredient, Document {}

const IngredientSchema = new Schema<IIngredientDocument>({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    provider_id: { type: String, required: true, ref: 'Provider' }
}, { timestamps: true });

export const IngredientModel = models.Ingredient || model<IIngredientDocument>('Ingredient', IngredientSchema);
