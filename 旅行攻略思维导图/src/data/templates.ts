import { Itinerary, PackingCategory } from '../types';

export const DEFAULT_PACKING_LISTS: { [key: string]: PackingCategory[] } = {
  standard: [
    {
      id: 'pack-1',
      name: '必备证件 & 资金',
      items: [
        { id: 'p1-1', name: '身份证 / 护照', checked: true },
        { id: 'p1-2', name: '预订确认单（酒店/门票）', checked: true },
        { id: 'p1-3', name: '少量现金 / 信用卡', checked: false },
        { id: 'p1-4', name: '学生证/特惠证件', checked: false },
      ]
    },
    {
      id: 'pack-2',
      name: '电子数码',
      items: [
        { id: 'p2-1', name: '智能手机 & 充电线', checked: true },
        { id: 'p2-2', name: '移动电源 (充电宝)', checked: true },
        { id: 'p2-3', name: '相机 / 云台 (可选)', checked: false },
        { id: 'p2-4', name: '耳机 / 降噪耳机', checked: false },
      ]
    },
    {
      id: 'pack-3',
      name: '个人洗护 & 常用药',
      items: [
        { id: 'p3-1', name: '洗漱用品小样', checked: false },
        { id: 'p3-2', name: '防晒霜 (SPF50+)', checked: true },
        { id: 'p3-3', name: '常用常备药 (感冒/晕车/创可贴)', checked: true },
        { id: 'p3-4', name: '湿纸巾 / 便携纸巾', checked: true },
      ]
    }
  ],
  island: [
    {
      id: 'island-1',
      name: '海岛特需',
      items: [
        { id: 'i1-1', name: '泳衣 / 比基尼', checked: true },
        { id: 'i1-2', name: '防水袋 (手机套)', checked: true },
        { id: 'i1-3', name: '太阳镜 (偏光眼镜)', checked: true },
        { id: 'i1-4', name: '沙滩拖鞋 / 沙滩帽', checked: false },
        { id: 'i1-5', name: '驱蚊喷雾', checked: true },
      ]
    }
  ],
  winter: [
    {
      id: 'winter-1',
      name: '保暖装备',
      items: [
        { id: 'w1-1', name: '羽绒服 (防风防水)', checked: true },
        { id: 'w1-2', name: '保暖内衣 / 抓绒衣', checked: true },
        { id: 'w1-3', name: '触屏加厚手套', checked: true },
        { id: 'w1-4', name: '保暖毛线帽 / 围巾', checked: true },
        { id: 'w1-5', name: '暖宝宝加热贴', checked: false },
        { id: 'w1-6', name: '保湿面霜 / 润唇膏', checked: true },
      ]
    }
  ]
};

