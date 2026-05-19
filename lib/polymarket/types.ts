export type GammaTag = {
  id: string;
  label: string;
  slug: string;
};

export type GammaMarket = {
  id: string;
  question: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  outcomes?: string;
  outcomePrices?: string;
  clobTokenIds?: string;
  volume?: string;
  volumeNum?: number;
  liquidity?: string;
  liquidityNum?: number;
  active: boolean;
  closed: boolean;
  endDate?: string;
  endDateIso?: string;
};

export type GammaEvent = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  active: boolean;
  closed: boolean;
  volume?: number;
  liquidity?: number;
  endDate?: string;
  markets?: GammaMarket[];
  tags?: GammaTag[];
};
