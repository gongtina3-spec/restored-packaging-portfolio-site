const asset = (name) => `./assets/portfolio/${name}`;

export const siteInfo = {
  brandName: 'Personal Portfolio',
  brandSubline: 'Packaging Design',
  heroTitle: '个人作品集',
  heroDisplayTitle: 'PORTFOLIO',
  heroIpImage: asset('hero-ip-character-cutout.png'),
  indexGuideImage: asset('index-ip-guide-lookhere-clean-420.png'),
  heroKicker: 'Luxury Skincare / Gift Box Packaging',
  heroLead: '专注高端护肤&礼盒包装设计',
  heroDescription:
    '具备完整产品落地经验，兼顾视觉美感与印刷工艺、备案规范、擅长极简高奢、日化全品类包装、科技医美多风格视觉输出',
  intro:
    '我是一名包装设计师，关注品牌调性、货架识别与包装落地之间的平衡。擅长将消费品项目从视觉概念延展到包装系统、礼盒呈现和提案版式，让作品在求职展示与商业沟通中更清晰、更有质感。',
  email: '1642629673@qq.com',
  wechat: '19979240437',
  city: '河南省信阳市光山县',
  status: '包装设计师 | 品牌设计师',
};

export const introduceInfo = {
  name: '龚领领',
  photo: asset('profile-photo.jpg'),
  roles: ['包装设计师', '品牌设计师'],
  headline: '专注高端护肤、礼盒包装与品牌视觉落地',
  summary:
    '具备从包装概念、系列视觉、结构配合到印刷工艺沟通的完整项目经验。关注品牌调性、货架识别和生产落地之间的平衡，适合高端护肤、日化全品类、酒类礼盒与科技医美方向的包装视觉输出。',
  stats: [
    { value: '5+', label: '包装领域工作经验' },
    { value: '40+', label: '合作品牌经验' },
    { value: '600+', label: '独立完成单品项目' },
  ],
  contacts: [
    {
      label: 'Phone',
      value: '19979240437',
      href: 'tel:19979240437',
    },
    {
      label: 'Email',
      value: '1642629673@qq.com',
      href: 'mailto:1642629673@qq.com',
    },
    {
      label: 'Location',
      value: '河南省信阳市光山县',
    },
  ],
  basicInfo: [
    { label: '姓名', value: '龚领领' },
    { label: '出生年月', value: '1998.11' },
    { label: '身高', value: '160cm' },
    { label: '民族', value: '汉族' },
    { label: '政治面貌', value: '共青团员' },
    { label: '毕业院校', value: '九江学院' },
    { label: '学历', value: '本科' },
    { label: '求职意向', value: '包装设计师' },
  ],
  skills: [
    { name: '品牌全案设计', rating: 5 },
    { name: '产品包装设计', rating: 5 },
    { name: '包装结构配合', rating: 5 },
    { name: '印刷工艺', rating: 4 },
    { name: '品牌VI设计', rating: 4 },
    { name: '产品视觉提案', rating: 5 },
  ],
  software: ['Ai', 'Ps', 'Lr'],
  hobbies: [
    { name: '看电影', label: 'WATCH A MOVIE', mark: 'MOV' },
    { name: '摄影', label: 'TAKE PICTURES', mark: 'PIC' },
    { name: '绘画', label: 'DRAW PICTURES', mark: 'ART' },
  ],
};

export const strengths = [
  {
    value: '2',
    label: '作品集方向',
    text: '美妆护肤品类，酒类。',
  },
  {
    value: '40+',
    label: '品牌合作经验',
    text: '合作品牌超过了40+，独立完成单品超过600多个工作项目。',
  },
  {
    value: '5+',
    label: '工作经验',
    text: '在包装领域已经有五年工作经验，从创意到落地全面跟进。',
  },
];

