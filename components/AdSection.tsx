
import React, { useEffect, useRef } from 'react';
import { AdSlot } from '../types';

interface AdSectionProps {
  type: 'leaderboard' | 'rectangle' | 'square';
  slot?: AdSlot;
  className?: string;
  globalEnabled?: boolean;
}

const AdSection: React.FC<AdSectionProps> = ({ type, slot, className = '', globalEnabled = true }) => {
  const adRef = useRef<HTMLDivElement>(null);

  const isActive = globalEnabled && slot?.active && slot?.code && slot.code.trim() !== '';

  useEffect(() => {
    if (isActive && typeof window !== 'undefined') {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) {
        // Silently fail if AdSense script isn't loaded
      }
    }
  }, [isActive, slot?.code]);

  const getResponsiveClasses = () => {
    switch (type) {
      case 'leaderboard': 
        // Responsive height: 50px on mobile, 90px on tablet/desktop
        return 'min-h-[50px] md:min-h-[90px] w-full';
      case 'rectangle': 
        // Standard MPU height
        return 'min-h-[250px] w-full';
      case 'square': 
        return 'aspect-square w-full';
      default: 
        return 'min-h-[100px] w-full';
    }
  };

  if (!isActive) {
    // Return null to hide the slot completely if not active.
    // This ensures no "Ad Slot Offline" placeholders are visible to regular users.
    return null;
  }

  return (
    <div 
      ref={adRef}
      className={`relative flex justify-center items-center overflow-hidden ${getResponsiveClasses()} ${className}`}
      // Removed inline style minHeight to allow CSS classes to control responsive height
      dangerouslySetInnerHTML={{ __html: slot!.code }}
    />
  );
};

export default AdSection;
