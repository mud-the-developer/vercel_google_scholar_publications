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

export const THEMES: Record<string, ThemeColors> = {
  // --- Light variants ---
  light: {
    bg: '#ffffff', headerBg: '#f6f8fa', border: '#d0d7de', title: '#24292f',
    authors: '#656d76', citationBadge: '#0969da', citationText: '#ffffff',
    yearText: '#656d76', divider: '#d8dee4', headerTitle: '#24292f', headerSub: '#656d76',
  },
  dark: {
    bg: '#0d1117', headerBg: '#161b22', border: '#30363d', title: '#e6edf3',
    authors: '#8b949e', citationBadge: '#58a6ff', citationText: '#ffffff',
    yearText: '#8b949e', divider: '#21262d', headerTitle: '#e6edf3', headerSub: '#8b949e',
  },
  // --- GitHub-inspired ---
  'github-light': {
    bg: '#ffffff', headerBg: '#f6f8fa', border: '#d0d7de', title: '#0969da',
    authors: '#656d76', citationBadge: '#2da44e', citationText: '#ffffff',
    yearText: '#656d76', divider: '#d8dee4', headerTitle: '#24292f', headerSub: '#656d76',
  },
  'github-dark': {
    bg: '#0d1117', headerBg: '#161b22', border: '#30363d', title: '#58a6ff',
    authors: '#8b949e', citationBadge: '#3fb950', citationText: '#ffffff',
    yearText: '#8b949e', divider: '#21262d', headerTitle: '#c9d1d9', headerSub: '#8b949e',
  },
  'github-dimmed': {
    bg: '#22272e', headerBg: '#2d333b', border: '#444c56', title: '#539bf5',
    authors: '#768390', citationBadge: '#57ab5a', citationText: '#ffffff',
    yearText: '#768390', divider: '#373e47', headerTitle: '#adbac7', headerSub: '#768390',
  },

  // --- Monokai ---
  monokai: {
    bg: '#272822', headerBg: '#1e1f1c', border: '#49483e', title: '#f8f8f2',
    authors: '#75715e', citationBadge: '#a6e22e', citationText: '#272822',
    yearText: '#75715e', divider: '#49483e', headerTitle: '#f8f8f2', headerSub: '#75715e',
  },

  // --- Dracula ---
  dracula: {
    bg: '#282a36', headerBg: '#21222c', border: '#44475a', title: '#f8f8f2',
    authors: '#6272a4', citationBadge: '#bd93f9', citationText: '#f8f8f2',
    yearText: '#6272a4', divider: '#44475a', headerTitle: '#f8f8f2', headerSub: '#6272a4',
  },

  // --- Nord ---
  nord: {
    bg: '#2e3440', headerBg: '#3b4252', border: '#4c566a', title: '#eceff4',
    authors: '#d8dee9', citationBadge: '#88c0d0', citationText: '#2e3440',
    yearText: '#d8dee9', divider: '#4c566a', headerTitle: '#eceff4', headerSub: '#d8dee9',
  },
  'nord-light': {
    bg: '#eceff4', headerBg: '#e5e9f0', border: '#d8dee9', title: '#2e3440',
    authors: '#4c566a', citationBadge: '#5e81ac', citationText: '#eceff4',
    yearText: '#4c566a', divider: '#d8dee9', headerTitle: '#2e3440', headerSub: '#4c566a',
  },

  // --- Solarized ---
  solarized: {
    bg: '#002b36', headerBg: '#073642', border: '#586e75', title: '#93a1a1',
    authors: '#657b83', citationBadge: '#268bd2', citationText: '#fdf6e3',
    yearText: '#657b83', divider: '#586e75', headerTitle: '#93a1a1', headerSub: '#657b83',
  },
  'solarized-light': {
    bg: '#fdf6e3', headerBg: '#eee8d5', border: '#93a1a1', title: '#657b83',
    authors: '#839496', citationBadge: '#268bd2', citationText: '#fdf6e3',
    yearText: '#839496', divider: '#93a1a1', headerTitle: '#657b83', headerSub: '#839496',
  },

  // --- Gruvbox ---
  gruvbox: {
    bg: '#282828', headerBg: '#1d2021', border: '#3c3836', title: '#ebdbb2',
    authors: '#a89984', citationBadge: '#fabd2f', citationText: '#282828',
    yearText: '#a89984', divider: '#3c3836', headerTitle: '#ebdbb2', headerSub: '#a89984',
  },
  'gruvbox-light': {
    bg: '#fbf1c7', headerBg: '#f2e5bc', border: '#d5c4a1', title: '#3c3836',
    authors: '#7c6f64', citationBadge: '#d79921', citationText: '#fbf1c7',
    yearText: '#7c6f64', divider: '#d5c4a1', headerTitle: '#3c3836', headerSub: '#7c6f64',
  },

  // --- One Dark / One Light ---
  'one-dark': {
    bg: '#282c34', headerBg: '#21252b', border: '#3e4451', title: '#abb2bf',
    authors: '#5c6370', citationBadge: '#61afef', citationText: '#282c34',
    yearText: '#5c6370', divider: '#3e4451', headerTitle: '#abb2bf', headerSub: '#5c6370',
  },
  'one-light': {
    bg: '#fafafa', headerBg: '#f0f0f0', border: '#dbdbdc', title: '#383a42',
    authors: '#a0a1a7', citationBadge: '#4078f2', citationText: '#ffffff',
    yearText: '#a0a1a7', divider: '#dbdbdc', headerTitle: '#383a42', headerSub: '#a0a1a7',
  },

  // --- Tokyo Night ---
  'tokyo-night': {
    bg: '#1a1b26', headerBg: '#16161e', border: '#292e42', title: '#c0caf5',
    authors: '#565f89', citationBadge: '#7aa2f7', citationText: '#1a1b26',
    yearText: '#565f89', divider: '#292e42', headerTitle: '#c0caf5', headerSub: '#565f89',
  },
  'tokyo-night-storm': {
    bg: '#24283b', headerBg: '#1f2335', border: '#3b4261', title: '#c0caf5',
    authors: '#565f89', citationBadge: '#bb9af7', citationText: '#1a1b26',
    yearText: '#565f89', divider: '#3b4261', headerTitle: '#c0caf5', headerSub: '#565f89',
  },
  'tokyo-night-light': {
    bg: '#d5d6db', headerBg: '#cbccd1', border: '#b4b5b9', title: '#343b58',
    authors: '#9699a3', citationBadge: '#34548a', citationText: '#d5d6db',
    yearText: '#9699a3', divider: '#b4b5b9', headerTitle: '#343b58', headerSub: '#9699a3',
  },

  // --- Catppuccin ---
  'catppuccin-latte': {
    bg: '#eff1f5', headerBg: '#e6e9ef', border: '#ccd0da', title: '#4c4f69',
    authors: '#8c8fa1', citationBadge: '#1e66f5', citationText: '#eff1f5',
    yearText: '#8c8fa1', divider: '#ccd0da', headerTitle: '#4c4f69', headerSub: '#8c8fa1',
  },
  'catppuccin-frappe': {
    bg: '#303446', headerBg: '#292c3c', border: '#414559', title: '#c6d0f5',
    authors: '#838ba7', citationBadge: '#8caaee', citationText: '#303446',
    yearText: '#838ba7', divider: '#414559', headerTitle: '#c6d0f5', headerSub: '#838ba7',
  },
  'catppuccin-macchiato': {
    bg: '#24273a', headerBg: '#1e2030', border: '#363a4f', title: '#cad3f5',
    authors: '#8087a2', citationBadge: '#8aadf4', citationText: '#24273a',
    yearText: '#8087a2', divider: '#363a4f', headerTitle: '#cad3f5', headerSub: '#8087a2',
  },
  'catppuccin-mocha': {
    bg: '#1e1e2e', headerBg: '#181825', border: '#313244', title: '#cdd6f4',
    authors: '#7f849c', citationBadge: '#89b4fa', citationText: '#1e1e2e',
    yearText: '#7f849c', divider: '#313244', headerTitle: '#cdd6f4', headerSub: '#7f849c',
  },

  // --- Material ---
  material: {
    bg: '#263238', headerBg: '#1e272c', border: '#37474f', title: '#eeffff',
    authors: '#546e7a', citationBadge: '#82aaff', citationText: '#263238',
    yearText: '#546e7a', divider: '#37474f', headerTitle: '#eeffff', headerSub: '#546e7a',
  },
  'material-lighter': {
    bg: '#fafafa', headerBg: '#f2f2f2', border: '#e7e7e8', title: '#90a4ae',
    authors: '#ccd7da', citationBadge: '#6182b8', citationText: '#fafafa',
    yearText: '#ccd7da', divider: '#e7e7e8', headerTitle: '#90a4ae', headerSub: '#ccd7da',
  },
  'material-palenight': {
    bg: '#292d3e', headerBg: '#232738', border: '#3a3f58', title: '#a6accd',
    authors: '#676e95', citationBadge: '#c792ea', citationText: '#292d3e',
    yearText: '#676e95', divider: '#3a3f58', headerTitle: '#a6accd', headerSub: '#676e95',
  },
  'material-ocean': {
    bg: '#0f111a', headerBg: '#0a0c14', border: '#1f2233', title: '#a6accd',
    authors: '#464b5d', citationBadge: '#84ffff', citationText: '#0f111a',
    yearText: '#464b5d', divider: '#1f2233', headerTitle: '#a6accd', headerSub: '#464b5d',
  },

  // --- Ayu ---
  ayu: {
    bg: '#0b0e14', headerBg: '#0d1017', border: '#1c1f27', title: '#bfbdb6',
    authors: '#565b66', citationBadge: '#e6b450', citationText: '#0b0e14',
    yearText: '#565b66', divider: '#1c1f27', headerTitle: '#bfbdb6', headerSub: '#565b66',
  },
  'ayu-mirage': {
    bg: '#1f2430', headerBg: '#1a1f2b', border: '#33395a', title: '#cbccc6',
    authors: '#5c6773', citationBadge: '#ffcc66', citationText: '#1f2430',
    yearText: '#5c6773', divider: '#33395a', headerTitle: '#cbccc6', headerSub: '#5c6773',
  },
  'ayu-light': {
    bg: '#fafafa', headerBg: '#f3f3f3', border: '#dcdcdc', title: '#5c6166',
    authors: '#abb0b6', citationBadge: '#f2ae49', citationText: '#fafafa',
    yearText: '#abb0b6', divider: '#dcdcdc', headerTitle: '#5c6166', headerSub: '#abb0b6',
  },

  // --- Synthwave ---
  synthwave: {
    bg: '#2b213a', headerBg: '#241b2f', border: '#3e3350', title: '#f92aad',
    authors: '#7984a4', citationBadge: '#ff7edb', citationText: '#2b213a',
    yearText: '#7984a4', divider: '#3e3350', headerTitle: '#f92aad', headerSub: '#7984a4',
  },

  // --- Cyberpunk ---
  cyberpunk: {
    bg: '#0a0a0f', headerBg: '#111118', border: '#1a1a2e', title: '#00ff9c',
    authors: '#4a4a6a', citationBadge: '#ff003c', citationText: '#ffffff',
    yearText: '#4a4a6a', divider: '#1a1a2e', headerTitle: '#00ff9c', headerSub: '#4a4a6a',
  },

  // --- Retro ---
  retro: {
    bg: '#fdf0d5', headerBg: '#f5e6c8', border: '#c6a969', title: '#5c4033',
    authors: '#8b7355', citationBadge: '#c1440e', citationText: '#fdf0d5',
    yearText: '#8b7355', divider: '#c6a969', headerTitle: '#5c4033', headerSub: '#8b7355',
  },

  // --- Pastel ---
  pastel: {
    bg: '#fef6ff', headerBg: '#f8ecfa', border: '#e8d5eb', title: '#6b4c7a',
    authors: '#a88fb5', citationBadge: '#c084fc', citationText: '#ffffff',
    yearText: '#a88fb5', divider: '#e8d5eb', headerTitle: '#6b4c7a', headerSub: '#a88fb5',
  },

  // --- Everforest ---
  everforest: {
    bg: '#2d353b', headerBg: '#272e33', border: '#3d484d', title: '#d3c6aa',
    authors: '#859289', citationBadge: '#a7c080', citationText: '#2d353b',
    yearText: '#859289', divider: '#3d484d', headerTitle: '#d3c6aa', headerSub: '#859289',
  },
  'everforest-light': {
    bg: '#fdf6e3', headerBg: '#f4eed5', border: '#d8d3ba', title: '#5c6a72',
    authors: '#829181', citationBadge: '#8da101', citationText: '#fdf6e3',
    yearText: '#829181', divider: '#d8d3ba', headerTitle: '#5c6a72', headerSub: '#829181',
  },

  // --- Rose Pine ---
  'rose-pine': {
    bg: '#191724', headerBg: '#1f1d2e', border: '#26233a', title: '#e0def4',
    authors: '#6e6a86', citationBadge: '#c4a7e7', citationText: '#191724',
    yearText: '#6e6a86', divider: '#26233a', headerTitle: '#e0def4', headerSub: '#6e6a86',
  },
  'rose-pine-moon': {
    bg: '#232136', headerBg: '#2a273f', border: '#393552', title: '#e0def4',
    authors: '#6e6a86', citationBadge: '#ea9a97', citationText: '#232136',
    yearText: '#6e6a86', divider: '#393552', headerTitle: '#e0def4', headerSub: '#6e6a86',
  },
  'rose-pine-dawn': {
    bg: '#faf4ed', headerBg: '#f2e9e1', border: '#dfdad9', title: '#575279',
    authors: '#9893a5', citationBadge: '#d7827e', citationText: '#faf4ed',
    yearText: '#9893a5', divider: '#dfdad9', headerTitle: '#575279', headerSub: '#9893a5',
  },

  // --- Kanagawa ---
  kanagawa: {
    bg: '#1f1f28', headerBg: '#16161d', border: '#2a2a37', title: '#dcd7ba',
    authors: '#727169', citationBadge: '#7e9cd8', citationText: '#1f1f28',
    yearText: '#727169', divider: '#2a2a37', headerTitle: '#dcd7ba', headerSub: '#727169',
  },

  // --- Cobalt ---
  cobalt: {
    bg: '#193549', headerBg: '#122738', border: '#1f4662', title: '#ffffff',
    authors: '#6688aa', citationBadge: '#ffc600', citationText: '#193549',
    yearText: '#6688aa', divider: '#1f4662', headerTitle: '#ffffff', headerSub: '#6688aa',
  },

  // --- Horizon ---
  horizon: {
    bg: '#1c1e26', headerBg: '#16171d', border: '#2e303e', title: '#d5d8da',
    authors: '#6c6f93', citationBadge: '#e95678', citationText: '#ffffff',
    yearText: '#6c6f93', divider: '#2e303e', headerTitle: '#d5d8da', headerSub: '#6c6f93',
  },

  // --- Night Owl ---
  'night-owl': {
    bg: '#011627', headerBg: '#001122', border: '#122d42', title: '#d6deeb',
    authors: '#637777', citationBadge: '#7fdbca', citationText: '#011627',
    yearText: '#637777', divider: '#122d42', headerTitle: '#d6deeb', headerSub: '#637777',
  },

  // --- Panda ---
  panda: {
    bg: '#292a2b', headerBg: '#242526', border: '#3b3c3d', title: '#e6e6e6',
    authors: '#757575', citationBadge: '#19f9d8', citationText: '#292a2b',
    yearText: '#757575', divider: '#3b3c3d', headerTitle: '#e6e6e6', headerSub: '#757575',
  },

  // --- Shades of Purple ---
  'shades-of-purple': {
    bg: '#2d2b55', headerBg: '#252347', border: '#3d3b6d', title: '#fad000',
    authors: '#a599e9', citationBadge: '#ff628c', citationText: '#ffffff',
    yearText: '#a599e9', divider: '#3d3b6d', headerTitle: '#fad000', headerSub: '#a599e9',
  },

  // --- Slack ---
  'slack-dark': {
    bg: '#1a1d21', headerBg: '#121417', border: '#2c2d30', title: '#d1d2d3',
    authors: '#8b8d90', citationBadge: '#4a9eff', citationText: '#ffffff',
    yearText: '#8b8d90', divider: '#2c2d30', headerTitle: '#d1d2d3', headerSub: '#8b8d90',
  },
  'slack-ochin': {
    bg: '#ffffff', headerBg: '#f8f8f8', border: '#dddddd', title: '#1d1c1d',
    authors: '#868686', citationBadge: '#007a5a', citationText: '#ffffff',
    yearText: '#868686', divider: '#dddddd', headerTitle: '#1d1c1d', headerSub: '#868686',
  },

  // --- Minimal ---
  'minimal-light': {
    bg: '#ffffff', headerBg: '#ffffff', border: '#e5e5e5', title: '#171717',
    authors: '#a3a3a3', citationBadge: '#171717', citationText: '#ffffff',
    yearText: '#a3a3a3', divider: '#e5e5e5', headerTitle: '#171717', headerSub: '#a3a3a3',
  },
  'minimal-dark': {
    bg: '#171717', headerBg: '#171717', border: '#404040', title: '#fafafa',
    authors: '#737373', citationBadge: '#fafafa', citationText: '#171717',
    yearText: '#737373', divider: '#404040', headerTitle: '#fafafa', headerSub: '#737373',
  },

  // --- Vitesse ---
  vitesse: {
    bg: '#121212', headerBg: '#0e0e0e', border: '#222222', title: '#dbd7ca',
    authors: '#555555', citationBadge: '#4d9375', citationText: '#ffffff',
    yearText: '#555555', divider: '#222222', headerTitle: '#dbd7ca', headerSub: '#555555',
  },
  'vitesse-light': {
    bg: '#ffffff', headerBg: '#f7f7f7', border: '#e5e5e5', title: '#393a34',
    authors: '#999999', citationBadge: '#1e754f', citationText: '#ffffff',
    yearText: '#999999', divider: '#e5e5e5', headerTitle: '#393a34', headerSub: '#999999',
  },
};

export const THEME_NAMES = Object.keys(THEMES);

export function getTheme(name: string): ThemeColors {
  return THEMES[name] ?? THEMES.light;
}
