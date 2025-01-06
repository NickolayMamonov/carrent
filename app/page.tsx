import { HeroSection } from '@/components/sections/HeroSection';
import { FeatureSection } from '@/components/sections/FeatureSection';
import FeaturedCarsSection from '@/components/sections/FeaturedCarsSection';
import { CTASection } from '@/components/sections/CTASection';

export default function Home() {
    return (
        <div className="space-y-24 pb-8">
            <HeroSection />
            <FeatureSection />
            <FeaturedCarsSection />
            <CTASection />
        </div>
    );
}