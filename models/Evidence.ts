import { Schema, model, models, Document } from 'mongoose';
import { IEvidence } from '@/types/traceability';

export interface IEvidenceDocument extends IEvidence, Document {}

const EvidenceSchema = new Schema<IEvidenceDocument>({
    evidence_id: { type: String, required: true, unique: true },
    id: { type: String },
    benefit_title: { type: String, required: true },
    evidence_level: { type: String, required: true },
    summary: { type: String, required: true },
    pubmed_ids: [{ type: String }]
}, { timestamps: true, collection: 'science_summaries' });

export const EvidenceModel = models.Evidence || model<IEvidenceDocument>('Evidence', EvidenceSchema);
