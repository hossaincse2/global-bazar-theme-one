'use client';

import React, { useEffect, useState } from 'react';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import { getCmsBlocks } from '@/services/cmsService';
import { CmsBlock } from '@/types/cms';
import { Phone, Mail, Sparkles } from 'lucide-react';

interface AnnouncementBarProps {
  cmsBlock?: CmsBlock | null;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ cmsBlock: propBlock }) => {
  const { settings, currencyIcon } = useSiteSettings();
  const [block, setBlock] = useState<CmsBlock | null | undefined>(propBlock);

  useEffect(() => {
    if (propBlock !== undefined) return;
    
    async function loadAnnouncementBlock() {
      try {
        const blocks = await getCmsBlocks('en');
        const announcementBlock = blocks?.find((b: CmsBlock) => b.key === 'announcement_bar');
        setBlock(announcementBlock || null);
      } catch (err) {
        console.warn('Failed to load announcement CMS block:', err);
      }
    }

    loadAnnouncementBlock();
  }, [propBlock]);

  // If announcement block explicitly exists and is set inactive, hide bar
  if (block && block.is_active === false) {
    return null;
  }

  const announcementText = block?.title || block?.description || settings?.announcement_text;

  if (!announcementText) return null;

  return (
    <div className="bg-slate-900 text-white text-xs py-2 px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-2 text-amber-400 font-medium">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span className="truncate max-w-2xl text-slate-200">{announcementText}</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          {settings?.phone && (
            <a href={`tel:${settings.phone}`} className="flex items-center gap-1 hover:text-white transition">
              <Phone className="w-3 h-3 text-blue-400" />
              <span>{settings.phone}</span>
            </a>
          )}
          {settings?.email && (
            <a href={`mailto:${settings.email}`} className="hidden sm:flex items-center gap-1 hover:text-white transition">
              <Mail className="w-3 h-3 text-emerald-400" />
              <span>{settings.email}</span>
            </a>
          )}
          <span className="bg-slate-800 px-2 py-0.5 rounded text-amber-300 font-bold">
            Currency: {currencyIcon}
          </span>
        </div>
      </div>
    </div>
  );
};
