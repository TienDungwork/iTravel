import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IDestination extends Document {
    name: string;
    slug: string;
    categoryId: Types.ObjectId;
    provinceId: Types.ObjectId;
    description: string;
    shortDescription: string;
    images: string[];
    priceRange: {
        min: number;
        max: number;
        currency: string;
    };
    bestTime: string[];
    duration: string;
    location: {
        address: string;
        coordinates: {
            lat: number;
            lng: number;
        };
    };
    amenities: string[];
    rating: number;
    reviewCount: number;
    viewCount: number;
    isFeatured: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const DestinationSchema = new Schema<IDestination>(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
        provinceId: { type: Schema.Types.ObjectId, ref: 'Province', required: true },
        description: { type: String, required: true },
        shortDescription: { type: String, required: true },
        images: [{ type: String }],
        priceRange: {
            min: { type: Number, required: true },
            max: { type: Number, required: true },
            currency: { type: String, default: 'VND' },
        },
        bestTime: [{ type: String }],
        duration: { type: String },
        location: {
            address: { type: String },
            coordinates: {
                lat: { type: Number },
                lng: { type: Number },
            },
        },
        amenities: [{ type: String }],
        rating: { type: Number, default: 0 },
        reviewCount: { type: Number, default: 0 },
        viewCount: { type: Number, default: 0 },
        isFeatured: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

DestinationSchema.index({ name: 'text', description: 'text' });
DestinationSchema.index({ categoryId: 1, provinceId: 1 });
DestinationSchema.index({ rating: -1 });

export const Destination: Model<IDestination> =
    mongoose.models.Destination || mongoose.model<IDestination>('Destination', DestinationSchema);
