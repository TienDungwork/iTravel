import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IReview extends Document {
    userId: Types.ObjectId;
    destinationId: Types.ObjectId;
    rating: number;
    title: string;
    comment: string;
    images?: string[];
    isApproved: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        destinationId: { type: Schema.Types.ObjectId, ref: 'Destination', required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        title: { type: String, required: true },
        comment: { type: String, required: true },
        images: [{ type: String }],
        isApproved: { type: Boolean, default: true },
    },
    { timestamps: true }
);

ReviewSchema.index({ destinationId: 1, createdAt: -1 });
ReviewSchema.index({ userId: 1 });

export const Review: Model<IReview> =
    mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
