/**
 * CATALOG
 * - Products with `demo: true` are demonstration items (Unsplash stand-in photos,
 *   invented prices/stock). They are badged "DEMO" in the UI. Delete them as real
 *   inventory arrives.
 * - The rest are real THEFATTEST pieces (photos from @thefattest.store).
 *   `priceToConfirm: true` = the price is a placeholder until the owner sets it;
 *   the UI tells shoppers to confirm it on WhatsApp.
 * Stock numbers are per size and must be updated with real counts.
 */

export type CategorySlug =
  | "camisetas"
  | "buzos"
  | "chaquetas"
  | "jeans"
  | "cargos"
  | "conjuntos"
  | "sneakers"
  | "accesorios"
  | "joyeria"
  | "perfumeria";

export type Category = {
  slug: CategorySlug;
  label: string;
  group: "clothing" | "sneakers" | "accessories" | "fragrances";
  image: string;
};

export type SizeStock = { label: string; stock: number };
/** `image` = index in Product.images shown when this color is selected. */
export type ColorOption = { name: string; hex: string; image?: number };

export type Product = {
  id: string;
  slug: string;
  name: string;
  /** English name (used when the visitor switches to EN). */
  nameEn?: string;
  category: CategorySlug;
  price: number;
  /** Previous price — when set and higher than price the product is on SALE. */
  compareAt?: number;
  description: string;
  descriptionEn?: string;
  details: string[];
  detailsEn?: string[];
  images: string[];
  colors: ColorOption[];
  sizes: SizeStock[];
  isNew?: boolean;
  featured?: boolean;
  /** Demonstration product (not real inventory). */
  demo?: boolean;
  /** Real product whose price still has to be confirmed by the store. */
  priceToConfirm?: boolean;
  /** ISO date — drives "Novedades" sorting. */
  createdAt: string;
};

const img = (id: string) => `https://images.unsplash.com/photo-${id}?fit=crop`;

export const categories: Category[] = [
  { slug: "camisetas", label: "Camisetas", group: "clothing", image: "/products/hellstar-records-black.jpg" },
  { slug: "buzos", label: "Buzos", group: "clothing", image: "/products/kenzo-tiger.jpg" },
  { slug: "chaquetas", label: "Chaquetas", group: "clothing", image: img("1551028719-00167b16eac5") },
  { slug: "jeans", label: "Jeans", group: "clothing", image: img("1542272604-787c3835535d") },
  { slug: "cargos", label: "Cargos", group: "clothing", image: img("1552902865-b72c031ac5ea") },
  { slug: "conjuntos", label: "Conjuntos", group: "clothing", image: "/products/jordan-set.jpg" },
  { slug: "sneakers", label: "Tenis", group: "sneakers", image: img("1603808033192-082d6919d3e1") },
  { slug: "accesorios", label: "Accesorios", group: "accessories", image: img("1521369909029-2afed882baee") },
  { slug: "joyeria", label: "Joyería", group: "accessories", image: img("1602173574767-37ac01994b2a") },
  { slug: "perfumeria", label: "Perfumería", group: "fragrances", image: img("1588405748880-12d1d2a59f75") },
];

export const categoryGroups: Record<string, CategorySlug[]> = {
  clothing: ["camisetas", "buzos", "chaquetas", "jeans", "cargos", "conjuntos"],
  sneakers: ["sneakers"],
  accessories: ["accesorios", "joyeria"],
  fragrances: ["perfumeria"],
};

const apparel = (s: number, m: number, l: number, xl: number, xxl: number): SizeStock[] => [
  { label: "S", stock: s },
  { label: "M", stock: m },
  { label: "L", stock: l },
  { label: "XL", stock: xl },
  { label: "XXL", stock: xxl },
];
const waist = (...stock: number[]): SizeStock[] =>
  ["28", "30", "32", "34", "36"].map((label, i) => ({ label, stock: stock[i] ?? 0 }));
const shoe = (...stock: number[]): SizeStock[] =>
  ["38", "39", "40", "41", "42", "43"].map((label, i) => ({ label, stock: stock[i] ?? 0 }));
const one = (stock: number, label = "ÚNICA"): SizeStock[] => [{ label, stock }];

const BLACK = { name: "Negro", hex: "#0b0b0b" };
const WHITE = { name: "Blanco", hex: "#f2f2f2" };
const CEMENT = { name: "Cemento", hex: "#6b6b6b" };
const OLIVE = { name: "Oliva", hex: "#4a4f36" };
const SAND = { name: "Arena", hex: "#c9b79c" };
const INDIGO = { name: "Índigo", hex: "#25324a" };
const SILVER = { name: "Plata", hex: "#c7c9cc" };
const GOLD = { name: "Oro", hex: "#c9a14a" };


const local = (name: string) => `/products/${name}.jpg`;
const GREEN = { name: "Verde", hex: "#1f5135" };
const ROYAL = { name: "Azul rey", hex: "#1f3fae" };
const HEATHER = { name: "Gris jaspe", hex: "#bdbdbd" };
const NAVY = { name: "Azul oscuro", hex: "#1b2238" };

