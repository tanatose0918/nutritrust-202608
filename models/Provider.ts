import { Schema, model, models, Document } from 'mongoose';
import { IProvider } from '@/types/traceability';

export interface IProviderDocument extends IProvider, Document {}

const ProviderSchema = new Schema<IProviderDocument>({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    traceability_process: { type: String, required: true }
}, { timestamps: true });

export const ProviderModel = models.Provider || model<IProviderDocument>('Provider', ProviderSchema);
