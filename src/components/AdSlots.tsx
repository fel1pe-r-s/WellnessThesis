import React from 'react';

export function TopAd({ script }: { script?: string }) {
  if (!script) return (
    <div className="bg-gray-100 dark:bg-[#1a2421] py-4 text-center text-xs text-gray-400 dark:text-gray-500 border-dashed border-2 border-border dark:border-[#2a3d38]">
      TOP AD SLOT (Google Ads)
    </div>
  );
  return <div dangerouslySetInnerHTML={{ __html: script }} />;
}

export function SidebarAd({ script }: { script?: string }) {
  if (!script) return (
    <div className="bg-gray-100 dark:bg-[#1a2421] h-64 flex items-center justify-center text-xs text-gray-400 dark:text-gray-500 border-dashed border-2 border-border dark:border-[#2a3d38] rounded-xl">
      SIDEBAR AD SLOT
    </div>
  );
  return <div dangerouslySetInnerHTML={{ __html: script }} />;
}

export function InFeedAd({ script }: { script?: string }) {
  if (!script) return (
    <div className="bg-[#FDFDEA] dark:bg-[#1a2421] border-2 border-[#FFC857] dark:border-[#5ea40d] p-6 rounded-xl text-center text-xs text-gray-400 dark:text-gray-500 border-dashed">
      IN-FEED NATIVE AD SLOT
    </div>
  );
  return <div dangerouslySetInnerHTML={{ __html: script }} />;
}