/** Real THEFATTEST inventory (photos by @thefattest.store). */
export const realProducts: Product[] = [
  {
    id: "r01",
    slug: "amiri-rhinestone-tee",
    name: "Camiseta Amiri Pedrería",
    nameEn: "Amiri Rhinestone Tee",
    descriptionEn: "Black tee with a rhinestone monogram on the chest and a rhinestone script signature on the back. Shines without shouting.",
    detailsEn: ["Rhinestones on front and back", "Heavyweight cotton", "Regular fit", "Wash inside out, cold, no dryer"],
    category: "camisetas",
    price: 159_900,
    priceToConfirm: true,
    description: "Camiseta negra con monograma en pedrería al pecho y firma script en pedrería en la espalda. Brilla sin gritar.",
    details: ["Pedrería aplicada frente y espalda", "Algodón de alto gramaje", "Fit regular", "Lavar al revés, en frío, sin secadora"],
    images: [local("amiri-front"), local("amiri-back")],
    colors: [BLACK],
    sizes: apparel(2, 3, 3, 2, 1),
    isNew: true,
    createdAt: "2026-11-04",
  },
  {
    id: "r02",
    slug: "mixed-emotion-astronaut-tee",
    name: "Camiseta Mixed Emotion Astronauta",
    nameEn: "Mixed Emotion Astronaut Tee",
    descriptionEn: "Full-print astronaut graphic on the front, gothic rhinestone monogram and MIXED EMOTION rhinestone logo on the back.",
    detailsEn: ["Full front print", "Rhinestone logo on the back", "Heavyweight cotton", "Wash inside out, cold"],
    category: "camisetas",
    price: 159_900,
    priceToConfirm: true,
    description: "Estampado full-print del astronauta al frente, monograma gótico en pedrería y logo MIXED EMOTION en pedrería en la espalda.",
    details: ["Full print frontal", "Logo en pedrería en la espalda", "Algodón pesado", "Lavar al revés en frío"],
    images: [local("mixed-front"), local("mixed-back")],
    colors: [BLACK],
    sizes: apparel(1, 3, 3, 2, 1),
    isNew: true,
    createdAt: "2026-11-03",
  },
  {
    id: "r03",
    slug: "hellstar-records-tee",
    name: "Camiseta Hellstar Records",
    nameEn: "Hellstar Records Tee",
    descriptionEn: "Flaming skull graphic with raised script lettering. Available in black and white.",
    detailsEn: ["Raised puff print", "100% cotton", "Boxy fit", "Wash inside out, cold"],
    category: "camisetas",
    price: 159_900,
    priceToConfirm: true,
    description: "Gráfico de calavera en llamas con lettering script en relieve. Disponible en negro y blanco.",
    details: ["Estampado en relieve (puff print)", "Algodón 100%", "Fit boxy", "Lavar al revés en frío"],
    images: [local("hellstar-records-black"), local("hellstar-records-white")],
    colors: [{ ...BLACK, image: 0 }, { ...WHITE, image: 1 }],
    sizes: apparel(2, 4, 4, 3, 1),
    isNew: true,
    createdAt: "2026-11-02",
  },
  {
    id: "r04",
    slug: "hellstar-heaven-tee",
    name: "Camiseta Hellstar Heaven",
    nameEn: "Hellstar Heaven Tee",
    descriptionEn: "“Is this what heaven sounds like?” — front graphic with fuchsia flame lettering. Black or white.",
    detailsEn: ["Screen-printed front graphic", "100% cotton", "Boxy fit", "Wash inside out, cold"],
    category: "camisetas",
    price: 159_900,
    priceToConfirm: true,
    description: "\"Is this what heaven sounds like?\" — gráfico frontal con lettering en llamas fucsia. Negro o blanco.",
    details: ["Estampado frontal en serigrafía", "Algodón 100%", "Fit boxy", "Lavar al revés en frío"],
    images: [local("hellstar-heaven-black"), local("hellstar-heaven-white")],
    colors: [{ ...BLACK, image: 0 }, { ...WHITE, image: 1 }],
    sizes: apparel(2, 3, 4, 3, 1),
    isNew: true,
    createdAt: "2026-11-01",
  },
  {
    id: "r05",
    slug: "godspeed-liberty-tee",
    name: "Camiseta Godspeed Libertad",
    nameEn: "Godspeed Liberty Tee",
    descriptionEn: "White tee with a Statue of Liberty collage and Godspeed lettering. A statement piece.",
    detailsEn: ["Large-format front print", "100% cotton", "Regular fit", "Wash inside out, cold"],
    category: "camisetas",
    price: 159_900,
    priceToConfirm: true,
    description: "Camiseta blanca con collage de la Estatua de la Libertad y lettering Godspeed. Pieza statement.",
    details: ["Estampado frontal de gran formato", "Algodón 100%", "Fit regular", "Lavar al revés en frío"],
    images: [local("godspeed-white")],
    colors: [WHITE],
    sizes: apparel(1, 2, 3, 2, 0),
    createdAt: "2026-10-31",
  },
  {
    id: "r06",
    slug: "hugo-leopard-tee",
    name: "Camiseta Hugo Leopardo",
    nameEn: "Hugo Leopard Tee",
    descriptionEn: "Bold red leopard on the front with the HUGO logo. In black or white.",
    detailsEn: ["Front print", "100% cotton", "Regular fit", "Wash cold"],
    category: "camisetas",
    price: 129_900,
    priceToConfirm: true,
    description: "Leopardo en rojo intenso al frente con logo HUGO. En negro o blanco.",
    details: ["Estampado frontal", "Algodón 100%", "Fit regular", "Lavar en frío"],
    images: [local("hugo-leopard-black"), local("hugo-leopard-white")],
    colors: [{ ...BLACK, image: 0 }, { ...WHITE, image: 1 }],
    sizes: apparel(2, 4, 4, 2, 1),
    createdAt: "2026-10-30",
  },
  {
    id: "r07",
    slug: "lacoste-signature-tee",
    name: "Camiseta Lacoste Firma",
    nameEn: "Lacoste Signature Tee",
    descriptionEn: "White tee with embroidered crocodile and signature on the chest. Clean, classic, always works.",
    detailsEn: ["Embroidered logo and signature", "100% cotton", "Regular fit", "Wash cold"],
    category: "camisetas",
    price: 129_900,
    priceToConfirm: true,
    description: "Camiseta blanca con cocodrilo y firma bordados al pecho. Limpia, clásica, siempre funciona.",
    details: ["Logo y firma bordados", "Algodón 100%", "Fit regular", "Lavar en frío"],
    images: [local("lacoste-signature-white")],
    colors: [WHITE],
    sizes: apparel(2, 3, 3, 2, 1),
    createdAt: "2026-10-29",
  },
  {
    id: "r08",
    slug: "lacoste-crest-tee",
    name: "Camiseta Lacoste Escudo",
    nameEn: "Lacoste Crest Tee",
    descriptionEn: "Royal blue with an embroidered Lacoste Paris crest on the chest. A color that stands out.",
    detailsEn: ["Embroidered crest", "100% cotton", "Regular fit", "Wash cold"],
    category: "camisetas",
    price: 129_900,
    priceToConfirm: true,
    description: "Azul rey con escudo Lacoste Paris bordado en el pecho. Color que se nota.",
    details: ["Escudo bordado", "Algodón 100%", "Fit regular", "Lavar en frío"],
    images: [local("lacoste-crest-blue")],
    colors: [ROYAL],
    sizes: apparel(1, 3, 3, 2, 0),
    createdAt: "2026-10-27",
  },
  {
    id: "r09",
    slug: "coach-patch-tee",
    name: "Camiseta Coach Parche",
    nameEn: "Coach Patch Tee",
    descriptionEn: "Heather grey with an embroidered circular Coach monogram patch. Old-money style with attitude.",
    detailsEn: ["Applied monogram patch", "Heather cotton", "Regular fit", "Wash cold"],
    category: "camisetas",
    price: 129_900,
    priceToConfirm: true,
    description: "Gris jaspe con parche circular de monograma Coach bordado. Estilo old money con actitud.",
    details: ["Parche de monograma aplicado", "Algodón jaspeado", "Fit regular", "Lavar en frío"],
    images: [local("coach-patch-grey")],
    colors: [HEATHER],
    sizes: apparel(1, 2, 3, 2, 0),
    createdAt: "2026-10-26",
  },
  {
    id: "r10",
    slug: "buzo-calvin-klein",
    name: "Buzo Calvin Klein",
    nameEn: "Calvin Klein Crewneck",
    descriptionEn: "Black fleece crewneck with the Calvin Klein logo on the front. The premium closet staple.",
    detailsEn: ["Brushed fleece", "Front printed logo", "Ribbed cuffs and hem", "Regular fit"],
    category: "buzos",
    price: 169_900,
    priceToConfirm: true,
    description: "Buzo crewneck negro en felpa con logo Calvin Klein al frente. El básico premium del clóset.",
    details: ["Felpa perchada", "Logo estampado al frente", "Puños y pretina en rib", "Fit regular"],
    images: [local("ck-crewneck"), local("ck-crewneck-2")],
    colors: [BLACK],
    sizes: apparel(2, 4, 4, 2, 1),
    isNew: true,
    createdAt: "2026-11-05",
  },
  {
    id: "r11",
    slug: "saco-kenzo-tiger",
    name: "Saco Kenzo Tigre",
    nameEn: "Kenzo Tiger Sweatshirt",
    descriptionEn: "The classic Kenzo tiger in raised embroidery on a navy sweatshirt. All sizes, immediate delivery.",
    detailsEn: ["Raised embroidered tiger", "Cotton fleece", "Ribbed collar with yellow trim", "Immediate delivery"],
    category: "buzos",
    price: 130_000,
    description: "El clásico tigre Kenzo bordado en alto relieve sobre saco azul oscuro. Todas las tallas, entrega inmediata.",
    details: ["Tigre bordado en relieve", "Felpa de algodón", "Cuello rib con vivo amarillo", "Entrega inmediata"],
    images: [local("kenzo-tiger")],
    colors: [NAVY],
    sizes: apparel(3, 5, 5, 4, 2),
    isNew: true,
    createdAt: "2026-11-05",
  },
  {
    id: "r12",
    slug: "conjunto-air-jordan",
    name: "Conjunto Air Jordan",
    nameEn: "Air Jordan Short Set",
    descriptionEn: "Short set: oversized tee + shorts with the AIR JORDAN band. Red or white detail.",
    detailsEn: ["Tee + shorts", "Drawstring shorts with pockets", "Lightweight fleece", "Sold as a set"],
    category: "conjuntos",
    price: 189_900,
    priceToConfirm: true,
    description: "Conjunto de pantaloneta: camiseta oversized + short con banda AIR JORDAN. Detalle en rojo o en blanco.",
    details: ["Camiseta + pantaloneta", "Short con cordón y bolsillos", "Felpa liviana", "Se vende como set"],
    images: [local("jordan-set")],
    colors: [{ name: "Negro / Rojo", hex: "#b3121b" }, { name: "Negro / Blanco", hex: "#f2f2f2" }],
    sizes: apparel(2, 3, 3, 2, 1),
    isNew: true,
    createdAt: "2026-11-04",
  },
  {
    id: "r13",
    slug: "conjunto-lacoste",
    name: "Conjunto Lacoste",
    nameEn: "Lacoste Short Set",
    descriptionEn: "Lacoste short set: tee with front logo + shorts with embroidered crocodile. Black or green.",
    detailsEn: ["Tee + shorts", "Embroidered crocodile on the shorts", "Cotton", "Sold as a set"],
    category: "conjuntos",
    price: 189_900,
    priceToConfirm: true,
    description: "Conjunto de pantaloneta Lacoste: camiseta con logo frontal + short con cocodrilo bordado. Negro o verde.",
    details: ["Camiseta + pantaloneta", "Cocodrilo bordado en el short", "Algodón", "Se vende como set"],
    images: [local("lacoste-set")],
    colors: [BLACK, GREEN],
    sizes: apparel(2, 3, 3, 2, 0),
    createdAt: "2026-11-03",
  },
  {
    id: "r14",
    slug: "conjunto-nike",
    name: "Conjunto Nike",
    nameEn: "Nike Short Set",
    descriptionEn: "Black short set: tee with outlined swoosh + shorts with front logo.",
    detailsEn: ["Tee + shorts", "Drawstring shorts with pockets", "Cotton", "Sold as a set"],
    category: "conjuntos",
    price: 179_900,
    priceToConfirm: true,
    description: "Conjunto de pantaloneta negro: camiseta con swoosh en contorno + short con logo frontal.",
    details: ["Camiseta + pantaloneta", "Short con cordón y bolsillos", "Algodón", "Se vende como set"],
    images: [local("nike-set")],
    colors: [BLACK],
    sizes: apparel(1, 3, 3, 2, 1),
    createdAt: "2026-11-02",
  },
];

