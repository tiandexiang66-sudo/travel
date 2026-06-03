import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, Briefcase, RefreshCw } from 'lucide-react';
import { PackingCategory, PackingItem } from '../types';

interface PackingListProps {
  categories: PackingCategory[];
  onChange: (categories: PackingCategory[]) => void;
}

export default function PackingList({ categories, onChange }: PackingListProps) {
  const [newCatName, setNewCatName] = useState('');
  const [newItemNames, setNewItemNames] = useState<{ [catId: string]: string }>({});

  const toggleItem = (catId: string, itemId: string) => {
    const updated = categories.map(cat => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        items: cat.items.map(item => {
          if (item.id !== itemId) return item;
          return { ...item, checked: !item.checked };
        })
      };
    });
    onChange(updated);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const newCat: PackingCategory = {
      id: `custom-cat-${Date.now()}`,
      name: newCatName.trim(),
      items: []
    };

    onChange([...categories, newCat]);
    setNewCatName('');
  };

  const handleAddItem = (catId: string) => {
    const itemName = newItemNames[catId];
    if (!itemName || !itemName.trim()) return;

    const updated = categories.map(cat => {
      if (cat.id !== catId) return cat;
      const newItem: PackingItem = {
        id: `custom-item-${Date.now()}`,
        name: itemName.trim(),
        checked: false
      };
      return {
        ...cat,
        items: [...cat.items, newItem]
      };
    });

    onChange(updated);
    setNewItemNames({
      ...newItemNames,
      [catId]: ''
    });
  };

  const handleRemoveItem = (catId: string, itemId: string) => {
    const updated = categories.map(cat => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        items: cat.items.filter(item => item.id !== itemId)
      };
    });
    onChange(updated);
  };

  const handleRemoveCategory = (catId: string) => {
    onChange(categories.filter(cat => cat.id !== catId));
  };

  // Calculate totals
  const totalItems = categories.reduce((acc, cat) => acc + cat.items.length, 0);
  const checkedItems = categories.reduce(
    (acc, cat) => acc + cat.items.filter(i => i.checked).length, 
    0
  );
  const progressPercent = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  return (
    <div className="bg-[#0f1425] rounded-3xl border border-slate-800/80 shadow-xl p-5 md:p-6 space-y-6 text-slate-200">
      
      {/* Title & Progress Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <Briefcase size={22} className="stroke-[2px]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-1.5">出行行李准备清单</h3>
            <p className="text-xs text-slate-400 mt-1">分门别类整理，出发游玩不丢落</p>
          </div>
        </div>

        {totalItems > 0 && (
          <div className="flex items-center gap-3 bg-[#131b2e] px-4 py-2 rounded-xl border border-slate-800">
            <div className="text-right">
              <span className="text-[10px] text-slate-450 block font-mono">已整理进度</span>
              <span className="text-xs font-bold text-slate-250 font-mono">
                {checkedItems} / {totalItems} ({progressPercent}%)
              </span>
            </div>
            <div className="w-16 h-1.5 bg-[#1a253c] rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-10 text-slate-500 border border-dashed border-slate-800 rounded-2xl">
          <p className="text-xs">暂无准备清单，在下方输入新增分类吧</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const catChecked = cat.items.filter(i => i.checked).length;
            const catTotal = cat.items.length;
            const isCatComplete = catTotal > 0 && catChecked === catTotal;

            return (
              <div 
                key={cat.id} 
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isCatComplete 
                    ? 'border-emerald-500/30 bg-emerald-950/10' 
                    : 'border-slate-800 bg-[#131b2e]/60'
                }`}
              >
                <div>
                  {/* Category title */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 px-2.5 py-1 rounded-lg">
                      {cat.name} ({catChecked}/{catTotal})
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(cat.id)}
                      className="p-1 text-slate-500 hover:text-rose-450 transition-colors"
                      title="删除整个分类"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  {/* Items list */}
                  {cat.items.length === 0 ? (
                    <p className="text-xs text-slate-550 italic py-2">暂无物品</p>
                  ) : (
                    <ul className="space-y-1.5 mb-4">
                      {cat.items.map((item) => (
                        <li 
                          key={item.id}
                          className="flex items-center justify-between gap-2 p-1.5 hover:bg-[#1a253c]/40 rounded-lg group text-xs font-sans transition-colors"
                        >
                          <button
                            type="button"
                            onClick={() => toggleItem(cat.id, item.id)}
                            className="flex items-center gap-2.5 text-left text-xs font-medium flex-1 text-slate-300"
                          >
                            {item.checked ? (
                              <CheckCircle2 size={15} className="text-emerald-500 fill-emerald-950/30 shrink-0" />
                            ) : (
                              <Circle size={15} className="text-slate-650 shrink-0" />
                            )}
                            <span className={item.checked ? 'line-through text-slate-500 font-normal' : 'text-slate-200 font-medium'}>
                              {item.name}
                            </span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(cat.id, item.id)}
                            className="p-1 opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-rose-450"
                          >
                            <Trash2 size={12} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Add item box */}
                <div className="flex gap-1.5 mt-auto pt-2.5 border-t border-slate-800/40">
                  <input
                    type="text"
                    placeholder="添加单品..."
                    value={newItemNames[cat.id] || ''}
                    onChange={(e) => setNewItemNames({ ...newItemNames, [cat.id]: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddItem(cat.id);
                      }
                    }}
                    className="flex-1 min-w-0 px-2 py-1 bg-[#182239] border border-slate-800 rounded-lg text-[11px] text-slate-200 outline-none focus:ring-1 focus:ring-emerald-500 placeholder-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddItem(cat.id)}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] transition-colors shrink-0"
                  >
                    添加
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Add New Category form */}
      <form onSubmit={handleAddCategory} className="flex gap-2 max-w-sm mt-4 bg-[#131b2e]/60 p-3 rounded-xl border border-slate-800/80">
        <input
          type="text"
          placeholder="e.g. 摄影摄影、防寒装备、洗漱等"
          value={newCatName}
          onChange={(e) => setNewCatName(e.target.value)}
          className="flex-1 px-3 py-1.5 bg-[#172033] border border-slate-800 rounded-lg text-xs outline-none focus:ring-1 focus:ring-emerald-500 text-slate-200 placeholder-slate-550"
        />
        <button
          type="submit"
          className="px-4 py-1.5 bg-[#1d2740] border border-slate-700 hover:bg-[#253252] text-slate-200 font-bold text-xs rounded-lg flex items-center gap-1 transition-all shrink-0"
        >
          <Plus size={13} /> 新增分类
        </button>
      </form>

    </div>
  );
}
