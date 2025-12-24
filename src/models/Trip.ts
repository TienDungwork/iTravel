import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ITrip extends Document {
    userId: Types.ObjectId;
    name: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    destinations: {
        destinationId: Types.ObjectId;
        order: number;
        notes?: string;
        plannedDate?: Date;
    }[];
    budget?: number;
    travelers?: number;
    status: 'planning' | 'ongoing' | 'completed';
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const TripSchema = new Schema<ITrip>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        name: { type: String, required: true, default: 'Chuyến đi của tôi' },
        description: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        destinations: [
            {
                destinationId: { type: Schema.Types.ObjectId, ref: 'Destination', required: true },
                order: { type: Number, default: 0 },
                notes: { type: String },
                plannedDate: { type: Date },
            },
        ],
        budget: { type: Number },
        travelers: { type: Number, default: 1 },
        status: { type: String, enum: ['planning', 'ongoing', 'completed'], default: 'planning' },
        isPublic: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Indexes
TripSchema.index({ userId: 1, createdAt: -1 });

export const Trip: Model<ITrip> =
    mongoose.models.Trip || mongoose.model<ITrip>('Trip', TripSchema);
