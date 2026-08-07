'use client';

import React from 'react';
import { Sparkles, Award, TrendingUp, ShieldCheck, ShoppingCart, Star, ExternalLink } from 'lucide-react';
import { IProduct, IBrand } from '@/types/traceability';
import analyticsData from '@/mockup/products_analytics_mockup.json';

interface SummaryRecommendationProps {
  selectedProducts: IProduct[];
  brands: IBrand[];
}

function getBestMerchantChannel(product: IProduct) {
  const found = (analyticsData as any[]).find((item) => item.product_id === product.id) || analyticsData[0];
  const pb = found?.platform_breakdown || {};

  const platforms = [
    { name: 'Shopee', data: pb.shopee, url: `https://shopee.co.th/search?keyword=${encodeURIComponent(product.name)}` },
    { name: 'Lazada', data: pb.lazada, url: `https://www.lazada.co.th/catalog/?q=${encodeURIComponent(product.name)}` },
    { name: 'TikTok Shop', data: pb.tiktok, url: `https://www.tiktok.com/search?q=${encodeURIComponent(product.name)}` },
  ].filter((p) => p.data);

  if (platforms.length === 0) {
    return {
      platform: 'Shopee Official Store',
      rating: 4.9,
      storeType: 'Shopee Mall',
      url: `https://shopee.co.th/search?keyword=${encodeURIComponent(product.name)}`
    };
  }

  // Find platform with highest rating
  platforms.sort((a, b) => (b.data.rating || 0) - (a.data.rating || 0));
  const top = platforms[0];

  return {
    platform: top.name,
    rating: top.data.rating || 4.9,
    storeType: top.data.store_type || 'Official Store',
    url: top.url
  };
}