const demoProducts: Product[] = [
  {
    id: "p01",
    slug: "oversized-heavy-tee",
    name: "Camiseta Oversize Pesada",
    nameEn: "Oversized Heavy Tee",
    category: "camisetas",
    price: 89_900,
    description:
      "La base de todo fit. Algodón pesado de 240 g, corte oversized con hombro caído y cuello acanalado que no se deforma.",
    details: ["Algodón 100% peinado 240 g/m²", "Fit oversized — pide tu talla habitual", "Cuello rib 2 cm", "Hecho en Colombia"],
    images: [img("1583743814966-8936f5b7be1a"), img("1618354691373-d851c5c3a990")],
    colors: [BLACK, WHITE],
    sizes: apparel(4, 8, 10, 6, 2),
    isNew: true,
    featured: true,
    demo: true,
    createdAt: "2026-10-28",
  },
  {
    id: "p02",
    slug: "essential-hoodie",
    name: "Hoodie Esencial",
    nameEn: "Essential Hoodie",
    category: "buzos",
    price: 189_900,
    compareAt: 219_900,
    description:
      "Hoodie de felpa perchada, capucha doble capa y bolsillo canguro. Pesado, suave y hecho para durar temporadas.",
    details: ["French terry perchado 380 g/m²", "Capucha doble capa sin cordón", "Puños y pretina en rib", "Prelavado: no encoge"],
    images: [img("1556821840-3a63f95609a7"), img("1578681994506-b8f463449011")],
    colors: [CEMENT, BLACK],
    sizes: apparel(3, 6, 0, 5, 2),
    isNew: true,
    featured: true,
    demo: true,
    createdAt: "2026-10-25",
  },
  {
    id: "p03",
    slug: "urban-cargo-pants",
    name: "Pantalón Cargo Urbano",
    nameEn: "Urban Cargo Pants",
    category: "cargos",
    price: 169_900,
    description:
      "Cargo de dril con seis bolsillos, rodilla articulada y bota ajustable con cordón. Funcional sin perder la silueta.",
    details: ["Dril 100% algodón", "6 bolsillos, 2 con fuelle", "Bota ajustable con stopper", "Fit relaxed"],
    images: [img("1552902865-b72c031ac5ea"), img("1624378439575-d8705ad7ae80")],
    colors: [OLIVE, BLACK],
    sizes: waist(2, 5, 6, 4, 1),
    isNew: true,
    featured: true,
    demo: true,
    createdAt: "2026-10-22",
  },
  {
    id: "p04",
    slug: "premium-zip-jacket",
    name: "Chaqueta Premium con Cremallera",
    nameEn: "Premium Zip Jacket",
    category: "chaquetas",
    price: 259_900,
    compareAt: 299_900,
    description:
      "Bomber ligera en nylon mate con forro interno, cremallera metálica y bolsillo utilitario en la manga.",
    details: ["Nylon mate repelente al agua", "Forro interno en malla", "Cremallera metálica YKK", "Bolsillo en manga"],
    images: [img("1591047139829-d91aecb6caea"), img("1617114919297-3c8ddb01f599")],
    colors: [SAND, BLACK],
    sizes: apparel(2, 4, 4, 3, 1),
    featured: true,
    demo: true,
    createdAt: "2026-10-18",
  },
  {
    id: "p05",
    slug: "street-set",
    name: "Conjunto Urbano",
    nameEn: "Street Set",
    category: "conjuntos",
    price: 239_900,
    description: "Conjunto de sudadera: buzo crewneck + jogger a juego. Un outfit completo listo para salir.",
    details: ["Buzo + jogger en felpa 320 g/m²", "Jogger con bolsillos laterales y trasero", "Se vende como set", "Prelavado"],
    images: [img("1588117305388-c2631a279f82"), img("1515886657613-9f3515b0c78f")],
    colors: [CEMENT, BLACK],
    sizes: apparel(3, 5, 5, 2, 0),
    isNew: true,
    featured: true,
    demo: true,
    createdAt: "2026-10-30",
  },
  {
    id: "p06",
    slug: "urban-sneakers",
    name: "Tenis Urbanos",
    nameEn: "Urban Sneakers",
    category: "sneakers",
    price: 349_900,
    compareAt: 399_900,
    description: "Sneaker low-top en cuero y gamuza con suela vulcanizada. Limpios, versátiles y cómodos todo el día.",
    details: ["Capellada en cuero + gamuza", "Plantilla acolchada removible", "Suela de caucho vulcanizado", "Horma estándar"],
    images: [img("1603808033192-082d6919d3e1"), img("1560769629-975ec94e6a86")],
    colors: [WHITE, SAND],
    sizes: shoe(1, 3, 4, 4, 2, 1),
    featured: true,
    demo: true,
    createdAt: "2026-10-12",
  },
  {
    id: "p07",
    slug: "silver-chain",
    name: "Cadena Plateada",
    nameEn: "Silver Chain",
    category: "joyeria",
    price: 129_900,
    description: "Cadena tennis en acero inoxidable con acabado plata y piedras de circón. No se oxida, no pierde brillo.",
    details: ["Acero inoxidable 316L", "Circones talla brillante", "Largo 50 cm · 4 mm", "Cierre de seguridad doble"],
    images: [img("1619119069152-a2b331eb392a"), img("1573408301185-9146fe634ad0")],
    colors: [SILVER],
    sizes: one(9),
    isNew: true,
    featured: true,
    demo: true,
    createdAt: "2026-10-27",
  },
  {
    id: "p08",
    slug: "signature-fragrance",
    name: "Perfume Signature",
    nameEn: "Signature Fragrance",
    category: "perfumeria",
    price: 219_900,
    description:
      "Eau de parfum amaderado-ámbar con salida de bergamota y fondo de oud y vainilla. Proyección fuerte, duración 8–10 h.",
    details: ["Eau de parfum 100 ml", "Notas: bergamota, cardamomo, oud, vainilla", "Duración estimada 8–10 h", "Frasco de vidrio pesado"],
    images: [img("1588405748880-12d1d2a59f75"), img("1615634260167-c8cdede054de")],
    colors: [GOLD],
    sizes: one(12, "100 ML"),
    featured: true,
    demo: true,
    createdAt: "2026-10-20",
  },
  {
    id: "p09",
    slug: "box-logo-tee-white",
    name: "Camiseta Boxy Blanca",
    nameEn: "Box Tee White",
    category: "camisetas",
    price: 79_900,
    description: "Camiseta blanca de corte boxy, la pieza más limpia del drop. Algodón pesado que no transparenta.",
    details: ["Algodón 100% 220 g/m²", "Fit boxy", "Costuras dobles reforzadas", "Hecho en Colombia"],
    images: [img("1521572163474-6864f9cf17ab"), img("1622445275463-afa2ab738c34")],
    colors: [WHITE],
    sizes: apparel(5, 9, 9, 5, 3),
    demo: true,
    createdAt: "2026-09-30",
  },
  {
    id: "p10",
    slug: "bones-graphic-tee",
    name: "Camiseta Gráfica Huesos",
    nameEn: "Bones Graphic Tee",
    category: "camisetas",
    price: 94_900,
    compareAt: 109_900,
    description: "Gráfico frontal en screen print de alta densidad sobre camiseta negra de algodón pesado.",
    details: ["Screen print alta densidad", "Algodón 230 g/m²", "Fit regular-oversized", "Lavar al revés en frío"],
    images: [img("1503341504253-dff4815485f1"), img("1503342217505-b0a15ec3261c")],
    colors: [BLACK],
    sizes: apparel(2, 4, 3, 0, 0),
    demo: true,
    createdAt: "2026-09-12",
  },
  {
    id: "p11",
    slug: "washed-denim-jacket",
    name: "Chaqueta de Jean Lavada",
    nameEn: "Washed Denim Jacket",
    category: "chaquetas",
    price: 279_900,
    description: "Chaqueta de jean importada con lavado oscuro, cuello en contraste y costuras en hilo grueso.",
    details: ["Denim 14 oz", "Cuello en pana", "Botones metálicos", "Fit trucker clásico"],
    images: [img("1611312449408-fcece27cdbb7"), img("1543076447-215ad9ba6923")],
    colors: [INDIGO],
    sizes: apparel(1, 3, 3, 2, 0),
    demo: true,
    createdAt: "2026-09-05",
  },
  {
    id: "p12",
    slug: "leather-biker-jacket",
    name: "Chaqueta Biker de Cuero",
    nameEn: "Leather Biker Jacket",
    category: "chaquetas",
    price: 459_900,
    description: "Biker en cuero sintético premium con cremalleras asimétricas. Actitud pura.",
    details: ["Cuero sintético premium", "Forro satinado", "Cremalleras metálicas", "Cinturón ajustable"],
    images: [img("1551028719-00167b16eac5"), img("1520975954732-35dd22299614")],
    colors: [BLACK],
    sizes: apparel(0, 2, 2, 1, 0),
    featured: true,
    demo: true,
    createdAt: "2026-08-20",
  },
  {
    id: "p13",
    slug: "utility-field-jacket",
    name: "Chaqueta Utilitaria",
    nameEn: "Utility Field Jacket",
    category: "chaquetas",
    price: 289_900,
    description: "Chaqueta utilitaria con capucha oculta, cuatro bolsillos frontales y cordón en cintura.",
    details: ["Algodón ripstop", "Capucha guardada en cuello", "4 bolsillos con tapa", "Cordón ajustable"],
    images: [img("1548883354-94bcfe321cbb"), img("1544022613-e87ca75a784a")],
    colors: [OLIVE],
    sizes: apparel(2, 3, 4, 2, 1),
    demo: true,
    createdAt: "2026-08-02",
  },
  {
    id: "p14",
    slug: "raw-denim-jeans",
    name: "Jean Denim Crudo",
    nameEn: "Raw Denim Jeans",
    category: "jeans",
    price: 199_900,
    description: "Jean importado de denim rígido, corte straight. Se amolda a ti con cada uso.",
    details: ["Denim 13.5 oz", "Corte straight", "5 bolsillos", "Remaches de cobre"],
    images: [img("1542272604-787c3835535d"), img("1604176354204-9268737828e4")],
    colors: [INDIGO, BLACK],
    sizes: waist(2, 4, 6, 4, 2),
    isNew: true,
    demo: true,
    createdAt: "2026-10-15",
  },
  {
    id: "p15",
    slug: "ripped-slim-jeans",
    name: "Jean Slim Roto",
    nameEn: "Ripped Slim Jeans",
    category: "jeans",
    price: 179_900,
    compareAt: 209_900,
    description: "Jean slim con rotos en rodilla y lavado claro. Elástico para moverte sin restricciones.",
    details: ["Denim stretch 98% algodón", "Rotos hechos a mano", "Fit slim", "Tiro medio"],
    images: [img("1541099649105-f69ad21f3246"), img("1516826957135-700dedea698c")],
    colors: [{ name: "Azul claro", hex: "#8aa2c0" }],
    sizes: waist(1, 3, 3, 2, 0),
    demo: true,
    createdAt: "2026-07-28",
  },
  {
    id: "p16",
    slug: "khaki-cargo-jogger",
    name: "Jogger Cargo Caqui",
    nameEn: "Khaki Cargo Jogger",
    category: "cargos",
    price: 149_900,
    description: "Jogger cargo en twill liviano con puño elástico. El balance entre cómodo y presentable.",
    details: ["Twill de algodón stretch", "Puño elástico", "Bolsillos cargo laterales", "Fit tapered"],
    images: [img("1473966968600-fa801b869a1a"), img("1488161628813-04466f872be2")],
    colors: [SAND],
    sizes: waist(2, 4, 4, 3, 1),
    demo: true,
    createdAt: "2026-08-14",
  },
  {
    id: "p17",
    slug: "summer-short-set",
    name: "Conjunto de Verano",
    nameEn: "Summer Short Set",
    category: "conjuntos",
    price: 159_900,
    description: "Conjunto de pantaloneta: camisa de manga corta + short a juego. Para el calor sin perder el estilo.",
    details: ["Camisa + pantaloneta", "Tela fresca de algodón-lino", "Short con cordón", "Se vende como set"],
    images: [img("1520367445093-50dc08a59d9d"), img("1617952236317-0bd127407984")],
    colors: [WHITE],
    sizes: apparel(2, 4, 4, 2, 0),
    demo: true,
    createdAt: "2026-07-10",
  },
  {
    id: "p18",
    slug: "cuban-link-gold",
    name: "Pulsera Cuban Dorada",
    nameEn: "Cuban Link Gold",
    category: "joyeria",
    price: 169_900,
    compareAt: 199_900,
    description: "Pulsera cuban link en acero con baño de oro 18k. Pesada, gruesa, imposible de ignorar.",
    details: ["Acero 316L con baño oro 18k", "Eslabón 10 mm", "Largo 21 cm", "Cierre box con seguro"],
    images: [img("1602173574767-37ac01994b2a"), img("1606760227091-3dd870d97f1d")],
    colors: [GOLD],
    sizes: one(6),
    demo: true,
    createdAt: "2026-09-18",
  },
  {
    id: "p19",
    slug: "crescent-pendant",
    name: "Dije Media Luna",
    nameEn: "Crescent Pendant",
    category: "joyeria",
    price: 109_900,
    description: "Cadena fina con dije de media luna. Pieza para capas — combínala con la Cadena Plateada.",
    details: ["Acero con baño oro", "Cadena 55 cm", "Dije 2,5 cm", "Hipoalergénico"],
    images: [img("1599643478518-a784e5dc4c8f"), img("1611085583191-a3b181a88401")],
    colors: [GOLD],
    sizes: one(0),
    demo: true,
    createdAt: "2026-06-30",
  },
  {
    id: "p20",
    slug: "twisted-hoops",
    name: "Argollas Trenzadas",
    nameEn: "Twisted Hoops",
    category: "joyeria",
    price: 79_900,
    description: "Argollas trenzadas gruesas con acabado dorado pulido. El detalle que cierra el fit.",
    details: ["Acero 316L baño oro", "Diámetro 18 mm", "Cierre a presión", "Par"],
    images: [img("1617038220319-276d3cfab638"), img("1611591437281-460bfbe1220a")],
    colors: [GOLD],
    sizes: one(8),
    isNew: true,
    demo: true,
    createdAt: "2026-10-10",
  },
  {
    id: "p21",
    slug: "washed-dad-cap",
    name: "Gorra Lavada",
    nameEn: "Washed Dad Cap",
    category: "accesorios",
    price: 69_900,
    description: "Gorra de seis paneles en algodón lavado, visera curva y cierre metálico ajustable.",
    details: ["Algodón lavado", "Visera precurvada", "Correa ajustable metálica", "Talla única"],
    images: [img("1521369909029-2afed882baee"), img("1588850561407-ed78c282e89b")],
    colors: [CEMENT, WHITE],
    sizes: one(14),
    demo: true,
    createdAt: "2026-09-25",
  },
  {
    id: "p22",
    slug: "rib-beanie",
    name: "Gorro Tejido",
    nameEn: "Rib Beanie",
    category: "accesorios",
    price: 49_900,
    description: "Gorro tejido en rib grueso con doblez. Fit ajustado sin apretar.",
    details: ["Acrílico suave", "Tejido rib", "Doblez de 7 cm", "Talla única"],
    images: [img("1576871337632-b9aef4c17ab9"), img("1575428652377-a2d80e2277fc")],
    colors: [BLACK, CEMENT],
    sizes: one(20),
    demo: true,
    createdAt: "2026-08-28",
  },
  {
    id: "p23",
    slug: "daily-backpack",
    name: "Morral Diario",
    nameEn: "Daily Backpack",
    category: "accesorios",
    price: 189_900,
    description: "Morral de lona encerada con compartimento para portátil de 15\" y bolsillo frontal de acceso rápido.",
    details: ["Lona encerada repelente", "Compartimento laptop 15\"", "Espalda acolchada", "Capacidad 22 L"],
    images: [img("1611010344444-5f9e4d86a6e1"), img("1553062407-98eeb64c6a62")],
    colors: [OLIVE, INDIGO],
    sizes: one(5),
    demo: true,
    createdAt: "2026-07-22",
  },
  {
    id: "p24",
    slug: "leather-bifold-wallet",
    name: "Billetera de Cuero",
    nameEn: "Leather Bifold Wallet",
    category: "accesorios",
    price: 89_900,
    description: "Billetera bifold en cuero genuino con seis ranuras para tarjetas. Delgada, cabe en cualquier bolsillo.",
    details: ["Cuero genuino", "6 ranuras + compartimento billetes", "Grosor 1,2 cm", "Envejece con carácter"],
    images: [img("1627123424574-724758594e93"), img("1612902456551-333ac5afa26e")],
    colors: [{ name: "Café", hex: "#6b4226" }],
    sizes: one(7),
    demo: true,
    createdAt: "2026-06-15",
  },
  {
    id: "p25",
    slug: "retro-low-sneakers",
    name: "Tenis Retro Bajos",
    nameEn: "Retro Low Sneakers",
    category: "sneakers",
    price: 289_900,
    description: "Low-top de lona y gamuza con franja lateral. Inspiración skate, comodidad de todos los días.",
    details: ["Lona + gamuza", "Suela waffle de caucho", "Cuello acolchado", "Horma estándar"],
    images: [img("1525966222134-fcfa99b8ae77"), img("1595950653106-6c9ebd614d3a")],
    colors: [{ name: "Vino", hex: "#5a1a22" }],
    sizes: shoe(2, 2, 3, 3, 2, 0),
    isNew: true,
    demo: true,
    createdAt: "2026-10-05",
  },
  {
    id: "p26",
    slug: "stealth-runner",
    name: "Tenis Runner Negros",
    nameEn: "Stealth Runner",
    category: "sneakers",
    price: 379_900,
    description: "Runner all-black con upper de malla técnica y mediasuela de espuma de alto retorno.",
    details: ["Upper malla técnica", "Espuma de alto retorno", "Suela de goma antideslizante", "Horma estándar"],
    images: [img("1491553895911-0055eca6402d"), img("1605348532760-6753d2c43329")],
    colors: [BLACK],
    sizes: shoe(0, 1, 2, 2, 1, 1),
    demo: true,
    createdAt: "2026-09-08",
  },
  {
    id: "p27",
    slug: "noir-oud-fragrance",
    name: "Perfume Noir Oud",
    nameEn: "Noir Oud",
    category: "perfumeria",
    price: 249_900,
    compareAt: 289_900,
    description: "Eau de parfum oscuro y especiado: pimienta negra, cuero y oud ahumado. Para la noche.",
    details: ["Eau de parfum 100 ml", "Notas: pimienta negra, cuero, oud ahumado", "Duración estimada 10 h", "Edición limitada"],
    images: [img("1615634260167-c8cdede054de"), img("1588405748880-12d1d2a59f75")],
    colors: [BLACK],
    sizes: one(4, "100 ML"),
    demo: true,
    createdAt: "2026-09-15",
  },
  {
    id: "p28",
    slug: "black-heavy-crewneck",
    name: "Buzo Negro Pesado",
    nameEn: "Black Heavy Crewneck",
    category: "buzos",
    price: 159_900,
    description: "Buzo crewneck negro de felpa pesada. Minimalista, sin logos gritones, puro peso y caída.",
    details: ["Felpa 360 g/m²", "Cuello, puños y pretina rib", "Fit relaxed", "Prelavado"],
    images: [img("1614495039153-e9cd13240469"), img("1618517351616-38fb9c5210c6")],
    colors: [BLACK],
    sizes: apparel(3, 5, 6, 3, 1),
    isNew: true,
    demo: true,
    createdAt: "2026-10-08",
  },
  {
    id: "p29",
    slug: "cloud-crewneck",
    name: "Buzo Cloud",
    nameEn: "Cloud Crewneck",
    category: "buzos",
    price: 149_900,
    description: "Crewneck blanco hueso de felpa suave. La capa perfecta para noches frías en la ciudad.",
    details: ["Felpa perchada 330 g/m²", "Fit regular", "Costuras planas", "Prelavado"],
    images: [img("1620799140408-edc6dcb6d633"), img("1535295972055-1c762f4483e5")],
    colors: [WHITE],
    sizes: apparel(2, 4, 4, 2, 0),
    demo: true,
    createdAt: "2026-08-08",
  },
  {
    id: "p30",
    slug: "tailored-street-vest",
    name: "Chaleco Sastre Urbano",
    nameEn: "Tailored Street Vest",
    category: "chaquetas",
    price: 149_900,
    description: "Chaleco de corte sastre para mezclar con tees y jeans. El giro elegante del streetwear.",
    details: ["Mezcla poliéster-viscosa", "Forro trasero satinado", "5 botones", "Fit entallado"],
    images: [img("1504593811423-6dd665756598"), img("1580657018950-c7f7d6a6d990")],
    colors: [INDIGO],
    sizes: apparel(1, 2, 3, 1, 0),
    demo: true,
    createdAt: "2026-07-01",
  },
];

