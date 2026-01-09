'use client';
import { useEffect, useState } from 'react';

interface AdBannerProps {
  slot: string;
}

export default function AdBanner({ slot }: AdBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  useEffect(() => {
    // Only show ads if we have a real AdSense ID and we are in production
    // or if a specific flag is enabled.
    if (adsenseId && adsenseId !== 'ca-pub-XXXX') {
      setIsVisible(true);
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense Error:", e);
      }
    }
  }, [adsenseId]);

  if (!isVisible) return null;

  return (
    <div className="flex justify-center my-8 min-h-[100px] w-full">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adsenseId}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
