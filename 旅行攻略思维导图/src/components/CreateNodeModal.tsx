import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { TravelNode, NodeType } from '../types';

interface CreateNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (nodeData: Partial<TravelNode>) => void;
  editingNode?: TravelNode | null;
  parentNodeType?: NodeType;
}

const NODE_TYPES: { value: NodeType; label: string; bg: string; text: string; activeBorder: string }[] = [
  { value: 'day', label: '日程天数 (Day)', bg: 'bg-emerald-950/45', text: 'text-emerald-400', activeBorder: 'border-emerald-500' },
  { value: 'activity', label: '景点玩乐 (Sightseeing)', bg: 'bg-sky-950/45', text: 'text-sky-400', activeBorder: 'border-sky-500' },
  { value: 'transport', label: '交通出行 (Transport)', bg: 'bg-[#182239]', text: 'text-slate-300', activeBorder: 'border-[#3b82f6]' },
  { value: 'dining', label: '美食餐饮 (Dining)', bg: 'bg-amber-950/45', text: 'text-amber-400', activeBorder: 'border-amber-500' },
  { value: 'lodging', label: '住宿酒店 (Lodging)', bg: 'bg-[#1a253c]', text: 'text-indigo-400', activeBorder: 'border-[#6366f1]' },
  { value: 'tip', label: '旅行小贴士 (Tips)', bg: 'bg-rose-950/45', text: 'text-rose-400', activeBorder: 'border-rose-500' },
];

