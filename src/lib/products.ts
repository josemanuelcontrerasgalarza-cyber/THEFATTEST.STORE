/**
 * CATALOG
 * - The rest are real THEFATTEST pieces (photos from @thefattest.store).
 *   `priceToConfirm: true` = the price is a placeholder until the owner sets it;
 *   the UI tells shoppers to confirm it on WhatsApp.
 * Stock numbers are per size and must be updated with real counts.
 */

export type CategorySlug = "camisetas" | "buzos" | "conjuntos" | "sneakers";

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


export const categories: Category[] = [
  { slug: "camisetas", label: "Camisetas", group: "clothing", image: "/products/hellstar-records-black.jpg" },
  { slug: "conjuntos", label: "Conjuntos", group: "clothing", image: "/products/jordan-set.jpg" },
  { slug: "buzos", label: "Buzos", group: "clothing", image: "/products/kenzo-tiger.jpg" },
  { slug: "sneakers", label: "Tenis", group: "sneakers", image: "/products/jordan4-thunder.jpg" },
];

export const categoryGroups: Record<string, CategorySlug[]> = {
  clothing: ["camisetas", "buzos", "conjuntos"],
  sneakers: ["sneakers"],
};

const apparel = (s: number, m: number, l: number, xl: number, xxl: number): SizeStock[] => [
  { label: "S", stock: s },
  { label: "M", stock: m },
  { label: "L", stock: l },
  { label: "XL", stock: xl },
  { label: "XXL", stock: xxl },
];
const shoe = (...stock: number[]): SizeStock[] =>
  ["38", "39", "40", "41", "42", "43"].map((label, i) => ({ label, stock: stock[i] ?? 0 }));