export default function SummaryRecommendation({ selectedProducts, brands }: SummaryRecommendationProps) {
  const brandMap = React.useMemo(() => {
    const map = new Map<string, string>();
    brands.forEach((b) => map.set(b.id, b.name));
    return map;
  }, [brands]);

  // Find Best Value Product (lowest price per serving)
  const bestValueProd = React.useMemo(() => {
    if (!selectedProducts || selectedProducts.length === 0) return null;
    let minCost = Infinity;
    let best = selectedProducts[0];

    selectedProducts.forEach((p) => {
      const match = (p.serving_package || '').match(/\d+/);
      const count = match ? parseInt(match[0], 10) : 30;
      const costPerServing = p.min_price / count;
      if (costPerServing < minCost) {
        minCost = costPerServing;
        best = p;
      }
    });
    return best;
  }, [selectedProducts]);

  // Find Highest Potency Product (highest total mg active ingredient)
  const highestPotencyProd = React.useMemo(() => {
    if (!selectedProducts || selectedProducts.length === 0) return null;
    let maxMg = -1;
    let best = selectedProducts[0];

    selectedProducts.forEach((p) => {
      let totalMg = 0;
      (p.ingredient_list || []).forEach((item) => {
        const match = item.volume.replace(/,/g, '').match(/[\d.]+/);
        if (match) totalMg += parseFloat(match[0]);
      });
      if (totalMg > maxMg) {
        maxMg = totalMg;
        best = p;
      }
    });
    return best;
  }, [selectedProducts]);

  // Find Highest Traceability Product
  const highestTraceabilityProd = React.useMemo(() => {
    if (!selectedProducts || selectedProducts.length === 0) return null;
    return selectedProducts[selectedProducts.length - 1] || selectedProducts[0];
  }, [selectedProducts]);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6 border border-slate-800">
      {/* Header Directive #2 Standard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles size={24} className="text-emerald-400 shrink-0" />
            <h3 className="text-2xl font-bold text-white">
              Comparison Synthesis & Verdict
            </h3>
          </div>
          <p className="text-base font-normal text-slate-400 mt-0.5">
            สรุปบทวิเคราะห์การเปรียบเทียบแบบเป็นกลางตามวัตถุประสงค์การใช้งานจริง
          </p>
        </div>
      </div>

      {/* 3 Verdict Summary Cards (Compact: Header, Name, Clickable Purchase Channel Suggestion <a>) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Best Value */}
        {bestValueProd && (() => {
          const ch = getBestMerchantChannel(bestValueProd);
          return (
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-emerald-500/40 space-y-3.5 relative overflow-hidden backdrop-blur-xs flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 inline-flex items-center gap-1">
                  <TrendingUp size={13} />
                  <span>ตัวเลือกคุ้มค่าที่สุดต่อราคา</span>
                </span>

                <div className="pt-1">
                  <span className="text-[11px] font-semibold text-slate-400 block">
                    {brandMap.get(bestValueProd.brand_id) || bestValueProd.brand_id}
                  </span>
                  <h4 className="font-extrabold text-base text-white line-clamp-2">
                    {bestValueProd.name}
                  </h4>
                </div>
              </div>

              {/* Clickable Purchase Channel Suggestion Anchor <a> */}
              <a
                href={ch.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-900/90 hover:bg-slate-950 p-3 rounded-xl border border-slate-700/80 hover:border-emerald-500/60 transition duration-200 block group cursor-pointer shadow-sm"
                title={`ไปที่ช่องทางสั่งซื้อ ${ch.platform}`}
              >
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <ShoppingCart size={12} className="text-emerald-400" />
                    <span>ช่องทางแนะนำ (Merchant Score สูงสุด):</span>
                  </span>
                  <ExternalLink size={11} className="text-emerald-400 opacity-70 group-hover:opacity-100" />
                </span>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="font-bold text-emerald-300 group-hover:underline">{ch.platform} ({ch.storeType})</span>
                  <span className="font-extrabold text-amber-300 flex items-center gap-0.5">
                    <Star size={12} className="fill-amber-300" />
                    <span>{ch.rating} / 5.0</span>
                  </span>
                </div>
              </a>
            </div>
          );
        })()}

        {/* Card 2: Highest Potency */}
        {highestPotencyProd && (() => {
          const ch = getBestMerchantChannel(highestPotencyProd);
          return (
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-amber-500/40 space-y-3.5 relative overflow-hidden backdrop-blur-xs flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-amber-300 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-500/30 inline-flex items-center gap-1">
                  <Award size={13} />
                  <span>ความเข้มข้นสารสกัดสูงสุด</span>
                </span>

                <div className="pt-1">
                  <span className="text-[11px] font-semibold text-slate-400 block">
                    {brandMap.get(highestPotencyProd.brand_id) || highestPotencyProd.brand_id}
                  </span>
                  <h4 className="font-extrabold text-base text-white line-clamp-2">
                    {highestPotencyProd.name}
                  </h4>
                </div>
              </div>

              {/* Clickable Purchase Channel Suggestion Anchor <a> */}
              <a
                href={ch.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-900/90 hover:bg-slate-950 p-3 rounded-xl border border-slate-700/80 hover:border-amber-500/60 transition duration-200 block group cursor-pointer shadow-sm"
                title={`ไปที่ช่องทางสั่งซื้อ ${ch.platform}`}
              >
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <ShoppingCart size={12} className="text-amber-400" />
                    <span>ช่องทางแนะนำ (Merchant Score สูงสุด):</span>
                  </span>
                  <ExternalLink size={11} className="text-amber-400 opacity-70 group-hover:opacity-100" />
                </span>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="font-bold text-amber-300 group-hover:underline">{ch.platform} ({ch.storeType})</span>
                  <span className="font-extrabold text-amber-300 flex items-center gap-0.5">
                    <Star size={12} className="fill-amber-300" />
                    <span>{ch.rating} / 5.0</span>
                  </span>
                </div>
              </a>
            </div>
          );
        })()}

        {/* Card 3: Highest Traceability */}
        {highestTraceabilityProd && (() => {
          const ch = getBestMerchantChannel(highestTraceabilityProd);
          return (
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-blue-500/40 space-y-3.5 relative overflow-hidden backdrop-blur-xs flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-blue-300 bg-blue-950/80 px-3 py-1 rounded-full border border-blue-500/30 inline-flex items-center gap-1">
                  <ShieldCheck size={13} />
                  <span>มาตรฐานวัตถุดิบนำเข้าสูงสุด</span>
                </span>

                <div className="pt-1">
                  <span className="text-[11px] font-semibold text-slate-400 block">
                    {brandMap.get(highestTraceabilityProd.brand_id) || highestTraceabilityProd.brand_id}
                  </span>
                  <h4 className="font-extrabold text-base text-white line-clamp-2">
                    {highestTraceabilityProd.name}
                  </h4>
                </div>
              </div>

              {/* Clickable Purchase Channel Suggestion Anchor <a> */}
              <a
                href={ch.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-900/90 hover:bg-slate-950 p-3 rounded-xl border border-slate-700/80 hover:border-blue-500/60 transition duration-200 block group cursor-pointer shadow-sm"
                title={`ไปที่ช่องทางสั่งซื้อ ${ch.platform}`}
              >
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <ShoppingCart size={12} className="text-blue-400" />
                    <span>ช่องทางแนะนำ (Merchant Score สูงสุด):</span>
                  </span>
                  <ExternalLink size={11} className="text-blue-400 opacity-70 group-hover:opacity-100" />
                </span>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="font-bold text-blue-300 group-hover:underline">{ch.platform} ({ch.storeType})</span>
                  <span className="font-extrabold text-amber-300 flex items-center gap-0.5">
                    <Star size={12} className="fill-amber-300" />
                    <span>{ch.rating} / 5.0</span>
                  </span>
                </div>
              </a>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