export default function CreateNodeModal({
  isOpen,
  onClose,
  onSave,
  editingNode,
  parentNodeType,
}: CreateNodeModalProps) {
  const [type, setType] = useState<NodeType>('activity');
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('');
  const [cost, setCost] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [spotRating, setSpotRating] = useState<number>(5);
  const [transportMethod, setTransportMethod] = useState<'walk' | 'subway' | 'bus' | 'taxi' | 'train' | 'flight' | 'none'>('walk');
  const [imageUrl, setImageUrl] = useState('');
  
  const [newTip, setNewTip] = useState('');
  const [tipsList, setTipsList] = useState<string[]>([]);

  // Automatically suggest node type based on parent or editing
  useEffect(() => {
    if (editingNode) {
      setType(editingNode.type);
      setTitle(editingNode.title);
      setTime(editingNode.time || '');
      setDuration(editingNode.duration || '');
      setCost(editingNode.cost || '');
      setDescription(editingNode.description || '');
      setSpotRating(editingNode.spotRating || 5);
      setTransportMethod(editingNode.transportMethod || 'walk');
      setTipsList(editingNode.tips || []);
      setImageUrl(editingNode.imageUrl || '');
    } else {
      if (parentNodeType === 'destination') {
        setType('day');
      } else if (parentNodeType === 'day') {
        setType('activity');
      } else {
        setType('activity');
      }
      // Reset form
      setTitle('');
      setTime('');
      setDuration('');
      setCost('');
      setDescription('');
      setSpotRating(5);
      setTransportMethod('walk');
      setTipsList([]);
      setImageUrl('');
    }
    setNewTip('');
  }, [editingNode, isOpen, parentNodeType]);

  if (!isOpen) return null;

  const handleAddTip = () => {
    if (newTip.trim()) {
      setTipsList([...tipsList, newTip.trim()]);
      setNewTip('');
    }
  };

  const handleRemoveTip = (index: number) => {
    setTipsList(tipsList.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      type,
      title: title.trim(),
      time: time.trim() || undefined,
      duration: duration.trim() || undefined,
      cost: cost === '' ? undefined : Number(cost),
      description: description.trim() || undefined,
      spotRating: type === 'activity' ? spotRating : undefined,
      transportMethod: type === 'transport' ? transportMethod : undefined,
      tips: tipsList.length > 0 ? tipsList : undefined,
      imageUrl: imageUrl.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-[#0f1425] rounded-3xl shadow-2xl overflow-hidden border border-slate-800 flex flex-col max-h-[90vh] text-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80">
          <h2 className="text-base font-bold text-white flex items-center gap-1.5">
            {editingNode ? '🎯 编辑脑图节点' : '✨ 添加新的路线节点'}
          </h2>
          <button 
            type="button" 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          
          {/* Node Type Selector */}
          <div className="space-y-2">
            <label className="block font-bold text-slate-400 uppercase tracking-wider">
              1. 节点属性分类
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {NODE_TYPES.map((t) => {
                const isSelected = type === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setType(t.value)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs transition-all text-center ${
                      isSelected
                        ? `${t.bg} ${t.text} ${t.activeBorder} font-bold ring-1 ring-current/20`
                        : 'border-slate-800 bg-[#131b2e]/40 text-slate-400 hover:text-slate-200 hover:bg-[#131b2e]'
                    }`}
                  >
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title input */}
          <div className="space-y-1.5">
            <label htmlFor="node-title" className="block font-bold text-slate-400 uppercase tracking-wider">
              2. 节点名称 <span className="text-rose-500">*</span>
            </label>
            <input
              id="node-title"
              type="text"
              required
              placeholder="e.g. 丽江古城大水车 / 返程特色客栈 / 穿梭机场大巴"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-[#131b2e] border border-slate-800 rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none transition-all text-slate-100 placeholder-slate-550"
            />
          </div>

          {/* Details Row: Time & Cost */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="node-time" className="block font-bold text-slate-400 uppercase tracking-wider">
                3. 日程或推荐时段 (Time tag)
              </label>
              <input
                id="node-time"
                type="text"
                placeholder={type === 'day' ? 'e.g. 寻古探幽 / 四季皆宜' : 'e.g. 09:00 - 11:30'}
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-2 bg-[#131b2e] border border-slate-800 rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none transition-all text-slate-105 placeholder-slate-550"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="node-cost" className="block font-bold text-slate-400 uppercase tracking-wider">
                4. 预计消费预算 (人均 ¥)
              </label>
              <input
                id="node-cost"
                type="number"
                min="0"
                placeholder="0"
                value={cost}
                onChange={(e) => setCost(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-4 py-2 bg-[#131b2e] border border-slate-800 rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none transition-all text-slate-105 placeholder-slate-550"
              />
            </div>
          </div>

          {/* Type-specific properties */}
          {type === 'activity' && (
            <div className="p-3 bg-sky-950/15 rounded-xl border border-sky-900/30 flex items-center justify-between">
              <span className="font-semibold text-sky-400">景点推荐游玩评分指数</span>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSpotRating(star)}
                    className={`text-base transition-transform hover:scale-110 ${
                      star <= spotRating ? 'text-amber-400' : 'text-slate-600'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          )}

          {type === 'transport' && (
            <div className="p-3 bg-[#131b2e] border border-slate-800 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label htmlFor="transport-method" className="block text-[10px] font-bold text-slate-400 mb-1">
                  搭乘出行运输工具
                </label>
                <select
                  id="transport-method"
                  value={transportMethod}
                  onChange={(e) => setTransportMethod(e.target.value as any)}
                  className="w-full bg-[#182239] border border-slate-800 py-1.5 px-2.5 rounded-lg text-slate-200 focus:ring-1 focus:ring-emerald-555 outline-none"
                >
                  <option value="walk">🚶 徒步漫游 (Walk)</option>
                  <option value="subway">🚇 地铁轻轨 (Subway)</option>
                  <option value="bus">🚌 公共车 / 专线巴士 (Bus)</option>
                  <option value="taxi">🚕 打车 / 网约专车 (Taxi)</option>
                  <option value="train">🚄 动车高铁 (Train)</option>
                  <option value="flight">✈️ 航空飞行 (Flight)</option>
                  <option value="none">🌐 其他联络方式</option>
                </select>
              </div>

              <div>
                <label htmlFor="node-duration" className="block text-[10px] font-bold text-slate-400 mb-1">
                  预估所需耗时时长
                </label>
                <input
                  id="node-duration"
                  type="text"
                  placeholder="e.g. 1.5小时 / 30分钟"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-[#182239] border border-slate-800 py-1.5 px-3 rounded-lg text-slate-205 outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-1.5">
            <label htmlFor="node-desc" className="block font-bold text-slate-400 uppercase tracking-wider">
              5. 核心看点 / 玩法及避坑规划
            </label>
            <textarea
              id="node-desc"
              rows={3}
              placeholder="撰写对于该地点专属的游玩路线、最佳时间或者必吃好物..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-[#131b2e] border border-slate-800 rounded-xl focus:ring-1 focus:ring-emerald-500 outline-none transition-all text-slate-100 placeholder-slate-550 resize-none font-sans leading-relaxed"
            />
          </div>

          {/* Node Image Upload/Custom URL */}
          <div className="p-4 bg-[#141b2d] rounded-2xl border border-slate-800/80 space-y-3">
            <span className="block font-bold text-slate-400 uppercase tracking-wider">
              🏞️ 节点专属画报封面
            </span>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {imageUrl ? (
                <div className="relative w-full sm:w-28 aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0 shadow shadow-black group">
                  <img src={imageUrl} alt="preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-semibold"
                  >
                    重置删除
                  </button>
                </div>
              ) : (
                <div className="w-full sm:w-28 h-16 rounded-xl border border-dashed border-slate-800 bg-[#0f1425] flex flex-col items-center justify-center text-slate-500 shrink-0 select-none">
                  <span>暂无挂载图</span>
                </div>
              )}

              <div className="flex-1 space-y-2 w-full">
                <div className="flex gap-2">
                  <label className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#172033] border border-slate-800 hover:border-slate-700 text-slate-305 rounded-lg shadow-xs cursor-pointer transition-all active:scale-[0.98]">
                    <span>📤 上传本地照片</span>
                    <input
                      type="file"
                      id="node-image-uploader-file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 2.5 * 1024 * 1024) {
                            alert("图片文件过大，请选择 2.5MB 以下的图片");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            if (typeof reader.result === 'string') {
                              setImageUrl(reader.result);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="或者直接在此处粘贴网络照片链接 URL..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#172033] border border-slate-800 rounded-lg text-slate-200 outline-none focus:ring-1 focus:ring-emerald-500 placeholder-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Travel Tips checklist editor */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-400 uppercase tracking-wider">
              💡 避坑注意事项条目录入
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. 门口拉客一日游千万不可信、下午14点前必闭园"
                value={newTip}
                onChange={(e) => setNewTip(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTip();
                  }
                }}
                className="flex-1 px-4 py-2 bg-[#131b2e] border border-slate-800 rounded-xl focus:ring-1 focus:ring-emerald-550 outline-none text-slate-100 placeholder-slate-550"
              />
              <button
                type="button"
                onClick={handleAddTip}
                className="px-4 py-2 bg-emerald-600 outline-none hover:bg-emerald-700 text-white rounded-xl flex items-center gap-1 font-bold"
              >
                添加
              </button>
            </div>

            {tipsList.length > 0 && (
              <ul className="mt-2.5 space-y-1 max-h-32 overflow-y-auto p-1.5 bg-[#0a0e1a] rounded-xl border border-slate-850">
                {tipsList.map((tip, index) => (
                  <li 
                    key={index} 
                    className="flex items-start justify-between gap-2 p-1 py-1.5 hover:bg-[#1a253c]/40 rounded-lg group text-slate-300 transition-colors"
                  >
                    <span className="flex-1 select-all font-sans">💡 {tip}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTip(index)}
                      className="text-slate-500 hover:text-rose-405 shrink-0 transition-colors pr-1"
                    >
                      <Trash2 size={12} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </form>

        {/* Footer Area */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-[#131b2e] border-t border-slate-800/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs text-slate-400 hover:text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-1.5 text-xs text-white bg-emerald-600 hover:bg-emerald-700 font-bold rounded-xl shadow-md transition-all active:scale-[0.98]"
          >
            保存节点
          </button>
        </div>

      </div>
    </div>
  );
}
