'use client';

import { useEffect, useState } from 'react';

/**
 * Common AdSense wrapper that follows the user's specific logic.
 * It remains hidden if no AdSense client ID is provided.
 */
function AdSenseBlock({ slot }: { slot: string }) {
  const [shouldRender, setShouldRender] = useState(false);
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  useEffect(() => {
    // Only attempt to render if we have a valid-looking ID
    if (adsenseId && adsenseId.startsWith('ca-pub-') && adsenseId !== 'ca-pub-XXXX') {
      setShouldRender(true);
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense Error:", e);
      }
    }
  }, [adsenseId]);

  if (!shouldRender) return null;

  return (
    <div style={{ textAlign: 'center', margin: '20px 0' }}>
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

export function TopAd({ slot = 'default-top' }: { slot?: string }) {
  return <AdSenseBlock slot={slot} />;
}

export function InFeedAd({ slot = 'default-infeed' }: { slot?: string }) {
  return <AdSenseBlock slot={slot} />;
}

export function SidebarAd({ slot = 'default-sidebar' }: { slot?: string }) {
  return <AdSenseBlock slot={slot} />;
}

export default function AdBanner({ slot }: { slot: string }) {
  return <AdSenseBlock slot={slot} />;
}
