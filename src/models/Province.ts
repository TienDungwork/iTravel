import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProvince extends Document {
    name: string;
    code: string;
    region: 'Bắc' | 'Trung' | 'Nam';
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ProvinceSchema = new Schema<IProvince>(
    {
        name: { type: String, required: true },
        code: { type: String, required: true, unique: true },
        region: { type: String, enum: ['Bắc', 'Trung', 'Nam'], required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const Province: Model<IProvince> =
    mongoose.models.Province || mongoose.model<IProvince>('Province', ProvinceSchema);
