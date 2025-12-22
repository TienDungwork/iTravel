import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Province } from '@/models';

export async function GET() {
    try {
        await connectDB();

        const provinces = await Province.find({ isActive: true })
            .sort({ region: 1, name: 1 })
            .lean();

        // Group by region
        const grouped = {
            'Bắc': provinces.filter(p => p.region === 'Bắc'),
            'Trung': provinces.filter(p => p.region === 'Trung'),
            'Nam': provinces.filter(p => p.region === 'Nam'),
        };

        return NextResponse.json({
            success: true,
            data: provinces,
            grouped,
        });
    } catch (error) {
        console.error('Provinces API error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch provinces' },
            { status: 500 }
        );
    }
}