const BLACK = { name: "Negro", hex: "#0b0b0b" };
const WHITE = { name: "Blanco", hex: "#f2f2f2" };


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
    price: 120_000,
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
    price: 120_000,
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
    price: 85_000,
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
    price: 85_000,
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
    price: 85_000,
    description: "Camiseta blanca con collage de la Estatua de la Libertad y lettering Godspeed. Pieza statement.",
    details: ["Estampado frontal de gran formato", "Algodón 100%", "Fit regular", "Lavar al revés en frío"],
    images: [local("godspeed-white"), local("godspeed-back")],
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
    price: 120_000,
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
    price: 120_000,
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
    price: 120_000,
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
    price: 120_000,
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
    price: 160_000,
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
    price: 160_000,
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
    price: 175_000,
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
    price: 175_000,
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
    price: 175_000,
    description: "Conjunto de pantaloneta negro: camiseta con swoosh en contorno + short con logo frontal.",
    details: ["Camiseta + pantaloneta", "Short con cordón y bolsillos", "Algodón", "Se vende como set"],
    images: [local("nike-set")],
    colors: [BLACK],
    sizes: apparel(1, 3, 3, 2, 1),
    createdAt: "2026-11-02",
  },
  {
    id: "r15",
    slug: "buzo-off-white-scribble",
    name: "Buzo Off-White Scribble",
    nameEn: "Off-White Scribble Crewneck",
    category: "buzos",
    price: 160_000,
    description: "Buzo negro con logo OFF bordado al frente y gráfico scribble en blanco en la espalda y las mangas.",
    descriptionEn: "Black crewneck with an embroidered OFF logo on the front and a white scribble graphic on the back and sleeves.",
    details: ["Felpa de algodón", "Logo OFF bordado", "Estampado scribble en espalda y mangas", "Fit regular"],
    detailsEn: ["Cotton fleece", "Embroidered OFF logo", "Scribble print on back and sleeves", "Regular fit"],
    images: [local("offwhite-scribble")],
    colors: [BLACK],
    sizes: apparel(2, 3, 4, 3, 1),
    isNew: true,
    createdAt: "2026-11-06",
  },
  {
    id: "r16",
    slug: "buzo-supreme",
    name: "Buzo Supreme",
    nameEn: "Supreme Crewneck",
    category: "buzos",
    price: 160_000,
    description: "Buzo negro con box logo bordado al frente, cuello en contraste blanco y lettering SUPREME gigante en la espalda y las mangas.",
    descriptionEn: "Black crewneck with an embroidered box logo, white contrast collar and giant SUPREME lettering across the back and sleeves.",
    details: ["Felpa de algodón", "Box logo bordado", "Cuello con vivo blanco", "Lettering en espalda y mangas"],
    detailsEn: ["Cotton fleece", "Embroidered box logo", "White-trim collar", "Lettering on back and sleeves"],
    images: [local("supreme-crewneck")],
    colors: [BLACK],
    sizes: apparel(2, 3, 4, 3, 1),
    isNew: true,
    createdAt: "2026-11-06",
  },
  /* ───────── Sneakers (real stock, photos by THEFATTEST) ───────── */
  {
    id: "s01",
    slug: "nike-air-force-1",
    name: "Nike Air Force 1 '07",
    nameEn: "Nike Air Force 1 '07",
    category: "sneakers",
    price: 175_000,
    description: "El clásico de la calle. Capellada en cuero, suela con cámara Air y la silueta que nunca pasa de moda. En blanco, negro o rojo total.",
    descriptionEn: "The street classic. Leather upper, Air-cushioned sole and a silhouette that never goes out of style. In triple white, black or red.",
    details: ["Capellada en cuero", "Suela de caucho con cámara Air", "Perforaciones en la puntera", "Horma estándar"],
    detailsEn: ["Leather upper", "Rubber sole with Air unit", "Perforated toe box", "True to size"],
    images: [local("af1-white"), local("af1-black"), local("af1-red")],
    colors: [{ ...WHITE, image: 0 }, { ...BLACK, image: 1 }, { name: "Rojo", hex: "#c8102e", image: 2 }],
    sizes: shoe(2, 3, 4, 4, 3, 2),
    isNew: true,
    createdAt: "2026-11-06",
  },
  {
    id: "s02",
    slug: "nike-air-max-90",
    name: "Nike Air Max 90",
    nameEn: "Nike Air Max 90",
    category: "sneakers",
    price: 175_000,
    description: "Air Max 90 en negro con paneles en charol, gris jaspeado y detalles fucsia en la cámara de aire y la suela.",
    descriptionEn: "Air Max 90 in black with patent panels, speckled grey and fuchsia accents on the Air unit and outsole.",
    details: ["Malla + charol + sintético", "Cámara Air visible en el talón", "Suela waffle de caucho", "Horma estándar"],
    detailsEn: ["Mesh + patent + synthetic", "Visible heel Air unit", "Rubber waffle outsole", "True to size"],
    images: [local("airmax90")],
    colors: [{ name: "Negro / Gris / Fucsia", hex: "#2b2b2b" }],
    sizes: shoe(1, 2, 3, 3, 2, 1),
    isNew: true,
    createdAt: "2026-11-06",
  },
  {
    id: "s03",
    slug: "air-jordan-13-black-cat",
    name: "Air Jordan 13 Black Cat",
    nameEn: "Air Jordan 13 Black Cat",
    category: "sneakers",
    price: 175_000,
    description: "Todo negro, de pies a cabeza. Upper con textura punteada, ojo holográfico en el tobillo y suela inspirada en la garra de una pantera.",
    descriptionEn: "Blacked out head to toe. Dotted textured upper, holographic eye at the ankle and a panther-paw inspired outsole.",
    details: ["Nobuck sintético + textil punteado", "Ojo holográfico lateral", "Suela tipo garra", "Horma estándar"],
    detailsEn: ["Synthetic nubuck + dotted textile", "Holographic side eye", "Paw-style outsole", "True to size"],
    images: [local("jordan13-blackcat")],
    colors: [BLACK],
    sizes: shoe(1, 2, 3, 3, 2, 1),
    isNew: true,
    createdAt: "2026-11-06",
  },
  {
    id: "s04",
    slug: "air-jordan-4-thunder",
    name: "Air Jordan 4 Thunder",
    nameEn: "Air Jordan 4 Thunder",
    category: "sneakers",
    price: 175_000,
    description: "Negro y amarillo eléctrico. Upper en nobuck, alas laterales y malla en amarillo con cámara Air visible. Imposible no mirarlos.",
    descriptionEn: "Black and electric yellow. Nubuck upper, side wings and yellow mesh with a visible Air unit. Impossible to ignore.",
    details: ["Nobuck sintético", "Alas y malla en amarillo", "Cámara Air visible", "Horma estándar"],
    detailsEn: ["Synthetic nubuck", "Yellow wings and mesh", "Visible Air unit", "True to size"],
    images: [local("jordan4-thunder")],
    colors: [{ name: "Negro / Amarillo", hex: "#f5c400" }],
    sizes: shoe(1, 3, 3, 3, 2, 1),
    isNew: true,
    createdAt: "2026-11-06",
  },
  {
    id: "s05",
    slug: "air-jordan-8-retro",
    name: "Air Jordan 8 Retro",
    nameEn: "Air Jordan 8 Retro",
    category: "sneakers",
    price: 175_000,
    description: "Bota alta con correa cruzada y el gráfico lateral característico del modelo. Disponible en blanco/rojo y en crema/rojo.",
    descriptionEn: "High-top with the cross strap and the model's signature side graphic. Available in white/red and cream/red.",
    details: ["Cuero sintético + gamuza", "Correa cruzada con velcro", "Gráfico lateral en relieve", "Horma estándar"],
    detailsEn: ["Synthetic leather + suede", "Velcro cross strap", "Raised side graphic", "True to size"],
    images: [local("jordan8-white-red"), local("jordan8-cream")],
    colors: [{ name: "Blanco / Rojo", hex: "#e8e8e8", image: 0 }, { name: "Crema / Rojo", hex: "#efe6d2", image: 1 }],
    sizes: shoe(1, 2, 3, 3, 2, 1),
    isNew: true,
    createdAt: "2026-11-06",
  },
  {
    id: "s06",
    slug: "louis-vuitton-skate-sneaker",
    name: "Louis Vuitton Skate Sneaker",
    nameEn: "Louis Vuitton Skate Sneaker",
    category: "sneakers",
    price: 220_000,
    description: "Sneaker skate de suela gruesa, cordones de cuerda y detalles en pedrería sobre negro total. Con su caja.",
    descriptionEn: "Chunky-sole skate sneaker with rope laces and rhinestone details on all black. Comes with its box.",
    details: ["Malla + cuero sintético", "Detalles en pedrería", "Cordones tipo cuerda", "Incluye caja"],
    detailsEn: ["Mesh + synthetic leather", "Rhinestone details", "Rope-style laces", "Box included"],
    images: [local("lv-skate-black")],
    colors: [BLACK],
    sizes: shoe(1, 1, 2, 2, 2, 1),
    isNew: true,
    createdAt: "2026-11-06",
  },
];


export const products: Product[] = realProducts;

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

const DROP_IDS = ["s04", "r01", "s01", "r03", "s03", "r11", "s06", "r12"];
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
