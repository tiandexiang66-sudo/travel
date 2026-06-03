import React from 'react';
import { DollarSign, Clock, Calendar, Star, Compass, MapPin } from 'lucide-react';
import { Itinerary, TravelNode } from '../types';

interface OverviewStatsProps {
  itinerary: Itinerary;
}

// Helper to compute node costs recursively
function computeDetailedCosts(node: TravelNode): {
  total: number;
  lodging: number;
  transport: number;
  dining: number;
  activity: number;
  other: number;
  spotCount: number;
  ratingsSum: number;
  ratedSpots: number;
} {
  let lodging = 0;
  let transport = 0;
  let dining = 0;
  let activity = 0;
  let other = 0;
  let spotCount = 0;
  let ratingsSum = 0;
  let ratedSpots = 0;

  const currentCost = node.cost || 0;
  if (node.type === 'lodging') lodging += currentCost;
  else if (node.type === 'transport') transport += currentCost;
  else if (node.type === 'dining') dining += currentCost;
  else if (node.type === 'activity') {
    activity += currentCost;
    spotCount += 1;
    if (node.spotRating) {
      ratingsSum += node.spotRating;
      ratedSpots += 1;
    }
  } else {
    other += currentCost;
  }

  // Recurse children
  if (node.children && node.children.length > 0) {
    node.children.forEach(child => {
      const childData = computeDetailedCosts(child);
      lodging += childData.lodging;
      transport += childData.transport;
      dining += childData.dining;
      activity += childData.activity;
      other += childData.other;
      spotCount += childData.spotCount;
      ratingsSum += childData.ratingsSum;
      ratedSpots += childData.ratedSpots;
    });
  }

  return {
    total: lodging + transport + dining + activity + other,
    lodging,
    transport,
    dining,
    activity,
    other,
    spotCount,
    ratingsSum,
    ratedSpots,
  };
}

