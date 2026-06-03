import React, { useState, useRef, useEffect, MouseEvent } from 'react';
import { 
  Calendar, MapPin, Compass, DollarSign, Clock, Star, Plus, Trash2, Edit3, 
  ChevronRight, ChevronDown, ZoomIn, ZoomOut, Maximize2, AlertCircle, Utensils, Bed, Sparkles,
  GripVertical, Layers
} from 'lucide-react';
import { TravelNode, NodeType } from '../types';

interface PositionedNode {
  node: TravelNode;
  x: number;
  y: number;
  height: number;
  parentId?: string;
  level: number;
}

interface MindmapCanvasProps {
  rootNode: TravelNode;
  onSelectNode: (node: TravelNode) => void;
  activeNode: TravelNode | null;
  onAddChild: (parentNode: TravelNode) => void;
  onEditNode: (node: TravelNode) => void;
  onDeleteNode: (nodeId: string) => void;
  onUpdateTree?: (newRoot: TravelNode) => void;
}

/**
 * Deep extraction / clone of a node from parent
 */
function findAndExtractNode(root: TravelNode, targetId: string): { 
  newRoot: TravelNode | null; 
  extractedNode: TravelNode | null;
} {
  if (root.id === targetId) {
    return { newRoot: null, extractedNode: { ...root } };
  }
  
  if (root.children && root.children.length > 0) {
    const index = root.children.findIndex(c => c.id === targetId);
    if (index !== -1) {
      const extractedNode = { ...root.children[index] };
      const newChildren = root.children.filter((_, i) => i !== index);
      return {
        newRoot: { ...root, children: newChildren },
        extractedNode
      };
    }
    
    let foundExtracted: TravelNode | null = null;
    const nextChildren: TravelNode[] = root.children.map(child => {
      const result = findAndExtractNode(child, targetId);
      if (result.extractedNode) {
        foundExtracted = result.extractedNode;
      }
      return result.newRoot || child;
    });
    
    return {
      newRoot: { ...root, children: nextChildren },
      extractedNode: foundExtracted
    };
  }
  
  return { newRoot: root, extractedNode: null };
}

/**
 * Deep insertion / clone of a node into new location
 */
function insertNodeIntoTree(
  root: TravelNode, 
  insertedNode: TravelNode, 
  targetId: string, 
  relation: 'inside' | 'before' | 'after'
): TravelNode {
  if (root.id === targetId && relation === 'inside') {
    return {
      ...root,
      children: [...(root.children || []), insertedNode]
    };
  }
  
  if (root.children && root.children.length > 0) {
    const index = root.children.findIndex(c => c.id === targetId);
    if (index !== -1) {
      const newChildren = [...root.children];
      if (relation === 'inside') {
        newChildren[index] = {
          ...newChildren[index],
          children: [...(newChildren[index].children || []), insertedNode]
        };
      } else if (relation === 'before') {
        newChildren.splice(index, 0, insertedNode);
      } else if (relation === 'after') {
        newChildren.splice(index + 1, 0, insertedNode);
      }
      return {
        ...root,
        children: newChildren
      };
    }
    
    return {
      ...root,
      children: root.children.map(child => insertNodeIntoTree(child, insertedNode, targetId, relation))
    };
  }
  
  return root;
}

/**
 * Perform immutable node move execution
 */
export function moveNodeInTree(
  root: TravelNode, 
  draggedId: string, 
  targetId: string, 
  relation: 'inside' | 'before' | 'after'
): TravelNode {
  const { newRoot: rootAfterExtract, extractedNode } = findAndExtractNode(root, draggedId);
  if (!extractedNode || !rootAfterExtract) return root;
  return insertNodeIntoTree(rootAfterExtract, extractedNode, targetId, relation);
}

// Fixed dimensions for layout rendering
const CARD_WIDTH = 230;
const CARD_HEIGHT = 70;
const COLUMN_SPACING = 310;
const NODE_GAP_Y = 24;

