'use client';

import React from 'react';
import { Store, Star, Info, ExternalLink } from 'lucide-react';
import analyticsData from '@/mockup/products_analytics_mockup.json';
import SpiderChart from './SpiderChart';

interface MerchantScoreChartProps {
  productId: string;
}

const getPlatformStyle = (key: string) => {
  const k = key.toLowerCase();
  if (k.includes('shopee')) {
    return {
      bg: 'bg-orange-50/80 hover:bg-orange-100/90',
      border: 'border-orange-200',
      badgeBg: 'bg-orange-100 text-orange-700',
      soldColor: 'text-orange-800',
      url: (name: string) => `https://shopee.co.th/search?keyword=${encodeURIComponent(name)}`
    };
  }
  if (k.includes('lazada')) {
    return {
      bg: 'bg-blue-50/80 hover:bg-blue-100/90',
      border: 'border-blue-200',
      badgeBg: 'bg-blue-100 text-blue-700',
      soldColor: 'text-blue-800',
      url: (name: string) => `https://www.lazada.co.th/catalog/?q=${encodeURIComponent(name)}`
    };
  }
  if (k.includes('tiktok')) {
    return {
      bg: 'bg-slate-100/80 hover:bg-slate-200/90',
      border: 'border-slate-300',
      badgeBg: 'bg-slate-200 text-slate-800',
      soldColor: 'text-slate-900',
      url: (name: string) => `https://www.tiktok.com/search?q=${encodeURIComponent(name)}`
    };
  }
  return {
    bg: 'bg-emerald-50/80 hover:bg-emerald-100/90',
    border: 'border-emerald-200',
    badgeBg: 'bg-emerald-100 text-emerald-800',
    soldColor: 'text-emerald-900',
    url: (name: string) => `https://www.google.com/search?q=${encodeURIComponent(name)}`
  };
};

export default function MerchantScoreChart({ productId }: MerchantScoreChartProps) {
  const analytics = React.useMemo(() => {
    const found = (analyticsData as any[]).find((item) => item.product_id === productId);
    return found || analyticsData[0];
  }, [productId]);

  const {
    merchant_score,
    ratings_breakdown,
    merchant_chart_metrics,
    platform_breakdown,
    reference_sources
  } = analytics;

  const platformEntries = React.useMemo(() => {
    if (!platform_breakdown) return [];
    return Object.entries(platform_breakdown).map(([key, data]: [string, any]) => ({
      key,
      name: key === 'shopee' ? 'Shopee' : key === 'lazada' ? 'Lazada' : key === 'tiktok' ? 'TikTok Shop' : key,
      data,
      style: getPlatformStyle(key)
    }));
  }, [platform_breakdown]);

  return (
    <div className="space-y-6 pt-2">
      {/* Header Directive #2 Standard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Store size={24} className="text-slate-800 shrink-0" />
            <h3 className="text-2xl font-bold text-slate-800">
              Merchant Score Analytics
            </h3>
          </div>
          <p className="text-base font-normal text-slate-500 mt-0.5">
            ผลการวิเคราะห์คะแนนประเมินร้านค้าและบริการ
          </p>
        </div>

        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full flex items-center gap-1 self-start sm:self-auto">
          <Info size={14} className="text-emerald-600" />
          <span>รีวิวจาก Shopee, Lazada & TikTok Shop</span>
        </span>
      </div>

      {/* Top Flex-Row Container: Left Evaluation Box + Right Spider Chart */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          
          {/* Left Side: Overall Score Box (Flex-Row Layout) */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 rounded-2xl text-white shadow-md flex flex-col justify-between space-y-4">
            <div className="flex flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Merchant Overall Score
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold text-white">{merchant_score.toFixed(2)}</span>
                  <span className="text-sm text-emerald-300 font-semibold">/ 5.0</span>
                </div>
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>

              <div className="text-right space-y-1 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <span className="text-xs font-bold text-emerald-400 block uppercase">ความพึงพอใจ</span>
                <span className="text-2xl font-extrabold text-emerald-300">{ratings_breakdown.satisfaction_rate}%</span>
                <p className="text-[10px] text-slate-400">
                  {ratings_breakdown.total_reviews.toLocaleString()} รีวิว
                </p>
              </div>
            </div>

            {/* Reference Sources Badges */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                แหล่งอ้างอิงคะแนน:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(reference_sources || []).map((src: string, i: number) => (
                  <span key={i} className="text-[10px] font-semibold bg-emerald-950 text-emerald-300 px-2.5 py-0.5 rounded-md border border-emerald-800/60">
                    {src}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Spider Chart 5 ด้าน */}
          <div className="flex flex-col items-center justify-center p-2 bg-slate-50/60 rounded-2xl border border-slate-200/80">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Merchant Performance Spider-Chart (5 ด้าน)
            </span>
            <SpiderChart metrics={merchant_chart_metrics} size={280} />
          </div>

        </div>

        {/* Dynamic Looping E-Commerce Platform Ratings Cards with Clickable <a> External Links */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            คะแนนร้านค้าแยกตามแพลตฟอร์ม (E-Commerce Platform Ratings)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {platformEntries.map(({ key, name, data, style }) => {
              if (!data) return null;
              const targetUrl = style.url(analytics.product_id || 'product');

              return (
                <a
                  key={key}
                  href={targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${style.bg} p-3.5 rounded-2xl border ${style.border} space-y-1.5 transition-all duration-200 hover:shadow-md hover:scale-[1.02] cursor-pointer group block`}
                  title={`ไปที่ร้านค้า ${name}`}
                >
                  {/* Row 1: Platform Name + Rating + External Link */}
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-md flex items-center gap-1 ${style.badgeBg}`}>
                      <span>{name}</span>
                      <ExternalLink size={11} className="opacity-70 group-hover:opacity-100" />
                    </span>
                    <div className="flex items-baseline gap-1">
                      <Star size={13} className="fill-amber-400 text-amber-400" />
                      <span className="text-sm font-extrabold text-slate-900">{data.rating}</span>
                      <span className="text-[10px] text-slate-500 font-semibold">/ 5.0</span>
                    </div>
                  </div>

                  {/* Row 2: Store Name + Sales & Review detail */}
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 pt-0.5">
                    <span className="truncate max-w-[140px]" title={data.store_type}>
                      {data.store_type}
                    </span>
                    <span className={`text-[11px] font-bold shrink-0 ${style.soldColor}`}>
                      ขายแล้ว {data.sold_count} ชิ้น ({data.review_count?.toLocaleString()} รีวิว)
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
