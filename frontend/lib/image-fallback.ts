/**
 * Genere un SVG placeholder en data URI pour les images
 * Pas besoin d'internet ni de fichier externe
 */

const COLORS = {
  primary: "#F5B400",
  dark: "#0A0A0A",
  blue: "#3B82F6",
  green: "#10B981",
  red: "#EF4444",
  purple: "#8B5CF6",
  pink: "#EC4899",
  orange: "#F97316",
  teal: "#14B8A6",
  yellow: "#EAB308",
  gray: "#6B7280",
};

interface PlaceholderOptions {
  text: string;
  emoji?: string;
  color?: string;
  width?: number;
  height?: number;
}

/**
 * Genere un SVG en data URI
 * Utilise comme src pour une image Next/Image ou <img>
 */
export function generatePlaceholder({
  text,
  emoji = "",
  color = COLORS.primary,
  width = 600,
  height = 600,
}: PlaceholderOptions): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${color}" stop-opacity="1"/>
        <stop offset="100%" stop-color="${color}" stop-opacity="0.7"/>
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#g)"/>
    <text x="50%" y="50%" font-family="system-ui, sans-serif" font-size="${width / 12}" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold">
      ${emoji ? emoji + " " : ""}${text}
    </text>
  </svg>`;

  // Encoder en data URI
  const base64 =
    typeof window === "undefined"
      ? Buffer.from(svg).toString("base64")
      : btoa(unescape(encodeURIComponent(svg)));

  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Placeholders predefinis pour chaque produit
 */
export const PRODUCT_PLACEHOLDERS: Record<number, string> = {
  1: generatePlaceholder({ text: "iPhone 15 Pro", emoji: "📱", color: COLORS.dark }),
  2: generatePlaceholder({ text: "Galaxy S24", emoji: "📱", color: COLORS.blue }),
  3: generatePlaceholder({ text: "Xiaomi 14", emoji: "📱", color: COLORS.orange }),
  4: generatePlaceholder({ text: "Sony WH-1000", emoji: "🎧", color: COLORS.dark }),
  5: generatePlaceholder({ text: "AirPods Pro", emoji: "🎧", color: COLORS.gray }),
  6: generatePlaceholder({ text: "Sac a dos", emoji: "🎒", color: COLORS.green }),
  7: generatePlaceholder({ text: "Galaxy Watch", emoji: "⌚", color: COLORS.purple }),
  8: generatePlaceholder({ text: "Nike Air Max", emoji: "👟", color: COLORS.red }),
  9: generatePlaceholder({ text: "Veste Cuir", emoji: "🧥", color: COLORS.pink }),
  10: generatePlaceholder({ text: "Adidas", emoji: "👟", color: COLORS.blue }),
};

/**
 * Placeholders pour les categories
 */
export const CATEGORY_PLACEHOLDERS: Record<string, string> = {
  electronique: generatePlaceholder({ text: "Electronique", emoji: "💻", color: COLORS.blue }),
  "mode-homme": generatePlaceholder({ text: "Mode Homme", emoji: "👔", color: COLORS.dark }),
  "mode-femme": generatePlaceholder({ text: "Mode Femme", emoji: "👗", color: COLORS.pink }),
  "maison-cuisine": generatePlaceholder({ text: "Maison", emoji: "🏠", color: COLORS.green }),
  "beaute-sante": generatePlaceholder({ text: "Beaute", emoji: "💄", color: COLORS.pink }),
  "sport-loisirs": generatePlaceholder({ text: "Sport", emoji: "⚽", color: COLORS.orange }),
};

/**
 * Placeholder pour le hero
 */
export const HERO_PLACEHOLDER = generatePlaceholder({
  text: "ShopMax",
  emoji: "🛍️",
  color: COLORS.primary,
  width: 1200,
  height: 1500,
});
