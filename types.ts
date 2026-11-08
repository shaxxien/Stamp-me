export interface MessageReply {
  id: string;
  sender: 'owner' | 'sender';
  content: string;
  createdAt: string;
}

export interface StampMessage {
  id: string;
  accessCode: string;
  category: 'duty_shift' | 'internship' | 'board_exam' | 'gratitude' | 'confession' | 'question' | 'general';
  stampDesign: string;
  senderAlias: string;
  recipientName: string;
  content: string;
  createdAt: string;
  status: 'delivered' | 'read' | 'replied';
  replies: MessageReply[];
  pinned?: boolean;
  archived?: boolean;
}

export interface ThemeSettings {
  palette: 'sage' | 'emerald' | 'mint' | 'olive' | 'nightshift' | 'custom';
  primaryColor: string;
  primaryDark: string;
  bgColor: string;
  cardColor: string;
  borderColor: string;
  fontStyle: 'editorial' | 'modern' | 'vintage' | 'classic' | 'canva_spartan' | 'canva_cinzel' | 'canva_script' | 'custom';
  paperTexture: 'ruled' | 'blank';
  stampBorder: 'perforated' | 'minimal' | 'vintage';

  // Canva Layout & Visual Assets
  canvaLayoutMode?: 'split' | 'banner' | 'poster' | 'minimal';
  customHeroImage?: string;
  customLogoImage?: string;
  customWatermarkImage?: string;
  heroImageFit?: 'cover' | 'contain' | 'auto';
  heroImageCaption?: string;

  // Custom Canva Fonts
  customFontHeading?: string;
  customFontBody?: string;
  customFontUrl?: string;
}

export const THEME_PRESETS: Record<string, ThemeSettings> = {
  sage: {
    palette: 'sage',
    primaryColor: '#3B5337',
    primaryDark: '#2A3A29',
    bgColor: '#F8FAF7',
    cardColor: '#FFFFFF',
    borderColor: '#CFDBCB',
    fontStyle: 'editorial',
    paperTexture: 'ruled',
    stampBorder: 'perforated',
  },
  emerald: {
    palette: 'emerald',
    primaryColor: '#235338',
    primaryDark: '#183B28',
    bgColor: '#F4F9F5',
    cardColor: '#FFFFFF',
    borderColor: '#C2DEC9',
    fontStyle: 'editorial',
    paperTexture: 'ruled',
    stampBorder: 'perforated',
  },
  mint: {
    palette: 'mint',
    primaryColor: '#2D6A56',
    primaryDark: '#1E473A',
    bgColor: '#F2FAF7',
    cardColor: '#FFFFFF',
    borderColor: '#BEE0D3',
    fontStyle: 'modern',
    paperTexture: 'ruled',
    stampBorder: 'minimal',
  },
  olive: {
    palette: 'olive',
    primaryColor: '#4A5328',
    primaryDark: '#353C1C',
    bgColor: '#FAF9F4',
    cardColor: '#FFFFFF',
    borderColor: '#D8DFC0',
    fontStyle: 'vintage',
    paperTexture: 'ruled',
    stampBorder: 'vintage',
  },
  nightshift: {
    palette: 'nightshift',
    primaryColor: '#529E72',
    primaryDark: '#183624',
    bgColor: '#111A14',
    cardColor: '#18241C',
    borderColor: '#2D4433',
    fontStyle: 'modern',
    paperTexture: 'blank',
    stampBorder: 'perforated',
  },
};

export interface PublicBridgeStats {
  recipientTitle: string;
  siteHeadline?: string;
  siteSubtitle?: string;
  heroIntro?: string;
  purposeText?: string;
  welcomeNote: string;
  allowPublicJournal?: boolean;
  totalReceived: number;
  totalReplied: number;
  activeStampsCount: number;
  theme?: ThemeSettings;
}

export interface StampOption {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  badge: string;
  symbol: string;
  description: string;
}

export const STAMP_DESIGNS: StampOption[] = [
  {
    id: 'eucalyptus_lab',
    title: 'Botanical Lab Sage',
    subtitle: 'Healing & Clarity',
    color: 'from-[#4A6945] to-[#2D452B]',
    badge: 'SAGE 01',
    symbol: '🌿',
    description: 'Crisp eucalyptus leaves symbolizing resilience after endless hours standing at the specimen counter.',
  },
  {
    id: 'hematology_slide',
    title: 'Hematology Wright Stain',
    subtitle: 'Cellular Whispers',
    color: 'from-[#6E3B51] to-[#3F2030]',
    badge: 'HEMA 02',
    symbol: '🔬',
    description: 'Inspired by peripheral blood smears, 100x oil immersion lenses, and late-night manual differential counts.',
  },
  {
    id: 'gram_negative',
    title: 'Microbiology Violet',
    subtitle: 'Unknown Colonies',
    color: 'from-[#4B3B6E] to-[#2B1F43]',
    badge: 'MICRO 03',
    symbol: '🧫',
    description: 'For those wrestling with MacConkey agars, Gram stains, and baffling unknown bacterial cultures.',
  },
  {
    id: 'blood_bank',
    title: 'Crossmatch Emerald',
    subtitle: 'Urgent Transfusions',
    color: 'from-[#2D5A3C] to-[#173321]',
    badge: 'BBANK 04',
    symbol: '🩸',
    description: 'Honoring the quiet tension of blood compatibility tests and code red emergency releases.',
  },
  {
    id: 'clinical_chemistry',
    title: 'Clinical Gold Serum',
    subtitle: 'Precision & Balance',
    color: 'from-[#8C6D2B] to-[#553E12]',
    badge: 'CHEM 05',
    symbol: '🧪',
    description: 'Gold-top SST tubes, spectrophotometry calibrations, and electrolyte balance under pressure.',
  },
  {
    id: 'histopathology',
    title: 'Histopath Ribbon',
    subtitle: 'Preserved Fragility',
    color: 'from-[#5D6B5A] to-[#354033]',
    badge: 'HISTO 06',
    symbol: '📋',
    description: 'Paraffin tissue ribbons, microtomes, and the patience needed for microscopic tissue diagnosis.',
  },
];

export const CATEGORIES = [
  { id: 'duty_shift', label: 'Hospital Duty Shift', icon: '🌙', desc: 'Vents from the ER lab, ward rounds, graveyard fatigue' },
  { id: 'internship', label: 'Internship Confessions', icon: '🥼', desc: 'Preceptor anxiety, rotation stories, scrub room moments' },
  { id: 'board_exam', label: 'Board Exam Jitters', icon: '📚', desc: 'MTLE / ASCPi review blues, memorization fear, future hopes' },
  { id: 'gratitude', label: 'Unspoken Gratitude', icon: '🌱', desc: 'Thanking a senior, batchmate, or mentor anonymously' },
  { id: 'confession', label: 'Laboratory Confession', icon: '💌', desc: 'Secret crushes, broken glassware secrets, heartfelt thoughts' },
  { id: 'question', label: 'Advice & Guidance', icon: '🔍', desc: 'Seeking life advice or rotation survival tips' },
  { id: 'general', label: 'Quiet Bridge Letter', icon: '🕊️', desc: 'Anything else you need to set down gently' },
] as const;
