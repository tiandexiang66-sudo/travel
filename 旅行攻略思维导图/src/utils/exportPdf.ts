import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Itinerary, TravelNode } from '../types';

/**
 * Helper to build custom styling tree-outline layout for Page 2
 */
function buildTreeOutlineHTML(itinerary: Itinerary): string {
  const rootNode = itinerary.rootNode;
  let html = `
    <div style="font-family: inherit; display: flex; flex-direction: column; gap: 20px;">
      <!-- Main Destination node badge -->
      <div style="display: flex; align-items: center; gap: 14px; background: #f8fafc; border: 1.5px solid #cbd5e1; padding: 14px 20px; border-radius: 16px;">
        <span style="font-size: 22px;">📍</span>
        <div>
          <span style="font-size: 10px; font-weight: 800; color: #4338ca; text-transform: uppercase; display: block; letter-spacing: 1.5px; margin-bottom: 2px;">旅行主线路导航</span>
          <span style="font-size: 15px; font-weight: 900; color: #0f172a;">${rootNode.title}</span>
        </div>
      </div>
  `;

  const dayNodes = rootNode.children || [];
  if (dayNodes.length > 0) {
    html += `<div style="margin-left: 20px; border-left: 1.5px dashed #cbd5e1; padding-left: 25px; display: flex; flex-direction: column; gap: 24px; position: relative;">`;

    dayNodes.forEach((day, idx) => {
      html += `
        <div style="position: relative;">
          <!-- Left connector bullet -->
          <div style="position: absolute; left: -31px; top: 12px; width: 10px; height: 10px; background: #10b981; border: 2.5px solid #ffffff; border-radius: 50%; box-shadow: 0 0 0 2px #d1fae5;"></div>
          
          <!-- Day Row card -->
          <div style="background: rgba(16, 185, 129, 0.04); border: 1.5px solid #a7f3d0; padding: 10px 16px; border-radius: 12px; display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 14px;">📅</span>
              <span style="font-size: 12.5px; font-weight: 850; color: #065f46;">${day.title}</span>
            </div>
            ${day.time ? `<span style="font-size: 9.5px; font-weight: bold; background: #dcfce7; color: #166534; padding: 2px 7px; border-radius: 6px;">${day.time}</span>` : ''}
          </div>
      `;

      const subItems = day.children || [];
      if (subItems.length > 0) {
        html += `<div style="margin-left: 12px; margin-top: 10px; display: flex; flex-direction: column; gap: 8px;">`;
        subItems.forEach((sub) => {
          let badgeColor = '#f1f5f9';
          let borderStyle = '1px solid #e2e8f0';
          let textColor = '#475569';
          let symbol = '🎯';

          if (sub.type === 'activity') {
            badgeColor = '#f0f9ff';
            borderStyle = '1.5px solid #bae6fd';
            textColor = '#0369a1';
            symbol = '📸';
          } else if (sub.type === 'lodging') {
            badgeColor = '#eef2ff';
            borderStyle = '1.5px solid #c7d2fe';
            textColor = '#4338ca';
            symbol = '🏨';
          } else if (sub.type === 'dining') {
            badgeColor = '#fffbeb';
            borderStyle = '1.5px solid #fde68a';
            textColor = '#b45309';
            symbol = '🍴';
          } else if (sub.type === 'transport') {
            badgeColor = '#fafafa';
            borderStyle = '1.5px solid #e4e4e7';
            textColor = '#52525b';
            symbol = '🚇';
          } else if (sub.type === 'tip') {
            badgeColor = '#fff5f5';
            borderStyle = '1.5px solid #fecaca';
            textColor = '#c53030';
            symbol = '💡';
          }

          html += `
            <div style="display: flex; align-items: center; justify-content: space-between; background: #ffffff; border: ${borderStyle}; padding: 7px 14px; border-radius: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.01);">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 11px;">${symbol}</span>
                <span style="font-size: 11px; font-weight: 700; color: #1e293b;">${sub.title}</span>
                ${sub.time ? `<span style="font-size: 8.5px; font-weight: bold; padding: 1px 5px; background: ${badgeColor}; color: ${textColor}; border-radius: 4px; margin-left: 4px;">${sub.time}</span>` : ''}
              </div>
              ${sub.cost ? `<span style="font-size: 10px; font-weight: 800; color: #475569; font-family: monospace;">¥${sub.cost}</span>` : ''}
            </div>
          `;
        });
        html += `</div>`;
      }

      html += `</div>`;
    });

    html += `</div>`;
  } else {
    html += `
      <div style="text-align: center; padding: 40px; border: 1.5px dashed #cbd5e1; border-radius: 16px; color: #94a3b8; font-size: 11px;">
        目前日程为空，开始添加天数脉络吧
      </div>
    `;
  }

  html += `</div>`;
  return html;
}