export const beautyShowcase = {
  label: '01 / Beauty & Skincare',
  title: '美妆护肤品类',
  titleEn: 'Beauty Packaging System',
  year: '2026',
  summary:
    '一站式美妆护肤包装视觉创意开发，涵盖院线功效护肤、洗护单品、礼赠礼盒全赛道。运用全景视觉、细节局部、系列组合多形式，完整展示护肤品牌全套包装视觉创意方案。',
  hero: {
    image: asset('beauty/beauty-01-ampoule.jpg'),
    label: 'Hero Case',
    title: '21°N Ampoule Serum',
  },
  side: [
    {
      image: asset('beauty/beauty-02-purple.jpg'),
      label: 'Texture / Deep Tone',
      title: 'M&T Cleansing Mousse',
    },
    {
      image: asset('beauty/beauty-03-serum.jpg'),
      label: 'Minimal / Serum',
      title: '38.5°E Citric Acid Serum',
    },
  ],
  gallery: [
    {
      image: asset('beauty/beauty-04-green-clinical.jpg'),
      label: 'Clinical System',
      title: '01 Recombinant Type III',
    },
    {
      image: asset('beauty/beauty-05-green-set.jpg'),
      label: 'Daily Care',
      title: 'Skincare Gift Set',
    },
    {
      image: asset('beauty/beauty-06-tube-detail.jpg'),
      label: 'Detail Crop',
      title: 'Tube Packaging Detail',
    },
    {
      image: asset('beauty/beauty-07-matrix.jpg'),
      label: 'Series Index',
      title: 'Package Matrix',
    },
  ],
  tags: ['高端护肤', '功效精华', '礼盒套装', '日化包装', '科技医美'],
};

const beautyImageTitles = [
  '21°N 安瓶精华套盒',
  'M&T 紫色洁面套盒',
  '38.5°E 极简精华',
  '01 医美修护套装',
  '绿白护肤礼盒',
  '萱草集',
  '白色日化套组',
  '营养补充剂系列',
  '黄色管状包装矩阵',
  'DP 安瓶礼盒',
  '红色试用装套盒',
  'Mebre 功效安瓶',
  '白色礼盒套装',
  '白金冻干粉礼盒',
  '深色冻干粉礼盒',
  '彩色精华套盒',
  '精华单品',
  '绿色冻干粉礼盒',
  '白绿护肤套装',
  '萱草集系列产品',
  '实验型说明书套装',
  '白绿瓶罐陈列',
  '肌研礼盒视觉',
  '绿色矩阵陈列',
  '绿色基础套组',
  '紫色单品包装',
  '琥珀精华特写',
  '琥珀精华液体',
  '棕色磨砂罐组',
  '深绿罐装系列',
  '黑色礼盒陈列',
  '风味固态饮料',
  '黑金冻干粉套盒',
  'ESTHER 绿白方案',
  'ESTHER 蓝白方案',
  'ESTHER 管状方案',
  '蛋白营养简餐',
  '护肤管状细节',
];

const beautyImageItems = beautyImageTitles.map((title, index) => {
  const number = String(index + 1).padStart(2, '0');
  return {
    image: asset(`beauty/all/beauty-all-${number}.jpg`),
    label: `Beauty Visual ${number}`,
    title,
  };
});

export const beautyAllImages = beautyImageItems;

const beautyArchiveGroups = [
  {
    title: '套盒 / 礼盒 / 系列陈列',
    titleEn: 'Sets & Gift Boxes',
    description: '聚焦礼盒结构、系列矩阵与套装陈列，呈现成套包装的视觉统一、层级规划与品牌落地能力。',
    indexes: [0, 3, 4, 6, 9, 10, 11, 12, 13, 14, 15, 17, 20, 22, 23, 30, 31, 32],
  },
  {
    title: '精华 / 霜 / 瓶罐单品',
    titleEn: 'Serum, Cream & Singles',
    description: '围绕精华、安瓶、面霜瓶罐、管状包装与单品细节展开，突出功效表达、材质质感与单品识别度。',
    indexes: [2, 18, 19, 21, 24, 16, 1, 8, 5, 7, 25, 26, 27, 28, 29, 33, 34, 35, 36, 37],
  },
];

