import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IItineraryItem {
    day: number;
    destinationId: Types.ObjectId;
    duration: string;
    notes?: string;
}

export interface IItinerary extends Document {
    userId?: Types.ObjectId;
    title: string;
    budget: number;
    days: number;
    travelers: number;
    preferences: string[];
    items: IItineraryItem[];
    totalEstimatedCost: number;
    isAIGenerated: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ItinerarySchema = new Schema<IItinerary>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        title: { type: String, required: true },
        budget: { type: Number, required: true },
        days: { type: Number, required: true },
        travelers: { type: Number, default: 1 },
        preferences: [{ type: String }],
        items: [
            {
                day: { type: Number, required: true },
                destinationId: { type: Schema.Types.ObjectId, ref: 'Destination', required: true },
                duration: { type: String },
                notes: { type: String },
            },
        ],
        totalEstimatedCost: { type: Number, default: 0 },
        isAIGenerated: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const Itinerary: Model<IItinerary> =
    mongoose.models.Itinerary || mongoose.model<IItinerary>('Itinerary', ItinerarySchema);