export default function OverviewStats({ itinerary }: OverviewStatsProps) {
  const stats = computeDetailedCosts(itinerary.rootNode);

  // Fallback to presets if calculated total is zero
  const displayTotal = stats.total || itinerary.rootNode.cost || 0;

  const averagesRating = stats.ratedSpots > 0 
    ? (stats.ratingsSum / stats.ratedSpots).toFixed(1) 
    : '5.0';

  // Budget Breakdown Percentages
  const breakdowns = [
    { name: '酒店住宿', value: stats.lodging, color: 'bg-indigo-500', fill: 'indigo' },
    { name: '出行交通', value: stats.transport, color: 'bg-slate-500', fill: 'slate' },
    { name: '美食美刻', value: stats.dining, color: 'bg-amber-500', fill: 'amber' },
    { name: '景区娱乐', value: stats.activity, color: 'bg-sky-500', fill: 'sky' },
    { name: '其他支出', value: stats.other, color: 'bg-rose-400', fill: 'rose' },
  ];

  const validBreakdowns = breakdowns.filter((b) => b.value > 0);
  const totalBreakdownVal = validBreakdowns.reduce((acc, curr) => acc + curr.value, 0) || 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Main summary cards */}
      <div className="lg:col-span-1 space-y-4">
        
        {/* Core Stat 1: Budget */}
        <div className="bg-emerald-800/95 text-white p-6 rounded-2xl border border-emerald-900 shadow-sm flex flex-col justify-between h-40">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-emerald-100 text-xs block font-medium">预计总花费（含大交通）</span>
              <span className="text-3xl font-extrabold tracking-tight mt-1 font-mono flex items-baseline">
                <span className="text-lg mr-1 font-sans">¥</span>{displayTotal}
              </span>
            </div>
            <div className="p-2.5 bg-white/10 rounded-xl">
              <DollarSign size={20} className="text-emerald-200" />
            </div>
          </div>
          <div className="flex justify-between items-center text-xs text-emerald-100 border-t border-white/10 pt-3">
            <span>消费定位：</span>
            <span className="font-semibold bg-white/15 px-2 py-0.5 rounded-full">{itinerary.budgetCategory}</span>
          </div>
        </div>

        {/* Core Stat 2: Days and Spots */}
        <div className="bg-[#0f1425] p-6 rounded-2xl border border-slate-800/80 shadow-md grid grid-cols-2 gap-4 h-40">
          <div className="flex flex-col justify-between border-r border-slate-800/60 pr-3">
            <div>
              <span className="text-slate-400 text-xs block font-medium">总行程天数</span>
              <span className="text-2xl font-black text-white tracking-tight mt-1 font-mono">
                {itinerary.totalDays} <span className="text-xs font-sans font-medium text-slate-400">天</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <Calendar size={13} className="text-slate-500" />
              <span>{itinerary.season}</span>
            </div>
          </div>

          <div className="flex flex-col justify-between pl-3">
            <div>
              <span className="text-slate-400 text-xs block font-medium">深度打卡点</span>
              <span className="text-2xl font-black text-white tracking-tight mt-1 font-mono">
                {stats.spotCount} <span className="text-xs font-sans font-medium text-slate-400">处</span>
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-amber-500 font-semibold">
              <Star size={13} className="fill-amber-400 stroke-amber-400 animate-pulse" />
              <span>{averagesRating} 均分</span>
            </div>
          </div>
        </div>

      </div>

      {/* Cost Breakdown graph panel */}
      <div className="lg:col-span-2 bg-[#0f1425] p-6 rounded-2xl border border-slate-800/80 shadow-md flex flex-col justify-between">
        
        <div>
          <h4 className="text-sm font-semibold text-white mb-1">行程费用预算分类拆解</h4>
          <p className="text-xs text-slate-450">基于各节点的预算金额进行自动统计、比例汇总</p>
        </div>

        {validBreakdowns.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <div className="w-12 h-12 rounded-full bg-[#131b2e] border border-slate-800 flex items-center justify-center text-slate-400 text-sm mb-2">
              📊
            </div>
            <p className="text-xs text-slate-500">在部分景点或酒店节点下填写消费即可解锁数据拆解</p>
          </div>
        ) : (
          <div className="mt-4 flex flex-col md:flex-row items-center gap-6 flex-1">
            
            {/* Visual stacked circle or bar representation */}
            <div className="w-full md:w-1/2 space-y-3.5">
              {validBreakdowns.map((b) => {
                const pct = Math.round((b.value / totalBreakdownVal) * 100);
                return (
                  <div key={b.name} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-slate-300 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${b.color}`} />
                        {b.name}
                      </span>
                      <span className="text-slate-350 font-mono font-bold">
                        ¥{b.value} <span className="text-slate-500 font-normal">({pct}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[#172033] rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${b.color} rounded-full transition-all duration-750`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom SVG gauge / donut chart mock to feel premium */}
            <div className="hidden md:flex flex-1 items-center justify-center p-3 relative h-36">
              <svg className="w-28 h-28 transform -rotate-90">
                {/* Basic light ring */}
                <circle
                  cx="56"
                  cy="56"
                  r="45"
                  className="stroke-[#131b2e] fill-none"
                  strokeWidth="8"
                />
                
                {/* Render cumulative sections dynamically */}
                {(() => {
                  let accumulatedOffset = 0;
                  const radius = 45;
                  const circumference = 2 * Math.PI * radius; // ~282.7
                  
                  return validBreakdowns.map((b) => {
                    const pct = b.value / totalBreakdownVal;
                    const strokeLength = pct * circumference;
                    const strokeOffset = accumulatedOffset;
                    accumulatedOffset += strokeLength;
                    
                    let strokeColor = '#3b82f6'; // default
                    if (b.fill === 'indigo') strokeColor = '#6366f1';
                    if (b.fill === 'slate') strokeColor = '#94a3b8';
                    if (b.fill === 'amber') strokeColor = '#f59e0b';
                    if (b.fill === 'sky') strokeColor = '#0ea5e9';
                    if (b.fill === 'rose') strokeColor = '#fb7185';

                    return (
                      <circle
                        key={b.name}
                        cx="56"
                        cy="56"
                        r={radius}
                        className="fill-none transition-all duration-700 hover:stroke-[10px] cursor-pointer"
                        stroke={strokeColor}
                        strokeWidth="8"
                        strokeDasharray={`${strokeLength} ${circumference}`}
                        strokeDashoffset={-strokeOffset}
                      />
                    );
                  });
                })()}
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[9px] text-slate-500 block font-medium font-sans">预算核心</span>
                <span className="text-xs font-bold text-white font-mono mt-0.5">¥{totalBreakdownVal}</span>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