export const PRESET_ITINERARIES: Itinerary[] = [
  {
    id: 'beijing-classic',
    title: '北京古都人文与现代时尚五日游',
    description: '穿梭在红墙黄瓦与摩天大楼之间，体验悠久帝都人文底蕴与新潮艺术街区的奇妙交融。',
    coverImage: 'https://images.unsplash.com/photo-1547984609-e85654867402?auto=format&fit=crop&w=1200&q=80', // Beautiful Palace Museum photo
    budgetCategory: '品质舒适',
    season: '秋季 / 9月-11月',
    totalDays: 5,
    packingList: [
      ...DEFAULT_PACKING_LISTS.standard
    ],
    rootNode: {
      id: 'bj-root',
      type: 'destination',
      title: '北京5日探索深度游',
      description: '贯穿历史中轴线，从紫禁城走到慕田峪长城，兼顾传统胡同胡同烟火与现代先锋艺术美学。',
      cost: 3800,
      tips: [
        '北京景点（如故宫、国博等）务必提前7天预约门票！故宫下午闭馆较早，注意节奏。',
        '最佳旅游季节为秋分前后，秋高气爽，银杏渐黄，红叶如画。',
        '建议全程使用地铁出行，北京上下班高峰路面路况极易拥堵。'
      ],
      children: [
        {
          id: 'bj-d1',
          type: 'day',
          title: 'Day 1: 皇城中轴线与胡同古韵',
          time: '历史沉淀',
          description: '围绕清晨广场旗帜，探秘世界最大的木结构宫殿群紫禁城，登高眺望城廓全景，随后步入胡同寻觅老北京烟火。',
          cost: 180,
          children: [
            {
              id: 'bj-d1-a1',
              type: 'lodging',
              title: '前门古韵精品四合院酒店',
              time: '08:30',
              description: '入住前门胡同里的新中式院落酒店，步行即可抵达天安门广场，闹中取静。',
              cost: 650,
              tips: ['可提前联络酒店寄存行李，首日直接无负重出行。', '院落有下午茶服务，露台能眺望大前门。']
            },
            {
              id: 'bj-d1-a2',
              type: 'activity',
              title: '天安门广场 & 故宫博物院',
              time: '09:00 - 13:30',
              duration: '4.5小时',
              spotRating: 5,
              description: '故宫是明清两代皇家深宫，沿中轴线从午门入，参观太和殿、乾清宫、直到御花园，建议进入两翼的“珍宝馆”和“钟表馆”一览奇珍。',
              cost: 60,
              tips: [
                '租用讲解耳麦或提前请讲解员，能听懂背后的历史典故才更过瘾。',
                '乾清门东侧的长廊是经典的红墙拍摄机位，光影下午极佳。'
              ]
            },
            {
              id: 'bj-d1-t1',
              type: 'transport',
              title: '步行前往景山',
              time: '13:30',
              transportMethod: 'walk',
              description: '故宫北门（神武门）出，对面即是景山公园南门，步行约3分钟。'
            },
            {
              id: 'bj-d1-a3',
              type: 'activity',
              title: '景山公园万春亭',
              time: '13:40 - 14:45',
              duration: '1小时',
              spotRating: 4,
              description: '登上北京中轴线上的制高点“万春亭”，能360度俯瞰整座紫禁城壮丽的金色屋顶和北京全貌，十分震撼。',
              cost: 2,
              tips: ['晴天傍晚这能看到绝美的紫禁城落日余晖。']
            },
            {
              id: 'bj-d1-a4',
              type: 'dining',
              title: '四季民福烤鸭店 (沙滩店/东华门店)',
              time: '15:30 - 17:30',
              description: '登上观景位可眺望故宫角楼，主打北京正宗挂炉烤鸭。烤鸭酥脆丰润，配上空心烧饼绝。',
              cost: 160,
              tips: ['属于超级热门店，建议去景山前就在手机上取号排队，否则排队可能超过2小时。']
            },
            {
              id: 'bj-d1-a5',
              type: 'activity',
              title: '南锣鼓巷与什刹海胡同漫游',
              time: '18:00 - 21:00',
              duration: '3小时',
              spotRating: 4,
              description: '夜幕降临，漫游最具北京特色的小巷，从烟袋斜街走过银锭桥，在什刹海湖畔聆听民谣酒吧的小调，享受微风。',
              cost: 0,
              tips: ['可以租一辆共享单车沿后海湖边慢骑，晚风十分惬意。']
            }
          ]
        },
        {
          id: 'bj-d2',
          type: 'day',
          title: 'Day 2: 巍峨万里长城与奥运之光',
          time: '居高临下',
          description: '离开闹市，前往群山之中游览长城之最，下午重返市区体验双奥之城的科技魅力。',
          cost: 280,
          children: [
            {
              id: 'bj-d2-t1',
              type: 'transport',
              title: '乘豪华大巴专线前往慕田峪',
              time: '07:30 - 09:00',
              transportMethod: 'bus',
              description: '前门或港澳中心搭乘“赞巴士”等专线直达，单程约1.5h，免去多次换乘烦恼。',
              cost: 80
            },
            {
              id: 'bj-d2-a1',
              type: 'activity',
              title: '慕田峪长城风景区',
              time: '09:00 - 13:30',
              duration: '4.5小时',
              spotRating: 5,
              description: '以绿植繁茂和敌楼连绵享誉中外。游览慕田峪推荐经典玩法：乘缆车直达14号敌楼，向西步行观赏精华段，在6号敌楼乘坐极其刺激的托贝根皮滑道（Toboggan）滑下山。',
              cost: 140,
              tips: [
                '长城上没有太多小卖部，建议包中备好巧克力、香蕉和矿充饥。',
                '14号到20号敌楼人少景色开阔，是拍照的最佳路线。'
              ]
            },
            {
              id: 'bj-d2-t2',
              type: 'transport',
              title: '专车返回市区',
              time: '13:30 - 15:00',
              transportMethod: 'bus',
              description: '回程专线直接停靠地铁站或奥林匹克公园区域，便于后续游玩。'
            },
            {
              id: 'bj-d2-a2',
              type: 'activity',
              title: '奥林匹克公园 (鸟巢 & 水立方夜景)',
              time: '16:00 - 18:30',
              duration: '2.5小时',
              spotRating: 4,
              description: '游览08年及22年“双奥核心区”。远观巨大的钢结构巨构“鸟巢”和气泡梦幻的“水立方”，傍晚七点左右灯光亮起时最美。',
              cost: 0,
              tips: ['如想登顶鸟巢空中走廊需另购门票，建议在广场合影拍照即可。']
            }
          ]
        },
        {
          id: 'bj-d3',
          type: 'day',
          title: 'Day 3: 新锐艺术探秘与林园之幽',
          time: '先锋与皇家',
          description: '清晨领略先锋废旧工厂改造的艺术殿堂，下午移步京西，静享清代皇家行宫园林的宁静。',
          cost: 150,
          children: [
            {
              id: 'bj-d3-a1',
              type: 'activity',
              title: '798艺术区',
              time: '09:30 - 12:30',
              duration: '3小时',
              spotRating: 4,
              description: '由上世纪国营老无线电厂厂房改建而成的艺术社区，包豪斯风格锯齿形厂房内林立着各种画廊、精品买手店、露天雕塑与前沿美术馆（如UCCA尤伦斯创意大展）。',
              cost: 0,
              tips: ['艺术区内随处可见涂鸦长墙和巨型金属管道，非常适合穿搭利落的工业风拍照。']
            },
            {
              id: 'bj-d3-t1',
              type: 'transport',
              title: '乘坐地铁15号线转4号线',
              time: '12:30 - 13:30',
              transportMethod: 'subway',
              description: '望京站乘车，快速横跨市区到达北京西郊的皇家行宫区域。',
              cost: 6
            },
            {
              id: 'bj-d3-a2',
              type: 'activity',
              title: '颐和园',
              time: '13:45 - 17:30',
              duration: '3.5小时',
              spotRating: 5,
              description: '完整保留下来的清代皇家行宫花园。漫步在万寿山佛香阁和风平浪静的昆明湖畔，走过极具对称美学的长廊和连接南湖岛的十七孔桥。推荐购买联票，包含佛香阁与苏州街。',
              cost: 60,
              tips: [
                '下午三四点推荐租一个电瓶船在昆明湖泛舟，能从湖心拍摄万寿山全貌，背景配上西山晚霞绝伦。',
                '若体力有限，可选择新建宫门进，北宫门出。'
              ]
            }
          ]
        }
      ]
    }
  },
  {
    id: 'kansai-classic',
    title: '关西风物诗：京都古韵与大阪霓虹六日游',
    description: '漫步在京都静谧的红枫石板路和稻荷红色长廊，随后冲入大阪活力四射的千霓狂欢与美食街。',
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80', // Beautiful Kyoto temple photo
    budgetCategory: '豪华享受',
    season: '四季皆宜 / 推荐春樱秋枫',
    totalDays: 6,
    packingList: [
      ...DEFAULT_PACKING_LISTS.standard
    ],
    rootNode: {
      id: 'ks-root',
      type: 'destination',
      title: '日本京都+大阪+奈良6日游',
      description: '由繁至简再至繁，串联清水古韵、宇治香茗、奈良群鹿和心斋桥动人都会烟火。',
      cost: 7200,
      tips: [
        '关西交通复杂，推荐根据行程购买关西周游卡 (KTP) 或 ICOCA 交通卡。',
        '清水寺二年坂和三年坂多石阶坡道，建议穿一双非常舒适的步行跑鞋。',
        '京都极多米其林老店需提前数周进行线上预约。'
      ],
      children: [
        {
          id: 'ks-d1',
          type: 'day',
          title: 'Day 1: 降落关空与古都入眠',
          time: '起航关西',
          description: '飞越东海抵达关西国际机场，乘坐特急电车直穿平原，入住日式韵味深厚的京都酒店。',
          cost: 140,
          children: [
            {
              id: 'ks-d1-t1',
              type: 'transport',
              title: '关西机场 Haruka 特快直达京都',
              time: '14:00 - 15:20',
              transportMethod: 'train',
              description: '从机场坐HARUKA号电车，特急只需80分钟即可到达京都站，省时且能看窗外田野景色。',
              cost: 110
            },
            {
              id: 'ks-d1-a1',
              type: 'lodging',
              title: '京都三条皇家花园浪漫酒店',
              time: '16:00',
              description: '坐落于京都中京区，临近鸭川。酒店融合了传统町屋格栅设计与现代大宅豪华舒适。',
              cost: 1100,
              tips: ['公共浴场可以泡汤，消解旅途飞行奔波的疲惫。']
            },
            {
              id: 'ks-d1-a2',
              type: 'dining',
              title: '鸭川旁先斗町 · 日式和牛寿喜烧',
              time: '18:30 - 20:30',
              description: '在鸭川西侧的百年先斗町步行，享用正宗关西风寿喜烧。精选A4黑毛和牛肉质鲜嫩多汁，沾裹新鲜蛋液滑嫩无比。',
              cost: 450,
              tips: ['临河一侧如果在夏季会有“纳凉床”露天空位，极富季节风情，最好网络预约。']
            }
          ]
        },
        {
          id: 'ks-d2',
          type: 'day',
          title: 'Day 2: 清水寺古街漫游与衹园寻影',
          time: '古都风情',
          description: '穿上传统和服，踏步在千年石板小路，倾听木屐与碎石的碰撞，仿佛掉入时光缝隙。',
          cost: 260,
          children: [
            {
              id: 'ks-d2-a1',
              type: 'activity',
              title: '清水寺 & 二年坂三年坂和服漫游',
              time: '09:00 - 13:00',
              duration: '4小时',
              spotRating: 5,
              description: '清水寺是京都最古老寺院，其“悬空清水舞台”未用一根铁钉，奇迹般立于悬崖上。出寺院沿着二年坂、三年坂拾级而下，两侧尽是百年风韵的木质町屋与老字号纪念品铺子。',
              cost: 150,
              tips: [
                '早上9点前人流较少，最适合租一套精美和服拍摄唯美古风的大片。',
                '记得拜访路上的“八坂之塔”，这也是京都最具代表性的明信片背景之一。'
              ]
            },
            {
              id: 'ks-d2-a2',
              type: 'dining',
              title: '京都汤豆腐·顺正 (清水店)',
              time: '13:00 - 14:30',
              description: '京都著名的素食料理。将手作滑嫩豆腐放入昆布汤底温煮，沾酱油葱花，配上精致的天妇罗与茶碗蒸。非常纯净温润。',
              cost: 220
            },
            {
              id: 'ks-d2-a3',
              type: 'activity',
              title: '建仁寺 & 花见小路傍晚漫步',
              time: '15:30 - 18:00',
              duration: '2.5小时',
              spotRating: 4,
              description: '探寻京都标志性的花名册地。建仁寺内有著名的双龙图巨型水墨天顶与日式写意枯山水庭院。傍晚时分在花见小路常能有幸偶遇端庄优雅、正赶往茶屋等候的艺伎身影。',
              cost: 30,
              tips: ['花见小路严禁对艺伎贴脸拍照阻挡或拉扯其和服，拍照请在规定区域保持距离。']
            }
          ]
        },
        {
          id: 'ks-d3',
          type: 'day',
          title: 'Day 3: 千本鸟居、宇治抹茶与奈良飞鹿',
          time: '自然与信仰',
          description: '在无尽的赤红朱门中前行，随后品味微苦清甜的宇治茶香，最后奔向奈良原野投喂灵动小鹿。',
          cost: 120,
          children: [
            {
              id: 'ks-d3-a1',
              type: 'activity',
              title: '伏见稻荷大社 (千本鸟居)',
              time: '08:00 - 10:30',
              duration: '2.5小时',
              spotRating: 5,
              description: '供奉商业繁盛稻荷神之总本社。其后山由上万座朱红色鸟居密密麻麻搭建成的红色隧道横跨整座山头，在晨光树影漏下时神秘绝伦。',
              cost: 0,
              tips: ['建议8点前赶到，否则到了9点之后团队大军压境，很难拍到空无一人的千本鸟居大片。']
            },
            {
              id: 'ks-d3-t1',
              type: 'transport',
              title: '搭乘京阪本线前往宇治',
              time: '10:30 - 11:00',
              transportMethod: 'train',
              description: '只需20分钟直达宇治茶乡，沿途能看见波光粼粼的宇治川。',
              cost: 18
            },
            {
              id: 'ks-d3-a2',
              type: 'activity',
              title: '宇治川畔与中村藤吉抹茶极味',
              time: '11:10 - 13:30',
              duration: '2.2小时',
              spotRating: 4,
              description: '宇治是著名的宇治茶产地。到访“中村藤吉本店”享用招牌竹筒抹茶刨冰与现做抹茶芭菲。下午可顺便漫步世界遗产平等院。',
              cost: 120,
              tips: ['中村藤吉店在周末排队人极多，一到宇治最好第一站先去总本店拿排队号。']
            }
          ]
        }
      ]
    }
  },
  {
    id: 'iceland-aurora',
    title: '冰岛极地纯净：黄金圈/瀑布与黑沙滩追光之旅',
    description: '深入北纬64度，走过地热蒸汽漫天的荒野，看万吨巨浪拍打雷尼斯黑沙滩，并在澄澈夜幕下搜寻一缕神秘的北极光。',
    coverImage: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80', // Beautiful Northern Lights/Iceland photo
    budgetCategory: '品质舒适',
    season: '冬季 / 10月-次年3月',
    totalDays: 4,
    packingList: [
      ...DEFAULT_PACKING_LISTS.standard,
      ...DEFAULT_PACKING_LISTS.winter
    ],
    rootNode: {
      id: 'is-root',
      type: 'destination',
      title: '冰岛极地雷克雅未克 & 黄金圈4日游',
      description: '逃离钢铁丛林，坠入瀑布、黑沙滩、地热温泉与午夜苍穹的极圈怀抱。',
      cost: 9500,
      tips: [
        '冰岛冬季天气瞬息万变，大风橙色预警频发，建议包车或报专业小团，极不推荐无雪地驾驶经验者冬日自驾。',
        '极光指数（KP值）可提前下载Vedur APP查询，通常到KP值在3以上且无云时，肉眼清晰可见绿光。',
        '冰岛物价昂贵，酒店多含有免费丰盛早餐，正餐可以品尝极地著名的羊排和冰岛鱼汤。'
      ],
      children: [
        {
          id: 'is-d1',
          type: 'day',
          title: 'Day 1: 降落极北之都与首航追光',
          time: '步入冷酷仙境',
          description: '落地冰岛凯夫拉维克机场，感受冷冽干净的北极海风。入住雷克雅未克市区，整装待发搜寻极光。',
          cost: 320,
          children: [
            {
              id: 'is-d1-t1',
              type: 'transport',
              title: '机场大巴 Flybus 直达市区酒店',
              time: '15:30 - 16:30',
              transportMethod: 'bus',
              description: '落地后在出站口乘坐Flybus快线直达雷克雅未克，大巴配备有免费WiFi与USB充电。',
              cost: 180
            },
            {
              id: 'is-d1-a1',
              type: 'lodging',
              title: '雷克雅未克福斯酒店 (Fosshotel Reykjavik)',
              time: '17:00',
              description: '市区内时尚简约的四星首府酒店。高层视野能够俯瞰大洋，地理位置优越，步行5分钟即达主购物街。',
              cost: 1200,
              tips: ['酒店前台会提供晚间极光叫醒服务（Aurora Wake-up），一旦窗外出现极光将全楼响铃通知。']
            },
            {
              id: 'is-d1-a2',
              type: 'dining',
              title: 'Old Iceland Restaurant 暖冬鱼汤与秘制羊排',
              time: '18:30 - 20:30',
              description: '雷克雅未克最温润正宗的本土餐厅。使用新鲜捕捞的深海鱈鱼搭配冰岛野生百里香精烤，冰岛羊排软嫩无膻味，极度暖胃。',
              cost: 400
            },
            {
              id: 'is-d1-a3',
              type: 'activity',
              title: '冬季夜间巴士极光狩猎巡狂',
              time: '21:30 - 01:00',
              duration: '3.5小时',
              spotRating: 5,
              description: '跟随拥有多年气象追踪经验的冰岛向导，乘坐极光大巴远离城市光污染，前往地表无光的旷野荒原静候欧若拉仙子的绿舞漫天。',
              cost: 380,
              tips: [
                '极光大巴通常包含热可可。极圈深夜零下，务必全身穿戴防寒冲锋衣和厚靴子！',
                '摄影党记得携带三脚架，手机拍照开启夜景模式并将曝光时间拉长至3-5秒以上。'
              ]
            }
          ]
        },
        {
          id: 'is-d2',
          type: 'day',
          title: 'Day 2: 冰岛地心之火黄金圈探索',
          time: '地质地热震撼',
          description: '探秘欧非板块裂缝，目睹冲天而起的巨大地热喷泉，赞叹冰岛最著名的金色瀑布。',
          cost: 450,
          children: [
            {
              id: 'is-is-d2-a1',
              type: 'activity',
              title: '辛格维利尔国家公园 (Thingvellir)',
              time: '09:00 - 11:30',
              duration: '2.5小时',
              spotRating: 4,
              description: '世界唯二横跨美洲与欧亚板块大裂谷的绝美景观，也是世界上最早的民主议会旧址。白雪覆盖峡谷，流水澄澈无比。',
              cost: 0,
              tips: ['如果你极度勇敢，这里有著名的Silfra大裂缝浮潜，可穿干式潜水服遨游在两大板块晶莹的冰川融水中，水下能见度超百米！']
            },
            {
              id: 'is-is-d2-a2',
              type: 'activity',
              title: '盖歇尔地热大间歇泉 (Geysir)',
              time: '12:00 - 14:00',
              duration: '2小时',
              spotRating: 5,
              description: '冰岛最富盛名的喷泉活古迹。每过4-10分钟，滚烫的蓝色巨泉会由于地下压力积累瞬间爆裂喷射直入数二十米高空，并伴随轰鸣和硫磺热气。',
              cost: 0,
              tips: ['每一次喷发前，泉口的水面会突然形成一颗像巨型蓝色水晶的半球状水泡，这是最佳摄影快门按下点。']
            },
            {
              id: 'is-is-d2-a3',
              type: 'activity',
              title: '黄金瀑布 (Gullfoss Waterfall)',
              time: '14:30 - 16:30',
              duration: '2小时',
              spotRating: 5,
              description: '奔腾咆哮的白河在此处坠落入深达32米的双极断层大峡谷，溅起的巨大水雾在斜阳和白雪背景下，展现犹如黄金浇注的宏伟仙景。',
              cost: 0,
              tips: ['冬日木栈道极滑，鞋面务必套好登山冰爪（Crampons）以免摔伤。']
            }
          ]
        }
      ]
    }
  }
];
