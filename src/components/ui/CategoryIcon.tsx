'use client';

import {
    Waves,
    Mountain,
    Church,
    Landmark,
    TreePine,
    Heart,
    Globe,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Map icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
    'Waves': Waves,
    'Mountain': Mountain,
    'Church': Church,
    'Landmark': Landmark,
    'TreePine': TreePine,
    'Heart': Heart,
    'Globe': Globe,
};

interface CategoryIconProps {
    iconName: string;
    className?: string;
}

export function CategoryIcon({ iconName, className = 'w-5 h-5' }: CategoryIconProps) {
    // Get the icon component from the map, fallback to Globe if not found
    const IconComponent = iconMap[iconName];

    if (!IconComponent) {
        console.warn(`Icon "${iconName}" not found in iconMap, using Globe`);
        return <Globe className={className} />;
    }

    return <IconComponent className={className} />;
}

// Export for debugging
export { iconMap };
