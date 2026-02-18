export interface ThemeColors {
  bg: string;
  headerBg: string;
  border: string;
  title: string;
  authors: string;
  citationBadge: string;
  citationText: string;
  yearText: string;
  divider: string;
  headerTitle: string;
  headerSub: string;
}

export const LIGHT_THEME: ThemeColors = {
  bg: '#ffffff',
  headerBg: '#f6f8fa',
  border: '#d0d7de',
  title: '#24292f',
  authors: '#656d76',
  citationBadge: '#0969da',
  citationText: '#ffffff',
  yearText: '#656d76',
  divider: '#d8dee4',
  headerTitle: '#24292f',
  headerSub: '#656d76',
};

export const DARK_THEME: ThemeColors = {
  bg: '#0d1117',
  headerBg: '#161b22',
  border: '#30363d',
  title: '#e6edf3',
  authors: '#8b949e',
  citationBadge: '#58a6ff',
  citationText: '#ffffff',
  yearText: '#8b949e',
  divider: '#21262d',
  headerTitle: '#e6edf3',
  headerSub: '#8b949e',
};
