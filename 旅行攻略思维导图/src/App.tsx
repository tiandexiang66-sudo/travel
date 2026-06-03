import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon, Upload, X, MapPin, Sparkles, Heart, Palette, Sliders, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CustomCard {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: number;
  customTime?: string;
}

const PRESET_IMAGES = [
  { name: '极简摩登', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80' },
  { name: '雨林秘境', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80' },
  { name: '浅滩海椰', url: 'https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?auto=format&fit=crop&w=600&q=80' },
  { name: '微光暮色', url: 'https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?auto=format&fit=crop&w=600&q=80' },
  { name: '空灵雪山', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80' },
  { name: '赤砂荒野', url: 'https://images.unsplash.com/photo-1509316975850-ff9c5edd0cd9?auto=format&fit=crop&w=600&q=80' }
];

const WALLPAPER_PRESETS = [
  { name: '暗沙流光', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80' },
  { name: '星罗密布', url: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=1200&q=80' },
  { name: '极光霓影', url: 'https://images.unsplash.com/photo-1531315630201-bb15abeb1653?auto=format&fit=crop&w=1200&q=80' },
  { name: '治愈竹青', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80' },
  { name: '晨曦海岸', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80' }
];

const BG_PRESETS = [
  {
    id: 'obsidian',
    name: '曜石深邃',
    bgColor1: '#03050c',
    bgColor2: '#080c18',
    ambientColor1: 'rgba(16, 185, 129, 0.08)', // emerald-500
    ambientColor2: 'rgba(59, 130, 246, 0.08)', // blue-500
    gridOpacity: 2.5,
    glowEnabled: true,
  },
  {
    id: 'midnight',
    name: '极夜无界',
    bgColor1: '#000000',
    bgColor2: '#050505',
    ambientColor1: 'rgba(239, 68, 68, 0.05)', // red
    ambientColor2: 'rgba(168, 85, 247, 0.05)', // purple
    gridOpacity: 1.5,
    glowEnabled: true,
  },
  {
    id: 'moss',
    name: '青苔幽境',
    bgColor1: '#030604',
    bgColor2: '#060d09',
    ambientColor1: 'rgba(52, 211, 153, 0.08)', // emerald-400
    ambientColor2: 'rgba(234, 179, 8, 0.05)', // amber
    gridOpacity: 2.0,
    glowEnabled: true,
  },
  {
    id: 'sunset',
    name: '落日粉暮',
    bgColor1: '#080309',
    bgColor2: '#120715',
    ambientColor1: 'rgba(236, 72, 153, 0.08)', // pink
    ambientColor2: 'rgba(249, 115, 22, 0.05)', // orange
    gridOpacity: 2.0,
    glowEnabled: true,
  },
  {
    id: 'slate',
    name: '静谧海角',
    bgColor1: '#050811',
    bgColor2: '#0a0f20',
    ambientColor1: 'rgba(99, 102, 241, 0.08)', // indigo
    ambientColor2: 'rgba(45, 212, 191, 0.06)', // teal
    gridOpacity: 2.2,
    glowEnabled: true,
  }
];

const BEAUTIFUL_SAYINGS = [
  "林深时见鹿，溪深时见鱼，梦醒时见你。",
  "万物皆有裂痕，那是光照进来的地方。",
  "借一盏清风，吹散半生忧愁，寄情于山水之间。",
  "日子缓慢下沉，星光便在一瞬间亮起。",
  "愿你的生活既有软木塞的轻盈，也有老陶罐的厚重。",
  "那些看似不起眼的光芒，也终将汇聚成璀璨的星河。",
  "心有猛虎，细嗅蔷薇。在最微茫的日常里寻找诗意。",
  "风吹散了昨日的烟尘，唯有落叶写满秋日的呢喃。",
  "静下心来，听一朵花开的声音，等一朵云飘进窗棂。",
  "大自然是一幅画，生活是一首诗，而你是最美的篇章。",
  "既然路阻且长，那就慢慢走，看沿途的野花肆意绽放。",
  "所有的相遇，都是久别重逢。此时此地，刚刚好。"
];

export default function App() {
  const [cards, setCards] = useState<CustomCard[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalActiveTab, setModalActiveTab] = useState<'card' | 'bg'>('card');
  const [activeSlot, setActiveSlot] = useState<number>(1);
  const [zoomedCard, setZoomedCard] = useState<CustomCard | null>(null);

  // Background Customizer States
  const [bgSettings, setBgSettings] = useState(() => {
    const saved = localStorage.getItem('yowoo_bg_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          maskOpacity: 25,
          blurAmount: 0,
          ...parsed
        };
      } catch (e) {}
    }
    return {
      presetId: 'obsidian',
      bgColor1: '#03050c',
      bgColor2: '#080c18',
      ambientColor1: 'rgba(16, 185, 129, 0.08)',
      ambientColor2: 'rgba(59, 130, 246, 0.08)',
      bgImageUrl: '',
      gridOpacity: 2.5,
      glowEnabled: true,
      maskOpacity: 25,
      blurAmount: 0,
    };
  });

  const maskOpacity = bgSettings.maskOpacity !== undefined ? bgSettings.maskOpacity : (bgSettings.bgImageUrl ? 25 : 0);
  const blurAmount = bgSettings.blurAmount !== undefined ? bgSettings.blurAmount : 0;

  const saveBgSettings = (settings: typeof bgSettings) => {
    setBgSettings(settings);
    localStorage.setItem('yowoo_bg_settings', JSON.stringify(settings));
  };

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        alert('上传的图片体积偏大，请选择 4MB 以下的照片。');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          saveBgSettings({
            ...bgSettings,
            presetId: 'custom',
            bgImageUrl: reader.result
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and Drop State
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [isDraggingModeActive, setIsDraggingModeActive] = useState(false);

  // Form states for creation
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);

  // Form states for editing/opening card
  const [editingCard, setEditingCard] = useState<CustomCard | null>(null);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editSelectedPreset, setEditSelectedPreset] = useState<number | null>(null);

  const insertTimestamp = (isEdit: boolean) => {
    const date = new Date();
    const formatMapStr = `${date.toLocaleDateString('zh-CN', {month: 'numeric', day: 'numeric'})} ${date.toLocaleTimeString('zh-CN', {hour: '2-digit', minute: '2-digit'})}`;
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const dayOfWeek = weekDays[date.getDay()];
    const locations = ['浮生若梦', '半日闲暇', '行云流水', '阅微草堂', '明窗净几', '肆野微光'];
    const randomLoc = locations[Math.floor(Math.random() * locations.length)];
    const stamp = `\n[ ${formatMapStr} · ${dayOfWeek} · ${randomLoc} ]`;

    if (isEdit) {
      setEditDescription(prev => (prev + stamp).substring(0, 200));
    } else {
      setDescription(prev => (prev + stamp).substring(0, 200));
    }
  };

  const insertInspiration = (isEdit: boolean) => {
    const randomQuote = BEAUTIFUL_SAYINGS[Math.floor(Math.random() * BEAUTIFUL_SAYINGS.length)];
    if (isEdit) {
      setEditDescription(randomQuote);
    } else {
      setDescription(randomQuote);
    }
  };

  // Load custom cards list when activeSlot changes
  useEffect(() => {
    const slotKey = `yowoo_custom_cards_slot_${activeSlot}`;
    let saved = localStorage.getItem(slotKey);

    // Fallback migration for Slot 1 if old key is present
    if (!saved && activeSlot === 1) {
      const oldSaved = localStorage.getItem('yowoo_custom_cards');
      if (oldSaved) {
        saved = oldSaved;
        localStorage.setItem(slotKey, oldSaved);
      }
    }

    if (saved) {
      try {
        setCards(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved custom cards:', e);
        setCards([]);
      }
    } else {
      setCards([]);
    }
  }, [activeSlot]);

  // Save utility
  const saveCards = (updated: CustomCard[]) => {
    setCards(updated);
    const slotKey = `yowoo_custom_cards_slot_${activeSlot}`;
    localStorage.setItem(slotKey, JSON.stringify(updated));
  };

  const getFormattedNow = () => {
    const d = new Date();
    return `${d.toLocaleDateString('zh-CN')} ${d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const newCard: CustomCard = {
      id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: '',
      description: description.trim(),
      imageUrl: imageUrl.trim() || PRESET_IMAGES[2].url,
      createdAt: Date.now()
    };

    const nextList = [...cards, newCard];
    saveCards(nextList);

    // Reset Form
    setTitle('');
    setDescription('');
    setImageUrl('');
    setSelectedPreset(null);
    setIsModalOpen(false);
  };

  const handleCardClick = (card: CustomCard) => {
    setEditingCard(card);
    setIsEditingMode(true);
    setEditTitle('');
    setEditDescription(card.description);
    setEditImageUrl(card.imageUrl);
    
    // Find matching preset index
    const matchedIdx = PRESET_IMAGES.findIndex(img => img.url === card.imageUrl);
    setEditSelectedPreset(matchedIdx !== -1 ? matchedIdx : null);
  };

  const handleUpdateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCard || !editDescription.trim()) return;

    const nextList = cards.map(c => {
      if (c.id === editingCard.id) {
        return {
          ...c,
          title: '',
          description: editDescription.trim(),
          imageUrl: editImageUrl.trim() || PRESET_IMAGES[2].url
        };
      }
      return c;
    });

    saveCards(nextList);
    setEditingCard(null);
  };

  const handleDeleteCard = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextList = cards.filter(c => c.id !== id);
    saveCards(nextList);
    if (editingCard?.id === id) {
      setEditingCard(null);
    }
  };

  // Drag-and-Drop Handler Functions
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    setIsDraggingModeActive(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIdx === null) return;
    if (dragOverIdx !== index) {
      setDragOverIdx(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
    setTimeout(() => {
      setIsDraggingModeActive(false);
    }, 150);
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) {
      setDraggedIdx(null);
      setDragOverIdx(null);
      return;
    }

    const updated = [...cards];
    const [draggedItem] = updated.splice(draggedIdx, 1);
    updated.splice(index, 0, draggedItem);

    saveCards(updated);
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  const selectPresetImage = (url: string, index: number, isEdit: boolean = false) => {
    if (isEdit) {
      setEditImageUrl(url);
      setEditSelectedPreset(index);
    } else {
      setImageUrl(url);
      setSelectedPreset(index);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('上传的图片体积偏大，请选择 3MB 以下的照片。');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          if (isEdit) {
            setEditImageUrl(reader.result);
            setEditSelectedPreset(null);
          } else {
            setImageUrl(reader.result);
            setSelectedPreset(null);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const workspaceStyle: React.CSSProperties = {
    backgroundColor: bgSettings.bgColor1,
    backgroundImage: bgSettings.bgImageUrl 
      ? `radial-gradient(rgba(255, 255, 255, ${bgSettings.gridOpacity * 0.05}) 0.8px, transparent 0.8px), url(${bgSettings.bgImageUrl})`
      : `radial-gradient(rgba(255, 255, 255, ${bgSettings.gridOpacity * 0.05}) 0.8px, transparent 0.8px), linear-gradient(135deg, ${bgSettings.bgColor1} 0%, ${bgSettings.bgColor2 || bgSettings.bgColor1} 100%)`,
    backgroundSize: '24px 24px, cover, cover',
    backgroundPosition: 'center, center, center',
    backgroundRepeat: 'repeat, no-repeat, no-repeat',
    backgroundAttachment: 'scroll, fixed, fixed',
  };

  return (
    <div 
      id="card-studio-workspace" 
      style={workspaceStyle}
      className="min-h-screen w-full text-slate-100 flex flex-col relative overflow-x-hidden font-sans select-none antialiased transition-all duration-700"
    >
      {/* Dynamic dark glass masking overlay when using custom wallpaper to retain pristine typography contrast */}
      {bgSettings.bgImageUrl && (
        <div 
          className="absolute inset-0 bg-slate-950 pointer-events-none z-0 transition-all duration-300" 
          style={{ 
            opacity: maskOpacity / 100,
            backdropFilter: blurAmount > 0 ? `blur(${blurAmount}px)` : 'none',
            WebkitBackdropFilter: blurAmount > 0 ? `blur(${blurAmount}px)` : 'none'
          }}
        />
      )}
      
      {/* Decorative background ambient blobs */}
      {bgSettings.glowEnabled && (
        <>
          <div 
            className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-1000" 
            style={{ backgroundColor: bgSettings.ambientColor1 }}
          />
          <div 
            className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-1000" 
            style={{ backgroundColor: bgSettings.ambientColor2 }}
          />
        </>
      )}

      {/* Header section */}
      <header className="w-full max-w-[1440px] mx-auto px-6 py-4 border-b border-white/5 flex items-center justify-between shrink-0 relative z-40 font-display">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-400 to-[#3b82f6] p-[1.2px] shadow-[0_0_15px_rgba(16,185,129,0.12)]">
            <div className="w-full h-full bg-[#060812] rounded-[7px] flex items-center justify-center">
              <Sparkles size={13} className="text-emerald-400" />
            </div>
          </div>
          <span className="font-display font-extrabold text-[13px] tracking-widest text-[#f8fafc] uppercase">Studio</span>
        </div>

        <div className="flex items-center gap-2.5">
          <motion.button
            whileHover={{ scale: 1.05, rotate: 45 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setModalActiveTab('card');
              setIsModalOpen(true);
            }}
            className="w-9 h-9 rounded-xl bg-slate-950/40 hover:bg-slate-950/80 backdrop-blur-xl border border-white/5 hover:border-white/10 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-all shadow-md group"
            title="空间设置 (新建卡片 / 背景风格)"
          >
            <Settings size={16} className="group-hover:text-emerald-400 transition-colors" />
          </motion.button>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-6 py-5 flex flex-col items-center justify-start relative z-10">
        
        {/* Workspace Numeric Selector Bar / Tab Selector */}
        <div className="w-full flex items-center justify-end border-b border-slate-800/20 pb-3 mb-5">

          <div className="flex items-center gap-1.5 bg-[#080c16]/30 backdrop-blur-2xl px-1.5 py-1 rounded-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all">
            {[1, 2, 3, 4, 5, 6].map((slotNum) => {
              const isActive = activeSlot === slotNum;
              return (
                <button
                  key={`slot-${slotNum}`}
                  onClick={() => setActiveSlot(slotNum)}
                  className={`w-8.5 h-8.5 rounded-lg font-display text-xs font-bold transition-all relative flex items-center justify-center cursor-pointer border ${
                    isActive
                      ? 'bg-gradient-to-tr from-emerald-400 via-emerald-500 to-teal-400 border-emerald-400/40 text-slate-950 shadow-md shadow-emerald-500/10 font-black'
                      : 'bg-slate-950/20 hover:bg-slate-900/50 text-slate-300 border-white/5 hover:border-white/10'
                  }`}
                >
                  <span className="relative z-10">{slotNum.toString().padStart(2, '0')}</span>
                  
                  {/* Dynamic card counter badge */}
                  {(() => {
                    const slotKey = slotNum === 1 && !localStorage.getItem('yowoo_custom_cards_slot_1') ? 'yowoo_custom_cards' : `yowoo_custom_cards_slot_${slotNum}`;
                    const saved = localStorage.getItem(slotKey);
                    let count = 0;
                    if (saved) {
                      try {
                        const parsed = JSON.parse(saved);
                        count = Array.isArray(parsed) ? parsed.length : 0;
                      } catch {}
                    }
                    if (count === 0) return null;
                    return (
                      <span className={`absolute -top-0.5 -right-0.5 min-w-3.5 h-3.5 px-0.5 rounded-full text-[8px] border font-display font-medium flex items-center justify-center scale-90 z-20 shadow-sm ${
                        isActive 
                          ? 'bg-slate-950 text-emerald-400 border-emerald-400/40' 
                          : 'bg-slate-950/70 text-slate-300 border-white/10'
                      }`}>
                        {count}
                      </span>
                    );
                  })()}

                  {isActive && (
                    <motion.div
                      layoutId="activeWorkspaceBubble"
                      className="absolute inset-0 rounded-lg bg-white/5"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {cards.length === 0 ? (
          /* Empty State: Central Adding Pad only */
          <div className="flex-grow flex flex-col items-center justify-center py-20 w-full">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="text-center space-y-5 max-w-sm"
            >
              <div className="space-y-1.5 mb-1 text-center font-sans">
                <h1 className="text-sm font-bold text-slate-200">空白空间</h1>
                <p className="text-xs text-slate-400 font-normal">
                  一叶扁舟，两袖清风。点击下方存储你的奇思妙想。
                </p>
              </div>

              {/* Central adding pad */}
              <motion.button
                whileHover={{ scale: 1.02, borderColor: '#10b981' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsModalOpen(true)}
                className="w-40 h-40 mx-auto border border-dashed border-white/10 bg-slate-950/40 hover:bg-slate-950/80 backdrop-blur-xl rounded-[24px] flex flex-col items-center justify-center gap-3 transition-all outline-none cursor-pointer focus:ring-1 focus:ring-emerald-500/50 shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative group"
              >
                {/* Glowing shadow */}
                <div className="absolute inset-0 bg-emerald-400/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[22px] filter blur-xl pointer-events-none" />
                
                <div className="w-10 h-10 rounded-full bg-slate-950 text-emerald-400 border border-white/5 flex items-center justify-center group-hover:scale-105 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                  <Plus size={18} className="stroke-[2.5px]" />
                </div>
                
                <div className="text-center px-4">
                  <span className="text-xs font-semibold text-slate-400 block group-hover:text-emerald-400 transition-colors">新建卡片</span>
                </div>
              </motion.button>
            </motion.div>
          </div>
        ) : (
          /* Cards Grid */
          <div className="w-full space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-200 tracking-wider font-display uppercase">所有卡片</span>
                <span className="text-[9px] font-display font-black text-emerald-400 bg-emerald-950/25 px-2 py-0.5 rounded border border-emerald-800/30 tracking-widest shadow-inner">
                  {cards.length}
                </span>
              </div>
              <span className="text-[10px] text-slate-400/80 font-medium font-sans">拖拽卡片调整顺序</span>
            </div>

            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full"
            >
              <AnimatePresence mode="popLayout">
                {cards.map((card, index) => {
                  return (
                    <motion.div
                      key={card.id}
                      layoutId={card.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ 
                        opacity: index === draggedIdx ? 0.35 : 1, 
                        scale: index === dragOverIdx && draggedIdx !== index ? 1.02 : 1
                      }}
                      exit={{ opacity: 0, scale: 0.8, y: -20 }}
                      transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                      whileHover={isDraggingModeActive ? {} : { y: -4 }}
                      onClick={() => setZoomedCard(card)}
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      onDrop={(e) => handleDrop(e, index)}
                      onMouseMove={handleMouseMove}
                      className="group/card h-[114px] relative select-none cursor-pointer bg-slate-950/70 backdrop-blur-xl rounded-2xl border transition-all duration-305 overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.55)] flex flex-row justify-between border-white/5 hover:border-emerald-400/40 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85),0_8px_25px_-5px_rgba(16,185,129,0.18)]"
                    >
                      {/* Ambient dynamic light spot overlay */}
                      <div 
                        className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none mix-blend-screen z-10"
                        style={{
                          background: 'radial-gradient(150px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(16, 185, 129, 0.15), rgba(59, 130, 246, 0.05) 50%, transparent 100%)'
                        }}
                      />

                      {/* Glowing custom border overlay to make it incredibly sharp and distinct */}
                      <div className="absolute inset-0 rounded-2xl border border-transparent group-hover/card:border-emerald-400/80 group-hover/card:shadow-[0_0_25px_rgba(16,185,129,0.25)] transition-all duration-300 pointer-events-none z-30" />

                      {/* Floating Delete button */}
                      <div className="absolute top-2 right-2 z-20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={(e) => handleDeleteCard(card.id, e)}
                          className="w-6 h-6 rounded-full bg-slate-950/95 hover:bg-rose-600 hover:text-white border border-white/10 text-slate-400 flex items-center justify-center shadow-lg transition-all cursor-pointer hover:scale-105"
                          title="删除卡片"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>

                      {/* Image Area with ultra-modern minimalist display */}
                      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
                        {/* Uniform tint overlay instead of heavy bottom-to-top fade */}
                        <div className="absolute inset-0 bg-slate-950/40 z-10 pointer-events-none group-hover/card:bg-slate-950/30 transition-all duration-300" />

                        <img 
                          src={card.imageUrl} 
                          alt="Card Preview"
                          className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Card Content with perfectly optimized spacing */}
                      <div className="absolute inset-0 w-full h-full flex flex-col justify-between z-20 bg-transparent p-3.5 pt-8 pb-2.5 min-w-0 font-sans">
                        <div className="pt-1">
                          <p className="text-xs sm:text-[13px] font-normal text-slate-100 tracking-normal leading-relaxed line-clamp-2 select-none text-left drop-shadow-[0_2px_4px_rgba(0,0,0,0.98)]">
                            {card.description || <span className="text-slate-400 italic">暂无描述</span>}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-[9px] text-slate-450 border-t border-white/5 pt-1.5 mt-1 shrink-0 font-display">
                          <span className="text-[8px] text-slate-400 tracking-widest uppercase flex items-center gap-1 group-hover/card:text-emerald-350 transition-colors duration-200">
                            <Sparkles size={8} className="text-emerald-450 group-hover/card:scale-110 transition-transform duration-300" />
                            <span>Edit Card</span>
                          </span>
                          <Heart size={8} className="text-rose-500 fill-rose-500 opacity-40 group-hover/card:opacity-90 transition-opacity duration-200" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 border-t border-slate-800/60 shrink-0 text-[10px] text-slate-500 font-sans tracking-wide relative z-10">
        <span>© {new Date().getFullYear()} Card Studio / 专注极致精简</span>
      </footer>

      {/* CREATE NEW CARD MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#04050a]/60 backdrop-blur-md"
            />
 
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="w-full max-w-md bg-[#090c14]/95 backdrop-blur-xl rounded-2xl border border-white/5 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh] text-slate-200 relative z-10"
            >
              {/* Header with Segmented Tabs */}
              <div className="px-5 pt-4 pb-2.5 border-b border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-[10px] font-bold text-slate-450 font-display tracking-widest uppercase flex items-center gap-1.5">
                    <Settings size={10} className="text-emerald-400 rotate-smooth" />
                    <span>系统与空间设置</span>
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer animate-none"
                  >
                    <X size={13} />
                  </button>
                </div>
                
                {/* Segmented Control */}
                <div className="grid grid-cols-2 p-1 bg-slate-950/80 backdrop-blur-md rounded-xl border border-white/5">
                  <button
                    type="button"
                    onClick={() => setModalActiveTab('card')}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      modalActiveTab === 'card'
                        ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Plus size={11} className={modalActiveTab === 'card' ? 'stroke-[2.5px]' : ''} />
                    <span>新建卡片</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalActiveTab('bg')}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      modalActiveTab === 'bg'
                        ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Palette size={11} />
                    <span>自定背景</span>
                  </button>
                </div>
              </div>
 
              {/* Tab Content 1: Create New Card */}
              {modalActiveTab === 'card' ? (
                <>
                  <form onSubmit={handleCreateCard} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs font-normal">
                    
                    {/* Custom Description text */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-slate-400 text-[10px] font-bold uppercase font-display tracking-widest">
                          卡片描述 *
                        </label>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => insertTimestamp(false)}
                            className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-white/5 hover:border-emerald-500/30 text-slate-400 hover:text-emerald-400 transition-colors text-[9px] font-medium font-sans cursor-pointer active:scale-95"
                            title="插入当前时间与随机空间印记"
                          >
                            <MapPin size={9} className="text-emerald-500" />
                            <span>时空印记</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => insertInspiration(false)}
                            className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-white/5 hover:border-blue-500/30 text-slate-400 hover:text-blue-400 transition-colors text-[9px] font-medium font-sans cursor-pointer active:scale-95"
                            title="随机填充一条精美诗词/生活灵感"
                          >
                            <Sparkles size={9} className="text-blue-400" />
                            <span>拾取灵感</span>
                          </button>
                        </div>
                      </div>
                      <textarea
                        rows={4}
                        maxLength={200}
                        required
                        placeholder="记录此时此地的心情与灵感..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-2 bg-[#0c0f1a] border border-white/5 rounded-xl outline-none text-slate-100 placeholder-slate-500 focus:bg-[#070a11] focus:border-emerald-500/80 transition-all font-sans leading-relaxed resize-none font-normal shadow-inner"
                      />
                    </div>
 
                    {/* Picture Config Area */}
                    <div className="p-3.5 bg-[#070a12] rounded-xl border border-white/5 space-y-3">
                      <span className="block text-slate-400 text-[10px] font-bold uppercase font-display tracking-widest">
                        背景设置
                      </span>
 
                      {/* Preset list */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-slate-400 block font-semibold font-display tracking-wider">推荐背景</span>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                          {PRESET_IMAGES.map((preset, pIdx) => {
                            const isChosen = selectedPreset === pIdx;
                            return (
                              <button
                                key={`preset-${preset.name}`}
                                type="button"
                                onClick={() => selectPresetImage(preset.url, pIdx, false)}
                                className={`relative aspect-square rounded-lg overflow-hidden border transition-all cursor-pointer ${
                                  isChosen ? 'border-emerald-400 ring-2 ring-emerald-400/20 shadow-md' : 'border-white/5 hover:border-white/10'
                                }`}
                                title={preset.name}
                              >
                                <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-x-0 bottom-0 bg-slate-950/80 backdrop-blur-[1px] py-0.5 text-[7px] text-center text-slate-300 font-medium whitespace-nowrap overflow-hidden">
                                  {preset.name}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
 
                      {/* Upload option */}
                      <div className="pt-3.5 border-t border-white/5 space-y-2">
                        <div className="flex flex-col sm:flex-row gap-3">
                          {/* Preview Box */}
                          {imageUrl ? (
                            <div className="relative w-full sm:w-16 aspect-video sm:aspect-square rounded-xl overflow-hidden bg-slate-950 border border-white/5 shrink-0 self-center shadow-sm">
                              <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => { setImageUrl(''); setSelectedPreset(null); }}
                                className="absolute inset-0 bg-black/80 opacity-0 hover:opacity-100 flex items-center justify-center text-slate-200 text-[10px] font-semibold transition-all"
                              >
                                重置
                              </button>
                            </div>
                          ) : (
                            <div className="w-full sm:w-16 h-12 sm:h-16 rounded-xl border border-dashed border-white/5 bg-[#0a0d14] flex flex-col items-center justify-center text-slate-500 shrink-0 text-[10px]">
                              <ImageIcon size={12} className="text-slate-400 mb-0.5" />
                              <span className="text-[9px] font-medium font-sans">默认背景</span>
                            </div>
                          )}
 
                          <div className="flex-1 space-y-2 w-full text-[10px]">
                            <label className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#090b14] border border-white/5 hover:border-white/10 text-slate-300 hover:text-white rounded-lg cursor-pointer outline-none transition-colors shadow-sm animate-none">
                              <Upload size={12} className="text-emerald-500 animate-none" />
                              <span className="font-semibold font-display tracking-wider">本地上传</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, false)}
                              />
                            </label>
 
                            <div className="space-y-1">
                              <span className="text-[9px] text-slate-400 block font-semibold font-display tracking-wider">网络图片 URL:</span>
                              <input
                                type="text"
                                placeholder="https://example.com/image.jpg"
                                value={imageUrl.startsWith('data:') ? '' : imageUrl}
                                onChange={(e) => {
                                  setImageUrl(e.target.value);
                                  setSelectedPreset(null);
                                }}
                                className="w-full px-2.5 py-1.5 bg-[#0c0f1a] border border-white/5 rounded-lg text-slate-200 outline-none focus:border-emerald-500/50 font-normal shadow-sm"
                              />
                            </div>
                          </div>
 
                        </div>
                      </div>
 
                    </div>
 
                  </form>
 
                  {/* Action columns footer */}
                  <div className="flex items-center justify-end gap-2.5 px-5 py-4 bg-[#060812] border-t border-white/5 font-display">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-1.5 hover:bg-white/5 text-slate-400 hover:text-white rounded-lg transition-colors font-semibold cursor-pointer text-xs tracking-wider"
                    >
                      取消
                    </button>
                    <button
                      type="button"
                      onClick={handleCreateCard}
                      disabled={!description.trim()}
                      className="px-4.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg shadow-lg shadow-emerald-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-[0.98] cursor-pointer text-xs tracking-wider"
                    >
                      确认新建
                    </button>
                  </div>
                </>
              ) : (
                /* Tab Content 2: Custom background */
                <>
                  <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs font-normal custom-scrollbar">
                    {/* Presets List */}
                    <div className="space-y-2">
                      <span className="text-[10px] text-slate-450 block font-bold font-display tracking-widest uppercase">系统主题预设</span>
                      <div className="grid grid-cols-2 gap-2">
                        {BG_PRESETS.map((preset) => (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => {
                              saveBgSettings({
                                presetId: preset.id,
                                bgColor1: preset.bgColor1,
                                bgColor2: preset.bgColor2,
                                ambientColor1: preset.ambientColor1,
                                ambientColor2: preset.ambientColor2,
                                bgImageUrl: '',
                                gridOpacity: preset.gridOpacity,
                                glowEnabled: preset.glowEnabled
                              });
                            }}
                            className={`px-3 py-2 rounded-xl border text-left flex flex-col justify-start gap-1.5 transition-all cursor-pointer ${
                              bgSettings.presetId === preset.id && !bgSettings.bgImageUrl
                                ? 'border-emerald-500 bg-emerald-500/5 text-white'
                                : 'border-white/5 bg-[#0e1222]/40 hover:border-white/10 hover:bg-[#0e1222]/80 text-slate-300'
                            }`}
                          >
                            <span className="font-bold text-[10px] font-sans">{preset.name}</span>
                            <div className="flex gap-1.5">
                              <span className="w-3 h-3 rounded-full border border-white/10 shadow-sm" style={{ backgroundColor: preset.bgColor1 }} />
                              <span className="w-3 h-3 rounded-full border border-white/10 shadow-sm" style={{ backgroundColor: preset.bgColor2 }} />
                              <span className="w-3 h-3 rounded-full filter blur-[1px]" style={{ backgroundColor: preset.ambientColor1 }} />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
 
                    {/* Presets Wallpaper Grid */}
                    <div className="space-y-2 pt-3 border-t border-white/5">
                      <span className="text-[10px] text-slate-450 block font-bold font-display tracking-widest uppercase">艺术壁纸插画</span>
                      <div className="grid grid-cols-5 gap-1.5">
                        {WALLPAPER_PRESETS.map((wall) => (
                          <button
                            key={wall.name}
                            type="button"
                            onClick={() => {
                              saveBgSettings({
                                ...bgSettings,
                                presetId: 'wallpaper-' + wall.name,
                                bgImageUrl: wall.url
                              });
                            }}
                            className={`relative aspect-square rounded-lg overflow-hidden border transition-all cursor-pointer ${
                              bgSettings.bgImageUrl === wall.url ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-white/5 hover:border-white/12'
                            }`}
                            title={wall.name}
                          >
                            <img src={wall.url} alt={wall.name} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
 
                    {/* Upload Wallpaper or URL input */}
                    <div className="space-y-2 pt-3.5 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-450 block font-bold font-display tracking-widest uppercase">自定壁纸链接</span>
                        <label className="text-[9px] text-[#3b82f6] hover:text-blue-400 cursor-pointer flex items-center gap-0.5 font-bold font-display tracking-wider">
                          <Upload size={10} />
                          <span>本地上传</span>
                          <input type="file" accept="image/*" className="hidden" onChange={handleBgUpload} />
                        </label>
                      </div>
                      <input
                        type="text"
                        placeholder="粘贴任意 Unsplash 壁纸链接..."
                        value={bgSettings.bgImageUrl && !bgSettings.bgImageUrl.startsWith('data:') ? bgSettings.bgImageUrl : ''}
                        onChange={(e) => {
                          saveBgSettings({
                            ...bgSettings,
                            presetId: 'custom-url',
                            bgImageUrl: e.target.value
                          });
                        }}
                        className="w-full px-3 py-2 bg-[#0c0f1a] border border-white/5 rounded-xl text-slate-200 outline-none focus:border-emerald-500/40 focus:bg-[#070a11] transition-all text-xs"
                      />
                    </div>
 
                    {/* Fog elements and grids details */}
                    <div className="space-y-3 pt-3.5 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-450 block font-bold font-display tracking-widest uppercase">氛围与网格</span>
                        <button
                          type="button"
                          onClick={() => {
                            saveBgSettings({
                              ...bgSettings,
                              glowEnabled: !bgSettings.glowEnabled
                            });
                          }}
                          className={`text-[9px] px-2 py-0.5 rounded-lg cursor-pointer font-bold ${
                            bgSettings.glowEnabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-900 text-slate-500 border border-white/5'
                          }`}
                        >
                          {bgSettings.glowEnabled ? '氛围光: 开启' : '氛围光: 关闭'}
                        </button>
                      </div>
 
                      {/* Accent RGB light customization */}
                      <div className="flex items-center justify-between gap-1.5 text-[10px] text-slate-400 bg-black/25 p-2 rounded-xl border border-white/5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400">光环一:</span>
                          <input
                            type="color"
                            value={bgSettings.ambientColor1.startsWith('rgba') ? '#10b981' : bgSettings.ambientColor1}
                            onChange={(e) => {
                              saveBgSettings({
                                ...bgSettings,
                                ambientColor1: e.target.value,
                                presetId: 'custom-colors'
                              });
                            }}
                            className="w-5 h-5 rounded-md cursor-pointer bg-transparent border-0 overflow-hidden"
                          />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400 ml-2">光环二:</span>
                          <input
                            type="color"
                            value={bgSettings.ambientColor2.startsWith('rgba') ? '#3b82f6' : bgSettings.ambientColor2}
                            onChange={(e) => {
                              saveBgSettings({
                                ...bgSettings,
                                ambientColor2: e.target.value,
                                presetId: 'custom-colors'
                              });
                            }}
                            className="w-5 h-5 rounded-md cursor-pointer bg-transparent border-0 overflow-hidden"
                          />
                        </div>
                      </div>
 
                      {/* Grid intensity slider bar */}
                      <div className="space-y-1 bg-black/10 p-2.5 rounded-xl border border-white/5">
                        <div className="flex justify-between text-[9px] text-slate-450 font-mono">
                          <span>网格密度: {(bgSettings.gridOpacity * 10).toFixed(0)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          step="1"
                          value={bgSettings.gridOpacity}
                          onChange={(e) => {
                            saveBgSettings({
                              ...bgSettings,
                              gridOpacity: parseFloat(e.target.value)
                            });
                          }}
                          className="w-full accent-emerald-500 h-1.5 rounded-lg bg-slate-900 cursor-pointer"
                        />
                      </div>

                      {/* Wallpaper Clarity & Blur controls (Shown when there is a wallpaper) */}
                      {bgSettings.bgImageUrl && (
                        <div className="space-y-3 bg-black/10 p-2.5 rounded-xl border border-white/5 pt-3">
                          <span className="text-[10px] text-slate-400 block font-bold font-display tracking-widest uppercase mb-1">
                            壁纸清晰度/模糊效果
                          </span>
                          
                          {/* Masking Opacity control */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[9px] text-slate-450 font-mono">
                              <span>遮罩暗度 (越低背景越清晰):</span>
                              <span className="text-emerald-400 font-bold">{maskOpacity}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="90"
                              step="5"
                              value={maskOpacity}
                              onChange={(e) => {
                                saveBgSettings({
                                  ...bgSettings,
                                  maskOpacity: parseInt(e.target.value)
                                });
                              }}
                              className="w-full accent-emerald-500 h-1.5 rounded-lg bg-slate-900 cursor-pointer"
                            />
                          </div>

                          {/* Blur amount control */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[9px] text-slate-450 font-mono">
                              <span>毛玻璃虚化度 (0px 为最清晰):</span>
                              <span className="text-emerald-400 font-bold">{blurAmount}px</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="16"
                              step="1"
                              value={blurAmount}
                              onChange={(e) => {
                                saveBgSettings({
                                  ...bgSettings,
                                  blurAmount: parseInt(e.target.value)
                                });
                              }}
                              className="w-full accent-emerald-500 h-1.5 rounded-lg bg-slate-900 cursor-pointer"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
  
                  {/* Action columns footer */}
                  <div className="flex items-center justify-between gap-2.5 px-5 py-4 bg-[#060812] border-t border-white/5 font-display">
                    <button
                      type="button"
                      onClick={() => {
                        saveBgSettings({
                          presetId: 'obsidian',
                          bgColor1: '#03050c',
                          bgColor2: '#080c18',
                          ambientColor1: 'rgba(16, 185, 129, 0.08)',
                          ambientColor2: 'rgba(59, 130, 246, 0.08)',
                          bgImageUrl: '',
                          gridOpacity: 2.5,
                          glowEnabled: true,
                          maskOpacity: 25,
                          blurAmount: 0,
                        });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-950/60 border border-white/5 hover:border-white/10 hover:bg-slate-950 hover:text-white text-slate-400 transition-all font-semibold cursor-pointer text-[10px]"
                    >
                      恢复默认曜石深邃
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-5 py-1.5 bg-[#0e1220] hover:bg-[#12182b] text-white border border-white/5 rounded-lg text-xs font-bold transition-all hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
                    >
                      保存并关闭
                    </button>
                  </div>
                </>
              )}
 
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {editingCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingCard(null)}
              className="absolute inset-0 bg-[#04050a]/60 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className={`w-full ${isEditingMode ? 'max-w-md' : 'max-w-xl'} bg-[#090c14]/95 backdrop-blur-xl rounded-2xl border border-white/5 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh] text-slate-200 relative z-10 transition-all duration-300`}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                <h2 className="text-xs font-bold text-white flex items-center gap-1.5 font-display tracking-wider uppercase">
                  <Sparkles size={11} className={isEditingMode ? "text-[#3b82f6]" : "text-emerald-400"} />
                  <span>{isEditingMode ? '编辑卡片' : '卡片详情'}</span>
                </h2>
                <button
                  onClick={() => setEditingCard(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              {!isEditingMode ? (
                /* Card Detail View/Showcase Mode */
                <>
                  <div className="flex-1 overflow-y-auto flex flex-col sm:flex-row">
                    {/* Left Column: Cover Image Area */}
                    <div className="w-full sm:w-[220px] h-44 sm:h-auto overflow-hidden relative bg-slate-950 border-b sm:border-b-0 sm:border-r border-white/5 flex-shrink-0">
                      <img 
                        src={editImageUrl || PRESET_IMAGES[2].url} 
                        alt="Card Preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#090c14] via-[#090c14]/40 to-transparent pointer-events-none" />
                    </div>

                    {/* Right Column: Narrative Details */}
                    <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between overflow-y-auto">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold text-emerald-400 font-display tracking-widest uppercase px-2 py-0.5 rounded bg-emerald-950/20 border border-emerald-550/20">
                            Slot {activeSlot.toString().padStart(2, '0')}
                          </span>
                        </div>

                        {/* Detailed Story Paragraph */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] text-slate-400 block font-display tracking-wider font-semibold">详细描述</span>
                          <div className="text-slate-200 text-xs leading-relaxed font-sans whitespace-pre-wrap max-h-[170px] overflow-y-auto pr-2 custom-scrollbar font-normal">
                            {editDescription ? editDescription : (
                              <span className="text-slate-500 italic font-normal">暂无描述。</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Info footer */}
                      <div className="flex items-center justify-between text-[9px] text-slate-400/80 border-t border-white/5 pt-3 mt-4 leading-none font-display font-medium">
                        <span className="flex items-center gap-1">
                          <Heart size={8} className="text-rose-500 fill-rose-500 opacity-60 font-medium" />
                          <span>已收录于卡片空间</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions columns */}
                  <div className="flex items-center justify-between px-5 py-4 bg-[#060812] border-t border-white/5 font-display">
                    <button
                      type="button"
                      onClick={(e) => {
                        if (confirm('确认删除此卡片吗？')) {
                          handleDeleteCard(editingCard.id, e);
                        }
                      }}
                      className="px-3.5 py-1.5 text-rose-450 hover:text-white border border-transparent hover:bg-rose-600/90 hover:border-rose-600 rounded-lg transition-all font-semibold text-xs cursor-pointer flex items-center gap-1.5 animate-none"
                    >
                      <Trash2 size={11} className="text-rose-450 hover:text-white" />
                      <span>删除</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingMode(true)}
                        className="px-4 py-1.5 bg-white text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1"
                      >
                        编辑
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCard(null)}
                        className="px-4 py-1.5 bg-[#0c0f1a] border border-white/5 hover:border-white/10 hover:bg-[#111425] text-slate-400 hover:text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
                      >
                        关闭
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* Standard Form Editing Mode */
                <>
                  <form onSubmit={handleUpdateCard} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs font-normal">
                    
                    {/* Custom Description text */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-slate-400 text-[10px] font-bold uppercase font-display tracking-widest">
                          卡片描述 *
                        </label>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => insertTimestamp(true)}
                            className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#090b14] border border-white/5 hover:border-emerald-500/30 text-slate-400 hover:text-emerald-400 transition-colors text-[9px] font-medium font-sans cursor-pointer active:scale-95"
                            title="插入当前时间与随机空间印记"
                          >
                            <MapPin size={9} className="text-emerald-400" />
                            <span>时空印记</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => insertInspiration(true)}
                            className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#090b14] border border-white/5 hover:border-blue-500/30 text-slate-400 hover:text-blue-400 transition-colors text-[9px] font-medium font-sans cursor-pointer active:scale-95"
                            title="随机填充一条精美诗词/生活灵感"
                          >
                            <Sparkles size={9} className="text-blue-400" />
                            <span>拾取灵感</span>
                          </button>
                        </div>
                      </div>
                      <textarea
                        rows={4}
                        maxLength={200}
                        required
                        placeholder="记录此时此地的心情与灵感..."
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full px-3 py-2 bg-[#0c0f1a] border border-white/5 rounded-xl outline-none text-slate-100 placeholder-slate-500 focus:bg-[#070a11] focus:border-[#3b82f6] transition-all font-sans leading-relaxed resize-none shadow-inner"
                      />
                    </div>

                    {/* Picture Config Area */}
                    <div className="p-3.5 bg-[#070a12] rounded-xl border border-white/5 space-y-3">
                      <span className="block text-slate-400 text-[10px] font-bold uppercase font-display tracking-widest">
                        背景设置
                      </span>

                      {/* Preset list */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-slate-400 block font-semibold font-display tracking-wider">推荐背景</span>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                          {PRESET_IMAGES.map((preset, pIdx) => {
                            const isChosen = editSelectedPreset === pIdx;
                            return (
                              <button
                                key={`edit-preset-${preset.name}`}
                                type="button"
                                onClick={() => selectPresetImage(preset.url, pIdx, true)}
                                className={`relative aspect-square rounded-lg overflow-hidden border transition-all cursor-pointer ${
                                  isChosen ? 'border-[#3b82f6] ring-2 ring-[#3b82f6]/20' : 'border-white/5 hover:border-white/10'
                                }`}
                                title={preset.name}
                              >
                                <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-x-0 bottom-0 bg-slate-950/80 backdrop-blur-[1px] py-0.5 text-[7px] text-center text-slate-300 font-medium whitespace-nowrap overflow-hidden">
                                  {preset.name}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Upload option */}
                      <div className="pt-3.5 border-t border-white/5 space-y-2">
                        <div className="flex flex-col sm:flex-row gap-3">
                          {/* Preview Box */}
                          {editImageUrl ? (
                            <div className="relative w-full sm:w-16 aspect-video sm:aspect-square rounded-xl overflow-hidden bg-slate-950 border border-white/5 shrink-0 self-center shadow-sm">
                              <img src={editImageUrl} alt="preview" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => { setEditImageUrl(''); setEditSelectedPreset(null); }}
                                className="absolute inset-0 bg-black/80 opacity-0 hover:opacity-100 flex items-center justify-center text-slate-200 text-[10px] font-semibold transition-all"
                              >
                                重置
                              </button>
                            </div>
                          ) : (
                            <div className="w-full sm:w-16 h-12 sm:h-16 rounded-xl border border-dashed border-white/5 bg-[#0a0d14] flex flex-col items-center justify-center text-slate-500 shrink-0 text-[10px]">
                              <ImageIcon size={12} className="text-slate-400 mb-0.5" />
                              <span className="text-[9px] font-medium font-sans">默认背景</span>
                            </div>
                          )}

                          <div className="flex-1 space-y-2 w-full text-[10px]">
                            <label className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#090b14] border border-white/5 hover:border-white/10 text-slate-300 hover:text-white rounded-lg cursor-pointer outline-none transition-colors shadow-sm animate-none">
                              <Upload size={12} className="text-emerald-500 animate-none" />
                              <span className="font-semibold font-display tracking-wider font-semibold">本地上传</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, true)}
                              />
                            </label>

                            <div className="space-y-1">
                              <span className="text-[9px] text-slate-400 block font-semibold font-display tracking-wider">网络图片 URL:</span>
                              <input
                                type="text"
                                placeholder="https://example.com/image.jpg"
                                value={editImageUrl.startsWith('data:') ? '' : editImageUrl}
                                onChange={(e) => {
                                  setEditImageUrl(e.target.value);
                                  setEditSelectedPreset(null);
                                }}
                                className="w-full px-2.5 py-1.5 bg-[#0c0f1a] border border-white/5 rounded-lg text-slate-200 outline-none focus:border-[#3b82f6]/50 font-normal shadow-sm"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>

                  </form>

                  {/* Action columns footer */}
                  <div className="flex items-center justify-between px-5 py-4 bg-[#060812] border-t border-white/5 font-display">
                    <button
                      type="button"
                      onClick={() => setIsEditingMode(false)}
                      className="px-4 py-1.5 hover:bg-white/5 text-slate-400 hover:text-white rounded-lg transition-colors font-semibold cursor-pointer text-xs tracking-wider"
                    >
                      返回
                    </button>
                    <button
                      type="button"
                      onClick={handleUpdateCard}
                      disabled={!editDescription.trim()}
                      className="px-4.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-md shadow-blue-500/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-[0.98] cursor-pointer text-xs tracking-wider"
                    >
                      保存
                    </button>
                  </div>
                </>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {zoomedCard && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4">
            {/* Blurred ambient overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setZoomedCard(null)}
              className="absolute inset-0 bg-[#020306]/92 backdrop-blur-2xl"
            />

            {/* Main Cinema zoom board */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 30 }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="relative max-w-xl w-full bg-[#0a0d16]/95 backdrop-blur-2xl border border-white/5 rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.95)] flex flex-col z-10"
            >
              {/* Dynamic magnified card visual layer (Zero overlap gradients) */}
              <div className="relative w-full bg-[#020306] flex items-center justify-center overflow-hidden group max-h-[55vh]">
                <img
                  src={zoomedCard.imageUrl}
                  alt="Magnified Preview"
                  className="w-full h-auto max-h-[55vh] object-contain select-none transition-transform duration-1000 hover:scale-[1.02]"
                  referrerPolicy="no-referrer"
                />
                
                {/* Floating Top Header Info */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-emerald-400 font-display tracking-widest uppercase px-3 py-1 bg-slate-950/80 backdrop-blur-md border border-white/5 rounded-full pointer-events-auto shadow-sm">
                      Slot {activeSlot.toString().padStart(2, '0')}
                    </span>
                  </div>
                  <button
                    onClick={() => setZoomedCard(null)}
                    className="p-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/5 hover:border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer shadow-lg hover:rotate-90 pointer-events-auto box-content"
                    title="关闭放大"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Narratives details panel under the image */}
              <div className="p-5 sm:p-6 flex flex-col gap-4.5 bg-[#05070d]/40">
                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold text-emerald-400 font-display tracking-widest uppercase px-2 py-0.5 rounded bg-emerald-950/20 border border-emerald-550/20 inline-block">
                    卡片印记
                  </span>
                  <p className="text-slate-100 text-xs sm:text-sm font-sans font-normal leading-relaxed text-left whitespace-pre-wrap max-h-[140px] overflow-y-auto custom-scrollbar pr-2 leading-relaxed">
                    {zoomedCard.description || <span className="text-slate-500 italic">暂无描述</span>}
                  </p>
                </div>

                <div className="w-full h-[1px] bg-white/5" />

                {/* Combined Custom Action Row */}
                <div className="flex items-center justify-center font-display">
                  <button
                    type="button"
                    onClick={() => {
                      // Instantly launch editing process!
                      setEditingCard(zoomedCard);
                      setIsEditingMode(true);
                      setEditTitle('');
                      setEditDescription(zoomedCard.description);
                      setEditImageUrl(zoomedCard.imageUrl);
                      
                      const matchedIdx = PRESET_IMAGES.findIndex(img => img.url === zoomedCard.imageUrl);
                      setEditSelectedPreset(matchedIdx !== -1 ? matchedIdx : null);

                      // Fade out magnification state
                      setZoomedCard(null);
                    }}
                    className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs tracking-wider transition-all shadow-md active:scale-98 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles size={11} className="stroke-[2.5px]" />
                    <span>编辑卡片</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
