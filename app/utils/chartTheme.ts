export type ChartTheme = {
  primary: string;
  foreground: string;
  muted: string;
  border: string;
  surface: string;
  fontFamily: string;
  palette: string[];
};

const PALETTE_SIZE = 6;

export function readChartTheme(): ChartTheme {
  if (typeof window === "undefined") {
    return {
      primary: "",
      foreground: "",
      muted: "",
      border: "",
      surface: "",
      fontFamily: "",
      palette: [],
    };
  }

  const styles = getComputedStyle(document.documentElement);
  const read = (name: string) => styles.getPropertyValue(name).trim();

  return {
    primary: read("--primary"),
    foreground: read("--foreground"),
    muted: read("--muted"),
    border: read("--border"),
    surface: read("--bg-secondary"),
    fontFamily: getComputedStyle(document.body).fontFamily,
    palette: Array.from({ length: PALETTE_SIZE }, (_, i) =>
      read(`--chart-${i + 1}`),
    ),
  };
}

export function withAlpha(color: string, alpha: number): string {
  const match = /^#([0-9a-f]{6})$/i.exec(color);
  if (!match) return color;
  const value = parseInt(match[1], 16);
  return `rgba(${value >> 16}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`;
}

export function tooltipStyle(theme: ChartTheme) {
  return {
    backgroundColor: theme.foreground,
    titleColor: theme.surface,
    bodyColor: theme.surface,
    padding: 10,
    cornerRadius: 8,
    boxPadding: 4,
    titleFont: { size: 12, weight: 600 as const },
    bodyFont: { size: 12 },
  };
}