/**
 * Custom renderer for single items inside timeline cards
 */
function renderTimelineItemHTML(itm: TravelNode): string {
  let accentColor = '#64748b';
  let symbol = '▫️';
  let titleBadge = '';

  if (itm.type === 'activity') {
    accentColor = '#3b82f6';
    symbol = '📸 景点打卡名胜';
  } else if (itm.type === 'lodging') {
    accentColor = '#6366f1';
    symbol = '🏨 舒适住宿酒店';
  } else if (itm.type === 'dining') {
    accentColor = '#f59e0b';
    symbol = '🍛 美食品尝珍馆';
  } else if (itm.type === 'transport') {
    accentColor = '#94a3b8';
    symbol = '🚇 出行交通连线';
  } else if (itm.type === 'tip') {
    accentColor = '#ec4899';
    symbol = '💡 避坑旅行贴士';
  }

  // Cost component
  const costSpan = itm.cost ? `<span style="font-size: 10.5px; font-weight: 800; color: #475569; font-family: monospace; border: 1px solid #e2e8f0; border-radius: 6px; padding: 2px 6px; background: #f8fafc;">¥${itm.cost} 人均</span>` : '';

  // Timing block
  const isTransport = itm.type === 'transport';
  const metaDetail = itm.duration || itm.time || '';
  const metaBadge = metaDetail ? `<span style="font-size: 9px; font-weight: bold; background: #f1f5f9; color: #475569; padding: 2px 6px; border-radius: 6px; border: 1px solid #e2e8f0;">${metaDetail}</span>` : '';

  // Rating stars
  const starsRate = itm.type === 'activity' && itm.spotRating ? `
    <span style="color: #fbbf24; font-size: 10px; margin-left: 6px;">
      ${'★'.repeat(itm.spotRating)}${'☆'.repeat(5 - itm.spotRating)}
    </span>
  ` : '';

  // Sub Tips checklist style
  const tipsBlock = itm.tips && itm.tips.length > 0 ? `
    <div style="background-color: #f8fafc; border-left: 2.5px solid ${accentColor}; border-radius: 8px; padding: 10px 14px; margin-top: 8px; font-size: 9.5px; color: #475569; display: flex; flex-direction: column; gap: 4px;">
      ${itm.tips.map(t => `<div style="display: flex; gap: 6px; line-height: 1.4;"><span>•</span><span>💡 ${t}</span></div>`).join('')}
    </div>
  ` : '';

  // Extra details like transport tool
  const extraTool = itm.type === 'transport' && itm.transportMethod ? `
    <span style="font-size: 9px; font-weight: bold; color: #4b5563; background: #e4e4e7; border: 1px solid #d4d4d8; padding: 1px 5px; border-radius: 4px; text-transform: uppercase;">
      ${itm.transportMethod === 'walk' ? '🚶 徒步' :
        itm.transportMethod === 'subway' ? '🚇 地铁' :
        itm.transportMethod === 'bus' ? '🚌 公交' :
        itm.transportMethod === 'taxi' ? '🚕 的士' :
        itm.transportMethod === 'train' ? '🚄 高铁' :
        itm.transportMethod === 'flight' ? '✈️ 航班' : '🌐 交通'}
    </span>
  ` : '';

  return `
    <div style="display: flex; gap: 16px; position: relative; border-left: 2px solid ${accentColor}; padding-left: 18px; margin-left: 8px; padding-bottom: 4px;">
      <!-- Bullet marker -->
      <div style="position: absolute; left: -6px; top: 3px; width: 10px; height: 10px; background: ${accentColor}; border: 2.5px solid #ffffff; border-radius: 50%; box-shadow: 0 1px 3px rgba(0,0,0,0.1);"></div>
      
      <!-- Content Panel -->
      <div style="flex-grow: 1; min-w: 0;">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
          <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 6px;">
            <span style="font-size: 10px; font-weight: 850; text-transform: uppercase; color: ${accentColor}; letter-spacing: 0.5px;">${symbol}</span>
            <span style="font-size: 12.5px; font-weight: 900; color: #0f172a;">${itm.title}</span>
            ${metaBadge}
            ${extraTool}
            ${starsRate}
          </div>
          ${costSpan}
        </div>
        
        ${itm.description ? `<p style="font-size: 10.5px; color: #475569; margin: 6px 0 0 0; line-height: 1.6; font-family: system-ui; text-align: justify;">${itm.description}</p>` : ''}
        
        ${tipsBlock}
      </div>
    </div>
  `;
}