/** Real products first, then demo fillers. */
export const products: Product[] = [...realProducts, ...demoProducts];

/* ───────────────────────── helpers ───────────────────────── */

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getProductById = (id: string) => products.find((p) => p.id === id);
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);

export const totalStock = (p: Product) => p.sizes.reduce((n, s) => n + s.stock, 0);
export const isSoldOut = (p: Product) => totalStock(p) === 0;
export const isOnSale = (p: Product) => !!p.compareAt && p.compareAt > p.price;
export const discountPct = (p: Product) =>
  isOnSale(p) ? Math.round((1 - p.price / (p.compareAt as number)) * 100) : 0;
export const stockFor = (p: Product, size: string) => p.sizes.find((s) => s.label === size)?.stock ?? 0;

const DROP_IDS = ["r01", "r03", "r02", "r11", "r04", "r10", "r12", "r06"];
/** The current drop shown on the home page (curated order). */
export const latestDrop = () => DROP_IDS.map((id) => products.find((p) => p.id === id)!).filter(Boolean);

export function relatedProducts(p: Product, n = 4): Product[] {
  const same = products.filter((x) => x.id !== p.id && x.category === p.category);
  const group = categories.find((c) => c.slug === p.category)?.group;
  const sameGroup = products.filter(
    (x) => x.id !== p.id && x.category !== p.category && categories.find((c) => c.slug === x.category)?.group === group,
  );
  const rest = products.filter((x) => x.id !== p.id && !same.includes(x) && !sameGroup.includes(x));
  return [...same, ...sameGroup, ...rest].slice(0, n);
}

/** Sizes that appear anywhere in the catalog, in a sensible order (for filters). */
export const allSizes = Array.from(new Set(products.flatMap((p) => p.sizes.map((s) => s.label))));