export const beautyAllGroups = beautyArchiveGroups.map((group) => ({
  ...group,
  items: group.indexes.map((index) => beautyImageItems[index]),
}));

export const wineShowcase = {
  label: '02 / Wine & Gift Box',
  title: '酒类',
  titleEn: 'Wine Packaging System',
  year: '2026',
  summary:
    '一站式酒类礼赠包装原创创意，独立完成坛瓶器型从零设计，覆盖红金坛酒、青瓷酒瓶、成套礼盒全系列视觉方案。',
  hero: {
    image: asset('wine/all/wine-all-01.jpg'),
    label: 'Hero Case',
    title: 'Red & Gold Ceramic Wine',
  },
  side: [
    {
      image: asset('wine/all/wine-all-07.jpg'),
      label: 'Gift Box / Ritual',
      title: 'Brown Wine Gift Set',
    },
    {
      image: asset('wine/all/wine-all-12.jpg'),
      label: 'Bottle Shape / Jade',
      title: 'Aqua Ceramic Bottle',
    },
  ],
  gallery: [
    {
      image: asset('wine/all/wine-all-02.jpg'),
      label: 'Red Detail',
      title: 'Bottle Detail Crop',
    },
    {
      image: asset('wine/all/wine-all-05.jpg'),
      label: 'Box System',
      title: 'Red Gift Box Series',
    },
    {
      image: asset('wine/all/wine-all-14.jpg'),
      label: 'Blue Glass',
      title: 'Blue Bottle Display',
    },
    {
      image: asset('wine/all/wine-all-16.jpg'),
      label: 'White Porcelain',
      title: 'Porcelain Bottle Package',
    },
  ],
  tags: ['酒瓶设计', '瓶标系统', '礼盒包装', '传统纹样', '红金礼赠'],
};

const wineImageTitles = [
  '红金坛酒主视觉',
  '红金瓶身细节',
  '红色瓶标纹样',
  '坛酒与外盒组合',
  '红色礼盒展开',
  '红色外盒系统',
  '棕色坛酒礼盒',
  '棕色礼盒场景',
  '棕色礼盒系统',
  '青瓷瓶型陈列',
  '青瓷瓶群氛围',
  '青瓷礼盒展示',
  '青瓷套盒系统',
  '蓝色瓶身阵列',
  '蓝色瓶型组合',
  '白瓷瓶包装场景',
  '白瓷瓶单品展示',
  '白瓷瓶系列陈列',
  '白瓷外盒系统',
  '绿色礼盒开盒',
  '黑金礼盒开盒',
  '黑金套装组合',
  '黑金瓶身陈列',
  '黑金瓶标系统',
  '黑金礼盒套装',
  '玻璃瓶单品展示',
  '玻璃瓶系列结构',
  '白金礼盒系统',
  '红色坛酒正面',
  '红色瓶盖细节',
  '红色包装平面',
  '绿色酒瓶单品',
  '黑底瓶身局部',
  '绿色瓶型三视图',
  '绿色瓶盒组合',
  '绿色手提袋系统',
  '小酒瓶包装',
  '白色手提礼盒',
  '陶坛酒单品',
  '陶坛酒组合',
  '陶坛酒系列',
  '青瓷瓶标细节',
  '青瓷瓶盒组合',
  '青瓷包装俯视',
  '青瓷礼盒矩阵',
  '青瓷单瓶开盒',
  '蓝色酒瓶单品',
  '蓝色酒瓶局部',
];

export const wineAllImages = wineImageTitles.map((title, index) => {
  const number = String(index + 1).padStart(2, '0');
  return {
    image: asset(`wine/all/wine-all-${number}.jpg`),
    label: `Wine Visual ${number}`,
    title,
  };
});