/**
 * Main export function to compile Itinerary data structure to beautifully pagination PDFs
 */
export async function exportItineraryToPDF(
  itinerary: Itinerary,
  setExportProgress?: (progress: number | null) => void
) {
  if (setExportProgress) setExportProgress(5);

  // 1. Create a dedicated off-screen printable DOM container
  const printContainer = document.createElement('div');
  printContainer.id = 'temp-pdf-export-container';
  printContainer.style.position = 'fixed';
  printContainer.style.left = '-9999px';
  printContainer.style.top = '0';
  printContainer.style.width = '800px';
  printContainer.style.zIndex = '-99999';
  printContainer.style.backgroundColor = '#f1f5f9';
  printContainer.style.boxSizing = 'border-box';
  document.body.appendChild(printContainer);

  const pagesHTML: string[] = [];

  // ==========================================
  // PAGE 1: COVER CARD
  // ==========================================
  const page1 = `
    <div class="pdf-page" style="width: 800px; height: 1130px; padding: 60px; background-color: #ffffff; color: #0f172a; display: flex; flex-direction: column; justify-content: space-between; position: relative; box-sizing: border-box; font-family: system-ui, -apple-system, sans-serif;">
      <!-- Elegant gradient top rail -->
      <div style="height: 6px; width: 100%; background: linear-gradient(to right, #4338ca, #0d9488, #b45309); position: absolute; top: 0; left: 0;"></div>
      
      <!-- Content Body -->
      <div style="display: flex; flex-direction: column; gap: 36px; margin-top: 40px;">
        
        <!-- Document Category Header -->
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 10px; font-weight: 850; text-transform: uppercase; color: #4338ca; letter-spacing: 2px;">AI Custom High-Fidelity Travel Manual</span>
          <span style="height: 1px; flex-grow: 1; background-color: #ecc94b; background: linear-gradient(to right, #cbd5e1, transparent);"></span>
        </div>

        <!-- Majestic Title -->
        <div style="border-left: 4px solid #4338ca; padding-left: 20px;">
          <h1 style="font-size: 32px; font-weight: 950; color: #0f172a; line-height: 1.3; tracking: -0.02em; margin: 0 0 12px 0;">
            ${itinerary.title}
          </h1>
          <p style="font-size: 13.5px; line-height: 1.6; color: #475569; margin: 0 0 8px 0; font-style: italic; font-weight: 500;">
            “ ${itinerary.description} ”
          </p>
        </div>

        <!-- Cover visual picture frame -->
        <div style="width: 100%; height: 380px; rounded: 20px; overflow: hidden; border: 1.5px solid #e2e8f0; border-radius: 20px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.04); position: relative; background: #f8fafc;">
          ${itinerary.coverImage ? `
            <img src="${itinerary.coverImage}" style="width: 100%; height: 100%; object-fit: cover; display: block;" referrerPolicy="no-referrer" crossOrigin="anonymous" />
          ` : `
            <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #e0e7ff, #f3e8ff); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;">
              <span style="font-size: 64px;">🗺️</span>
              <span style="color: #6366f1; font-weight: 800; font-size: 16px;">智能全景旅行指南</span>
            </div>
          `}
        </div>

        <!-- Visual specs stats grid -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 10px;">
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 18px 10px; border-radius: 16px; text-align: center;">
            <span style="display: block; font-size: 9px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">行程天数</span>
            <span style="font-size: 18px; font-weight: 900; color: #0d9488;">${itinerary.totalDays} 天</span>
          </div>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 18px 10px; border-radius: 16px; text-align: center;">
            <span style="display: block; font-size: 9px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">旅行时间 / 建议</span>
            <span style="font-size: 18px; font-weight: 950; color: #4338ca;">${itinerary.season}</span>
          </div>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 18px 10px; border-radius: 16px; text-align: center;">
            <span style="display: block; font-size: 9px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">消费水平预算</span>
            <span style="font-size: 18px; font-weight: 950; color: #b45309;">${itinerary.budgetCategory}</span>
          </div>
        </div>

      </div>

      <!-- Footnote meta footer -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1.5px solid #f1f5f9; padding-top: 20px; font-size: 10.5px; color: #94a3b8; font-weight: 600;">
        <span>下载创建日期: ${new Date().toLocaleDateString('zh-CN')}</span>
        <span>智能导游手札 • 旅行离线全手册</span>
        <span>Page 1</span>
      </div>
    </div>
  `;
  pagesHTML.push(page1);

  // ==========================================
  // PAGE 2: MINDMAP HIERARCHY TREE
  // ==========================================
  const page2 = `
    <div class="pdf-page" style="width: 800px; height: 1130px; padding: 60px; background-color: #ffffff; color: #0f172a; display: flex; flex-direction: column; justify-content: space-between; position: relative; box-sizing: border-box; font-family: system-ui, -apple-system, sans-serif;">
      <div style="height: 6px; width: 100%; background: linear-gradient(to right, #4338ca, #0d9488, #b45309); position: absolute; top: 0; left: 0;"></div>
      
      <div style="display: flex; flex-direction: column; gap: 24px; margin-top: 30px; flex-grow: 1;">
        
        <!-- Page Title Row -->
        <div style="display: flex; align-items: center; gap: 10px; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px;">
          <span style="font-size: 22px;">📊</span>
          <h2 style="font-size: 16.5px; font-weight: 950; color: #0f172a; margin: 0; tracking: -0.01em;">脉络大脑：行程脑图节点总览图谱</h2>
        </div>

        <!-- Render visual tree components representation -->
        <div style="margin-top: 10px; overflow: hidden; background: #fafafa; border: 1px solid #f1f5f9; border-radius: 20px; padding: 25px 30px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.01)">
          ${buildTreeOutlineHTML(itinerary)}
        </div>

      </div>

      <!-- Footer navigation -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1.5px solid #f1f5f9; padding-top: 20px; font-size: 10.5px; color: #94a3b8; font-weight: 600; margin-top: 10px;">
        <span>架构脉络总览</span>
        <span>智能导游手札 • 行程伴侣</span>
        <span>Page 2</span>
      </div>
    </div>
  `;
  pagesHTML.push(page2);

  // ==========================================
  // PAGES 3+: CHUNKED DAILY TIMELINES
  // ==========================================
  const dayNodes = itinerary.rootNode.children || [];
  const dayChunks: TravelNode[][] = [];
  const DAYS_PER_PAGE = 2; // Chunking 2 days into exactly one page ensures perfect sizing

  for (let i = 0; i < dayNodes.length; i += DAYS_PER_PAGE) {
    dayChunks.push(dayNodes.slice(i, i + DAYS_PER_PAGE));
  }

  dayChunks.forEach((chunk, chunkIdx) => {
    const pageNum = chunkIdx + 3;
    
    // Convert chunk items to HTML
    const chunkDetailsHTML = chunk.map(day => {
      const planItems = day.children || [];
      const planItemRenderings = planItems.length > 0 
        ? planItems.map(itm => renderTimelineItemHTML(itm)).join(`<div style="height: 12px;"></div>`)
        : `<p style="font-size: 11px; color:#cbd5e1; font-style:italic; padding-left: 20px; margin: 0;">当日暂无具体的观光、餐饮、入住或行车规划节点</p>`;

      return `
        <!-- Single day card block -->
        <div style="background: rgba(248, 250, 252, 0.4); border: 1.5px solid #f1f5f9; padding: 22px 26px; border-radius: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.01); display: flex; flex-direction: column; gap: 14px;">
          
          <!-- Day Row Header -->
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #f1f5f9; padding-bottom: 11px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 18px;">📆</span>
              <span style="font-size: 14px; font-weight: 900; color: #1e1b4b;">${day.title}</span>
            </div>
            ${day.time ? `<span style="font-size: 9px; font-weight: 800; background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 6px;">${day.time}</span>` : ''}
          </div>

          <!-- Day Description snippet -->
          ${day.description ? `
            <p style="font-size: 10.5px; color: #64748b; margin: -4px 0 2px 0; line-height: 1.5; font-family: system-ui; text-align: justify; font-style: italic;">
              “ ${day.description} ”
            </p>
          ` : ''}

          <!-- Items Timeline stream -->
          <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 4px;">
            ${planItemRenderings}
          </div>

        </div>
      `;
    }).join(`<div style="height: 25px;"></div>`);

    const pageDaily = `
      <div class="pdf-page" style="width: 800px; height: 1130px; padding: 60px; background-color: #ffffff; color: #0f172a; display: flex; flex-direction: column; justify-content: space-between; position: relative; box-sizing: border-box; font-family: system-ui, -apple-system, sans-serif;">
        <div style="height: 6px; width: 100%; background: linear-gradient(to right, #4338ca, #0d9488, #b45309); position: absolute; top: 0; left: 0;"></div>
        
        <div style="display: flex; flex-direction: column; gap: 20px; margin-top: 30px; flex-grow: 1;">
          
          <!-- Section Heading -->
          <div style="display: flex; align-items: center; gap: 10px; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; margin-bottom: 6px;">
            <span style="font-size: 22px;">🕒</span>
            <h2 style="font-size: 16.5px; font-weight: 950; color: #0f172a; margin: 0; tracking: -0.01em;">时光安排清单：每日路线明细指南（Page ${chunkIdx + 1}）</h2>
          </div>

          <!-- Chronology List rendering cards -->
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${chunkDetailsHTML}
          </div>

        </div>

        <!-- Page footer navigator -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1.5px solid #f1f5f9; padding-top: 18px; font-size: 10.5px; color: #94a3b8; font-weight: 600; margin-top: 15px;">
          <span>行程日程精细拆解</span>
          <span>详细旅游日历指南 • 离线常备</span>
          <span>Page ${pageNum}</span>
        </div>
      </div>
    `;
    pagesHTML.push(pageDaily);
  });

  // ==========================================
  // FINAL PAGE: PACKING & SPECIAL TIPS BLOCK
  // ==========================================
  const lastPageNum = pagesHTML.length + 1;
  const pageFinal = `
    <div class="pdf-page" style="width: 800px; height: 1130px; padding: 60px; background-color: #ffffff; color: #0f172a; display: flex; flex-direction: column; justify-content: space-between; position: relative; box-sizing: border-box; font-family: system-ui, -apple-system, sans-serif;">
      <div style="height: 6px; width: 100%; background: linear-gradient(to right, #4338ca, #0d9488, #b45309); position: absolute; top: 0; left: 0;"></div>
      
      <div style="display: flex; flex-direction: column; gap: 30px; margin-top: 30px; flex-grow: 1;">
        
        <!-- Main box title -->
        <div style="display: flex; align-items: center; gap: 10px; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px;">
          <span style="font-size: 22px;">🎒</span>
          <h2 style="font-size: 16.5px; font-weight: 950; color: #0f172a; margin: 0; tracking: -0.01em;">行李准备 & 核心避坑注意事项总汇</h2>
        </div>

        <!-- Two columns for Packing categories -->
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
          ${itinerary.packingList && itinerary.packingList.length > 0 ? itinerary.packingList.map(cat => `
            <div style="background: rgba(248, 250, 252, 0.4); border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.015);">
              <span style="font-size: 11.5px; font-weight: 900; color: #4338ca; text-transform: uppercase; display: block; margin-bottom: 12px; letter-spacing: 0.5px; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 5px;">🎒 ${cat.name}</span>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                ${cat.items && cat.items.length > 0 ? cat.items.map(item => `
                  <div style="display: flex; align-items: center; gap: 8px; font-size: 10.5px; color: #334155;">
                    <span style="font-size: 13px; color: ${item.checked ? '#10b981' : '#94a3b8'}; font-weight: bold; line-height: 1;">
                      ${item.checked ? '☑' : '☐'}
                    </span>
                    <span style="text-decoration: ${item.checked ? 'line-through' : 'none'}; color: ${item.checked ? '#94a3b8' : '#334155'}; font-weight: 500;">
                      ${item.name}
                    </span>
                  </div>
                `).join('') : '<p style="font-size: 9.5px; color: #94a3b8; font-style: italic; margin: 0;">暂无本类别行李需要整理</p>'}
              </div>
            </div>
          `).join('') : `
            <div style="grid-column: span 2; text-align: center; padding: 40px; border: 1.5px dashed #cbd5e1; border-radius: 16px; color: #94a3b8; font-size: 11px;">
              暂无自定义打包清单。出行前记得多带必备证件、换洗衣物和数码设备哦！
            </div>
          `}
        </div>

        <!-- Master Destination safety tips summary if exists -->
        ${itinerary.rootNode.tips && itinerary.rootNode.tips.length > 0 ? `
          <div style="margin-top: 10px;">
            <div style="display: flex; align-items: center; gap: 10px; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; margin-bottom: 12px;">
              <span style="font-size: 18px;">⚠️</span>
              <h3 style="font-size: 13.5px; font-weight: bold; color: #0f172a; margin: 0; tracking: -0.01em;">智能旅途核心安全及避坑温馨指南</h3>
            </div>
            <div style="background: #faf5ff; border: 1.5px solid #e9d5ff; border-radius: 16px; padding: 22px; display: flex; flex-direction: column; gap: 10px; font-size: 11px;" class="text-purple-950">
              ${itinerary.rootNode.tips.map(t => `
                <div style="display: flex; gap: 8px; line-height: 1.6;">
                  <span style="color: #8b5cf6; font-weight: bold;">•</span>
                  <span style="color: #581c87; font-weight: 500;">💡 ${t}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

      </div>

      <!-- General final footer note -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1.5px solid #f1f5f9; padding-top: 20px; font-size: 10.5px; color: #94a3b8; font-weight: 600;">
        <span>离线守护清单</span>
        <span>智能导游手札 • 打包不落单</span>
        <span>Page ${lastPageNum}</span>
      </div>
    </div>
  `;
  pagesHTML.push(pageFinal);

  // ==========================================
  // CONVERT PAGES TO MULTI-PAGE PDF IN jsPDF
  // ==========================================
  try {
    // A4 specs at 72dpi: width=595.28 pt, height=841.89 pt
    // Let's configure jsPDF with these precise bounds
    const pdf = new jsPDF('p', 'pt', 'a4', true);
    
    // Total pages count for incremental loops
    const totalPages = pagesHTML.length;

    for (let i = 0; i < totalPages; i++) {
      if (setExportProgress) {
        // Linearly distribute progress between 10% and 95%
        const progressVal = Math.round(10 + (i / totalPages) * 85);
        setExportProgress(progressVal);
      }

      // Create a temporary element wrapper for html2canvas
      const pageSelector = document.createElement('div');
      pageSelector.style.width = '800px';
      pageSelector.style.height = '1130px';
      pageSelector.style.boxSizing = 'border-box';
      pageSelector.style.backgroundColor = '#ffffff';
      pageSelector.innerHTML = pagesHTML[i];
      
      printContainer.appendChild(pageSelector);

      // Render actual wrapper container to Canvas
      const canvas = await html2canvas(pageSelector, {
        scale: 2, // High resolution crisp exports
        useCORS: true, 
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false
      });

      // Clear layout container to free memory and prevent accumulation
      printContainer.removeChild(pageSelector);

      // Convert Canvas to premium JPEG standard bounds
      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      if (i > 0) {
        // Add new page for non-first rows
        pdf.addPage();
      }

      // Stretch exact image on canvas to standard A4 coordinates
      // Width: 595.28 pt, Height: 841.89 pt
      pdf.addImage(imgData, 'JPEG', 0, 0, 595.28, 841.89, `page_${i}`, 'FAST');
    }

    if (setExportProgress) setExportProgress(98);

    // Trigger save download stream
    const rawFileName = itinerary.title.replace(/[\\/*?:"<>| ]/g, '_');
    pdf.save(`AI_Smart_Guide_${rawFileName}.pdf`);

  } catch (err) {
    console.error('Error generating PDF handbook:', err);
    alert('导出PDF失败，请尝试刷新页面重试。');
  } finally {
    // 4. Garbage collection clean temp print elements
    if (printContainer && printContainer.parentNode) {
      printContainer.parentNode.removeChild(printContainer);
    }
    if (setExportProgress) setExportProgress(null);
  }
}