export default function MindmapCanvas({
  rootNode,
  onSelectNode,
  activeNode,
  onAddChild,
  onEditNode,
  onDeleteNode,
  onUpdateTree,
}: MindmapCanvasProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [simplifyMindmap, setSimplifyMindmap] = useState(true);
  const [scale, setScale] = useState(1.0);
  const [panOffset, setPanOffset] = useState({ x: 30, y: 70 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // Drag-and-drop Nodes State
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [draggedOffset, setDraggedOffset] = useState({ x: 0, y: 0 });
  const [dragCurrentPos, setDragCurrentPos] = useState({ x: 0, y: 0 });
  const [hoverTargetId, setHoverTargetId] = useState<string | null>(null);
  const [hoverRelation, setHoverRelation] = useState<'inside' | 'before' | 'after' | null>(null);

  // Auto-expand Destination and Day nodes initially
  useEffect(() => {
    const initialExpanded = new Set<string>();
    
    // Auto expand root
    initialExpanded.add(rootNode.id);
    
    // Auto expand days
    if (rootNode.children) {
      rootNode.children.forEach(day => {
        initialExpanded.add(day.id);
      });
    }
    
    setExpandedIds(initialExpanded);
  }, [rootNode]);

  const toggleExpand = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(expandedIds);
    if (next.has(nodeId)) {
      next.delete(nodeId);
    } else {
      next.add(nodeId);
    }
    setExpandedIds(next);
  };

  // Drag handle trigger
  const handleNodeDragStart = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    const pNode = nodes.find(n => n.node.id === nodeId);
    if (!pNode) return;
    
    const cursorX = (e.clientX - panOffset.x) / scale;
    const cursorY = (e.clientY - panOffset.y) / scale;
    
    setDraggedNodeId(nodeId);
    setDraggedOffset({
      x: cursorX - pNode.x,
      y: cursorY - (pNode.y - CARD_HEIGHT / 2)
    });
    setDragCurrentPos({
      x: pNode.x,
      y: pNode.y - CARD_HEIGHT / 2
    });
  };

  // Drag to pan or move node handling
  const handleMouseDown = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input')) {
      return;
    }
    setIsDragging(true);
    dragStart.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (draggedNodeId) {
      e.stopPropagation();
      
      const cursorX = (e.clientX - panOffset.x) / scale;
      const cursorY = (e.clientY - panOffset.y) / scale;
      
      const nextX = cursorX - draggedOffset.x;
      const nextY = cursorY - draggedOffset.y;
      
      setDragCurrentPos({ x: nextX, y: nextY });
      
      let bestTargetId: string | null = null;
      let bestRelation: 'inside' | 'before' | 'after' | null = null;
      let minDistance = Infinity;
      
      // Compute forbidden descendant nodes to prevent loop cycles
      const forbiddenIds = new Set<string>();
      forbiddenIds.add(draggedNodeId);
      
      const draggedNodeObj = nodes.find(n => n.node.id === draggedNodeId)?.node;
      if (draggedNodeObj) {
        const collectDescendants = (n: TravelNode) => {
          if (n.children) {
            n.children.forEach(c => {
              forbiddenIds.add(c.id);
              collectDescendants(c);
            });
          }
        };
        collectDescendants(draggedNodeObj);
      }
      
      nodes.forEach((posNode) => {
        const targetId = posNode.node.id;
        if (forbiddenIds.has(targetId)) return;
        
        const left = posNode.x;
        const right = posNode.x + CARD_WIDTH;
        const top = posNode.y - CARD_HEIGHT / 2;
        const bottom = posNode.y + CARD_HEIGHT / 2;
        
        const hoverRangeX = 150;
        const hoverRangeY = 40;
        
        const isWithinX = cursorX >= left - hoverRangeX && cursorX <= right + hoverRangeX;
        const isWithinY = cursorY >= top - hoverRangeY && cursorY <= bottom + hoverRangeY;
        
        if (isWithinX && isWithinY) {
          const centerX = left + CARD_WIDTH / 2;
          const centerY = top + CARD_HEIGHT / 2;
          const dist = Math.hypot(cursorX - centerX, cursorY - centerY);
          
          if (dist < minDistance) {
            minDistance = dist;
            bestTargetId = targetId;
            
            if (posNode.node.type === 'destination') {
              bestRelation = 'inside';
            } else {
              const relativeY = (cursorY - top) / CARD_HEIGHT;
              if (relativeY <= 0.3) {
                bestRelation = 'before';
              } else if (relativeY >= 0.7) {
                bestRelation = 'after';
              } else {
                bestRelation = 'inside';
              }
            }
          }
        }
      });
      
      setHoverTargetId(bestTargetId);
      setHoverRelation(bestRelation);
      
    } else if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y
      });
    }
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
    
    if (draggedNodeId) {
      if (hoverTargetId && hoverRelation && onUpdateTree) {
        const newTree = moveNodeInTree(rootNode, draggedNodeId, hoverTargetId, hoverRelation);
        if (newTree) {
          onUpdateTree(newTree);
        }
      }
      setDraggedNodeId(null);
      setHoverTargetId(null);
      setHoverRelation(null);
    }
  };

  // Keyboard navigation & zoom
  const zoomIn = () => setScale(prev => Math.min(prev + 0.15, 1.6));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.15, 0.5));
  
  const resetViewport = () => {
    setScale(1.0);
    setPanOffset({ x: 45, y: 90 });
  };

  // TREE LAYOUT ALGORITHM
  // Post-order traversal to calculate Y-centers based on leaf distribution and expanded nodes
  function layoutTree(
    node: TravelNode, 
    level: number, 
    startY: number, 
    parentId?: string
  ): { positioned: PositionedNode[]; totalHeight: number } {
    const isExpanded = (expandedIds.has(node.id) || level === 0) && (!simplifyMindmap || level < 1);
    const children = node.children || [];

    if (!isExpanded || children.length === 0) {
      const singleNodeHeight = CARD_HEIGHT + NODE_GAP_Y;
      return {
        positioned: [{
          node,
          x: level * COLUMN_SPACING + 20,
          y: startY + singleNodeHeight / 2,
          height: singleNodeHeight,
          parentId,
          level
        }],
        totalHeight: singleNodeHeight
      };
    }

    let currentY = startY;
    const childrenPositioned: PositionedNode[] = [];

    for (const child of children) {
      const { positioned: childPos, totalHeight: childHeight } = layoutTree(
        child,
        level + 1,
        currentY,
        node.id
      );
      childrenPositioned.push(...childPos);
      currentY += childHeight;
    }

    const totalHeight = currentY - startY;
    const selfY = startY + totalHeight / 2;

    const selfPositioned: PositionedNode = {
      node,
      x: level * COLUMN_SPACING + 20,
      y: selfY,
      height: totalHeight,
      parentId,
      level
    };

    return {
      positioned: [selfPositioned, ...childrenPositioned],
      totalHeight
    };
  }

  // Precompute whole tree positions
  const { positioned: nodes, totalHeight: canvasTreeHeight } = layoutTree(rootNode, 0, 0);

  // Render proper icon per type
  const renderNodeIcon = (type: NodeType, transportMethod?: string) => {
    switch (type) {
      case 'destination':
        return <Compass size={16} className="text-emerald-700 font-bold" />;
      case 'day':
        return <Calendar size={15} className="text-emerald-600" />;
      case 'activity':
        return <Sparkles size={15} className="text-sky-600" />;
      case 'dining':
        return <Utensils size={15} className="text-amber-600" />;
      case 'lodging':
        return <Bed size={15} className="text-indigo-600" />;
      case 'transport':
        return <span className="text-slate-500 font-bold text-sm">
          {transportMethod === 'walk' && '🚶'}
          {transportMethod === 'subway' && '🚇'}
          {transportMethod === 'bus' && '🚌'}
          {transportMethod === 'taxi' && '🚕'}
          {transportMethod === 'train' && '🚄'}
          {transportMethod === 'flight' && '✈️'}
          {!transportMethod && '🚕'}
        </span>;
      case 'tip':
        return <AlertCircle size={15} className="text-rose-600" />;
      default:
        return <MapPin size={15} className="text-slate-600" />;
    }
  };

  // Styling customizer based on category type
  const getNodeStyles = (type: NodeType, isSelected: boolean, isHoveredTarget = false) => {
    const base = "absolute flex flex-col justify-between shrink-0 p-3 rounded-xl border transition-all text-xs text-left " + 
      (isHoveredTarget ? "ring-4 ring-dashed ring-emerald-400 bg-emerald-950/40 shadow-lg scale-[1.02] border-emerald-400 z-30 " : "");
    const selectRing = isSelected 
      ? "ring-2 ring-emerald-500/80 shadow-md shadow-emerald-500/10 border-emerald-500 bg-[#162035] md:scale-[1.02] z-20 text-emerald-100" 
      : "shadow-sm border-slate-800/85 bg-[#0f1624] hover:border-slate-700 hover:shadow-md hover:scale-[1.005] transition-all duration-200 text-slate-300";

    switch (type) {
      case 'destination':
        return (isHoveredTarget ? `${base} ` : `${base} bg-gradient-to-br from-emerald-950/50 to-slate-900/50 hover:from-emerald-900/40 `) + `border-emerald-800/80 ring-1 ring-emerald-900/40 ${
          isSelected ? 'ring-2 ring-emerald-500 shadow-md border-emerald-500 z-20 text-white' : 'text-emerald-100'
        }`;
      case 'day':
        return `${base} ${selectRing} border-l-4 border-l-emerald-500`;
      case 'activity':
        return `${base} ${selectRing} border-l-4 border-l-sky-500`;
      case 'dining':
        return `${base} ${selectRing} border-l-4 border-l-amber-500`;
      case 'lodging':
        return `${base} ${selectRing} border-l-4 border-l-indigo-500`;
      case 'transport':
        return `${base} ${selectRing} border-slate-800 border-dashed bg-slate-950/40 border-l-4 border-l-slate-400`;
      case 'tip':
        return `${base} ${selectRing} border-l-4 border-l-rose-400 bg-rose-950/20`;
      default:
        return `${base} ${selectRing}`;
    }
  };

  return (
    <div className="relative w-full overflow-hidden bg-[#0a0f1d] rounded-3xl border border-slate-800 shadow-xl flex flex-col">
      
      {/* Canvas Toolbars & Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800/60 bg-[#0f1525]/95 backdrop-blur-md z-10 shrink-0">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-300">
              层级脑图画布 <span className="text-slate-500 font-mono italic font-normal">(按住背景可任意拖拽)</span>
            </span>
          </div>

          <button
            type="button"
            onClick={() => setSimplifyMindmap(!simplifyMindmap)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all ${
              simplifyMindmap 
                ? 'bg-[#18233a] text-emerald-400 border-emerald-900/50' 
                : 'bg-[#111827] text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Layers size={11} />
            {simplifyMindmap ? '脑图已简化 (仅看大致天数)' : '脑图全貌 (查看所有活动)'}
          </button>
        </div>

        {/* Action controllers */}
        <div className="flex items-center gap-1.5 bg-[#172033] p-1 rounded-xl border border-slate-800/40">
          <button
            onClick={zoomIn}
            className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-[#1e293b] rounded-lg transition-all"
            title="放大"
          >
            <ZoomIn size={15} />
          </button>
          <div className="h-4 w-[1px] bg-slate-800 mx-1" />
          <span className="text-[11px] font-bold font-mono text-slate-400 w-11 text-center select-none">
            {Math.round(scale * 100)}%
          </span>
          <div className="h-4 w-[1px] bg-slate-800 mx-1" />
          <button
            onClick={zoomOut}
            className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-[#1e293b] rounded-lg transition-all"
            title="缩小"
          >
            <ZoomOut size={15} />
          </button>
          <button
            onClick={resetViewport}
            className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-[#1e293b] rounded-lg transition-all"
            title="重置居中"
          >
            <Maximize2 size={15} />
          </button>
        </div>
      </div>

      {/* Viewport Interactive Board Container */}
      <div 
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className="w-full h-[580px] relative overflow-hidden select-none cursor-grab active:cursor-grabbing focus:outline-none"
      >
        {/* Dynamic Transformed Board */}
        <div 
          style={{ 
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${scale})`,
            transformOrigin: '0 0'
          }}
          className="absolute w-[3200px] h-[3200px] transition-transform duration-75 ease-out origin-top-left"
        >
          
          {/* Back grid pattern overlay */}
          <div className="absolute inset-0 bg-grid-pattern opacity-70 pointer-events-none" />

          {/* SVG Connection Lines overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            {nodes.map((n) => {
              if (!n.parentId) return null;
              
              const parent = nodes.find(parentEl => parentEl.node.id === n.parentId);
              if (!parent) return null;

              // Left side coordinates of the child, Center height coordinates
              const cx = n.x;
              const cy = n.y;

              // Right side coordinates of the parent
              const px = parent.x + CARD_WIDTH;
              const py = parent.y;

              // Cubic bezier connect curves
              const controllerOffset = Math.min((cx - px) * 0.45, 120);
              const pathString = `M ${px} ${py} C ${px + controllerOffset} ${py}, ${cx - controllerOffset} ${cy}, ${cx} ${cy}`;

              let isSlashed = n.node.type === 'transport'; // dotted connection lines for transport nodes

              // Determine if the line connects an active path
              const isPathActive = activeNode ? (activeNode.id === n.node.id || activeNode.id === n.parentId) : false;
              const strokeColor = isPathActive ? '#10b981' : '#cbd5e1';
              const strokeWidth = isPathActive ? '2.5' : '1.5';
              const strokeOpacity = isPathActive ? '0.90' : '0.45';

              return (
                <path
                  key={`line-${n.node.id}`}
                  d={pathString}
                  fill="none"
                  stroke={isPathActive ? 'url(#lineGrad)' : strokeColor}
                  strokeWidth={strokeWidth}
                  strokeOpacity={strokeOpacity}
                  strokeDasharray={isSlashed ? "4 4" : "none"}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>

          {/* Raw positioned HTML Nodes */}
          {nodes.map((nodePos) => {
            const { node, x, y, level } = nodePos;
            const isSelected = activeNode?.id === node.id;
            const isExpanded = expandedIds.has(node.id);
            const hasChildren = node.children && node.children.length > 0;
            const isDraggedSelf = draggedNodeId === node.id;
            const isHoveredTargetInside = hoverTargetId === node.id && hoverRelation === 'inside';

            return (
              <div
                key={node.id}
                onClick={() => {
                  if (!draggedNodeId) {
                    onSelectNode(node);
                  }
                }}
                style={{
                  left: `${x}px`,
                  top: `${y - CARD_HEIGHT / 2}px`,
                  width: `${CARD_WIDTH}px`,
                  height: `${CARD_HEIGHT}px`,
                  opacity: isDraggedSelf ? 0.35 : 1,
                  pointerEvents: draggedNodeId ? 'none' : 'auto',
                }}
                className={getNodeStyles(node.type, isSelected, isHoveredTargetInside)}
              >
                
                {/* Visual indicator lines for before/after dropping */}
                {hoverTargetId === node.id && hoverRelation === 'before' && (
                  <div 
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 rounded-full animate-pulse z-30" 
                    style={{ top: '-14px' }}
                  />
                )}
                {hoverTargetId === node.id && hoverRelation === 'after' && (
                  <div 
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 rounded-full animate-pulse z-30" 
                    style={{ bottom: '-14px' }}
                  />
                )}

                {/* Node Main Row: Icon, Title, Action toggles */}
                <div className="flex items-start gap-2 h-full justify-between">
                                   <div className="flex items-center gap-1 shrink-0 h-full">
                    {node.type !== 'destination' && (
                      <div 
                        onMouseDown={(e) => handleNodeDragStart(node.id, e)}
                        className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-350 p-0.5 hover:bg-[#1a253a] rounded transition-colors self-center flex items-center justify-center h-7"
                        title="拖拽改变层级或先后顺序"
                      >
                        <GripVertical size={13} className="stroke-[2px]" />
                      </div>
                    )}
                    <div className="p-1.5 bg-[#141b2a] border border-slate-800 rounded-lg shrink-0 flex items-center justify-center">
                      {renderNodeIcon(node.type, node.transportMethod)}
                    </div>
                  </div>

                  {/* Core Node Text details */}
                  <div className="flex-1 min-w-0 pr-1 flex flex-col justify-between h-full py-0.5">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      {node.imageUrl && (
                        <img 
                          src={node.imageUrl} 
                          alt="thumb" 
                          className="w-5 h-5 rounded-md object-cover shrink-0 border border-slate-800 shadow-2xs"
                          referrerPolicy="referrer"
                        />
                      )}
                      <span className="font-bold text-slate-100 truncate block leading-tight">
                        {node.title}
                      </span>
                    </div>
                    
                    {/* Secondary tag display inside card */}
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1 font-sans">
                      {node.time && (
                        <span className="flex items-center gap-0.5 font-medium shrink-0 text-[10px] text-slate-305 bg-[#17223b] border border-slate-800 px-1.5 py-0.2 rounded">
                          <Clock size={10} />
                          {node.time}
                        </span>
                      )}

                      {node.cost !== undefined && node.cost > 0 && (
                        <span className="flex items-center text-teal-400 font-bold shrink-0">
                          ¥{node.cost}
                        </span>
                      )}

                      {node.spotRating && (
                        <span className="text-amber-400 font-bold shrink-0 flex items-center">
                          ★{node.spotRating}
                        </span>
                      )}

                      {node.duration && (
                        <span className="text-slate-400 truncate shrink-0">
                          ⏱ {node.duration}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Operational utility buttons inside card */}
                  <div className="flex flex-col items-center justify-between h-full ml-1 shrink-0 bg-[#161f36] hover:bg-[#1a2542] p-1 rounded-md border border-slate-800 gap-1.5">
                    
                    {/* 1. Add Child Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddChild(node);
                      }}
                      className="text-slate-400 hover:text-emerald-400 transition-colors p-0.5 hover:bg-[#1a2542] rounded"
                      title="在此节点下添加节点"
                    >
                      <Plus size={12} className="stroke-[2.5px]" />
                    </button>

                    {/* 2. Edit Node Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditNode(node);
                      }}
                      className="text-slate-400 hover:text-emerald-400 transition-colors p-0.5 hover:bg-[#1a2542] rounded"
                      title="编辑该节点"
                    >
                      <Edit3 size={11} className="stroke-[2px]" />
                    </button>

                    {/* 3. Direct Delete (unless it is the main destination folder) */}
                    {node.type !== 'destination' ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteNode(node.id);
                        }}
                        className="text-slate-500 hover:text-rose-500 transition-colors p-0.5 hover:bg-[#1a2542] rounded"
                        title="删除该节点及子树"
                      >
                        <Trash2 size={11} />
                      </button>
                    ) : (
                      <div className="w-4 h-4" /> // Placeholder so flex-col spacing aligns cleanly
                    )}

                  </div>

                </div>

                {/* Sub-tree Collapsible Expansion button underneath/next to parent info */}
                {hasChildren && (
                  <button
                    type="button"
                    onClick={(e) => toggleExpand(node.id, e)}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 w-5.5 h-5.5 rounded-full bg-[#131b2e] border border-slate-800 hover:border-emerald-500 text-slate-300 hover:text-emerald-400 shadow-md flex items-center justify-center select-none z-10 font-bold transform transition-all hover:scale-105"
                  >
                    {isExpanded ? (
                      <ChevronDown size={12} className="stroke-[2.5px]" />
                    ) : (
                      <ChevronRight size={12} className="stroke-[2.5px]" />
                    )}
                  </button>
                )}

              </div>
            );
          })}

          {/* Active Drag-and-Drop Floating Ghost/Preview Node */}
          {draggedNodeId && (
            <div
              style={{
                left: `${dragCurrentPos.x}px`,
                top: `${dragCurrentPos.y}px`,
                width: `${CARD_WIDTH}px`,
                height: `${CARD_HEIGHT}px`,
                pointerEvents: 'none',
                zIndex: 9999,
              }}
              className={
                getNodeStyles(nodes.find(n => n.node.id === draggedNodeId)!.node.type, false) + 
                " shadow-2xl ring-2 ring-emerald-500 bg-[#0f1425]/95 backdrop-blur-md !opacity-95 scale-[1.03] border border-slate-750"
              }
            >
              <div className="flex items-start gap-2 h-full justify-between">
                <div className="flex items-center gap-1 shrink-0 h-full">
                  <div className="text-slate-400 p-0.5">
                    <GripVertical size={13} />
                  </div>
                  <div className="p-1.5 bg-[#141b2a] rounded-lg shrink-0 flex items-center justify-center border border-slate-800">
                    {renderNodeIcon(
                      nodes.find(n => n.node.id === draggedNodeId)!.node.type,
                      nodes.find(n => n.node.id === draggedNodeId)!.node.transportMethod
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0 pr-1 flex flex-col justify-between h-full py-0.5 pointer-events-none">
                  <span className="font-bold text-slate-100 truncate block leading-tight">
                    {nodes.find(n => n.node.id === draggedNodeId)!.node.title}
                  </span>
                  <div className="text-[9px] text-emerald-400 font-bold">
                    {hoverTargetId ? `移至 [${nodes.find(n => n.node.id === hoverTargetId)?.node.title}] 附近` : '拖拽中...'}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
export {};
