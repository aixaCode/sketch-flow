const palette = Object.freeze([
  '#dd4528',
  '#28a3dd',
  '#f3db52',
  '#ed84b5',
  '#4ab74e',
  '#9179c0',
  '#8e6d5a',
  '#f19839',
  '#949494',
]);

export const defaultTheme = Object.freeze({
  backgroundColor: '#ffffff',
  strokeColor: '#111111',
  accentColor: '#1464e8',
  textColor: '#111111',
  strokeWidth: 4,
  fontFamily: 'xkcd, "Comic Sans MS", cursive',
  roughness: 5,
  seed: 42,
  colors: palette,
});

export function createTheme(overrides = {}) {
  const theme = { ...defaultTheme, ...overrides };

  if (!Number.isFinite(theme.strokeWidth) || theme.strokeWidth <= 0) {
    throw new TypeError('strokeWidth must be greater than zero');
  }
  if (!Number.isFinite(theme.roughness) || theme.roughness < 0) {
    throw new TypeError('roughness must be zero or greater');
  }
  if (!Number.isInteger(theme.seed) || theme.seed < 0) {
    throw new TypeError('seed must be a non-negative integer');
  }

  return Object.freeze({
    ...theme,
    colors: Object.freeze([...(theme.colors ?? palette)]),
  });
}
