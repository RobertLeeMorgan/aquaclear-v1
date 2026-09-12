import type { ImageMetadata } from "astro";

export interface ImageItemType {
  src: ImageMetadata;
  alt: string;
}

export interface ButtonType {
  title: string;
  href?: string;
}

export interface RichTextType {
  title: string;
  content: string;
  media?: MediaUnion;
  buttons?: ButtonType[];
}

export interface CardType {
  eyebrow?: string;
  title: string;
  description?: string;
  image?: ImageMetadata;
  href?: string;
}

export interface TestimonialType {
  quote: string;
  author: string;
  role?: string;
  company?: string;
  avatar?: ImageMetadata;
  rating?: number;
}

export type CarouselUnion =
  | ({ type: "card" } & CarouselCardType)
  | ({ type: "image" } & CarouselImageType)
  | ({ type: "video" } & CarouselVideoType)
  | ({ type: "testimonial" } & CarouselTestimonialType)

export interface CarouselCardType {
  card: CardType[];
}

export interface CarouselImageType {
  image: ImageItemType[];
}

export interface CarouselVideoType {
  video: VideoUnion[];
}

export interface CarouselTestimonialType {
  testimonial: TestimonialType[];
}

export interface IconType {
  icon: IconEnum;
  title: string;
}

export interface AccordionGroupType {
  title?: string;
  items: AccordionItemType[];
}

export interface AccordionItemType {
  title: string;
  blocks: AccordionBlockUnion[];
}

export type AccordionBlockUnion =
  | ({ type: "text" } & AccordionBlockTextType)
  | ({ type: "media" } & AccordionBlockMediaType)
  | ({ type: "icons" } & AccordionBlockIconsType)

export interface AccordionBlockTextType {
  heading?: string;
  content: string;
  media?: MediaUnion;
}

export interface AccordionBlockMediaType {
  heading?: string;
  media: MediaUnion;
}

export interface AccordionBlockIconsType {
  heading?: string;
  items: IconType[];
}

export interface StickyGroupType {
  title: string;
  items: StickyCardType[];
}

export interface StickyCardType {
  title: string;
  description?: string;
}

export interface KeyFeatureType {
  icon: string;
  title: string;
  description?: string;
}

export interface SplitContentItemType {
  title: string;
  description: string;
}

export type MediaUnion =
  | ({ type: "image" } & MediaImageType)
  | ({ type: "video" } & MediaVideoType)
  | ({ type: "beforeAfter" } & MediaBeforeAfterType)

export interface MediaImageType {
  src: ImageMetadata;
  alt: string;
}

export interface MediaVideoType {
  video: VideoUnion;
}

export interface MediaBeforeAfterType {
  before: ImageMetadata;
  after: ImageMetadata;
  beforeAlt: string;
  afterAlt: string;
}

export interface ReadMoreType {
  title?: string;
  href?: string;
}

export type VideoUnion =
  | ({ provider: "youtube" } & VideoYoutubeType)
  | ({ provider: "vimeo" } & VideoVimeoType)
  | ({ provider: "html" } & VideoHtmlType)

export interface VideoYoutubeType {
  id: string;
  title?: string;
}

export interface VideoVimeoType {
  id: string;
  title?: string;
}

export interface VideoHtmlType {
  src: string;
  title?: string;
}

export type BannerItemUnion =
  | ({ type: "logo" } & BannerItemLogoType)
  | ({ type: "text" } & BannerItemTextType)

export interface BannerItemLogoType {
  image: ImageMetadata;
  alt: string;
  href?: string;
}

export interface BannerItemTextType {
  text: string;
  href?: string;
}

export type IconEnum =
  | "leaf"
  | "gauge"
  | "wrench"
  | "cpu"
  | "link"
  | "shield"
  | "waves"
  | "truck"
  | "zap"
  | "cog"
  | "fuel"
  | "settings"
  | "hardHat"
  | "scissors"
  | "package"
  | "pickaxe"
  | "anchor"
  | "sprout"
  | "layers"
  | "map"
  | "ship"
  | "check"
  | "badgeCheck"
  | "tractor"
  | "crown"
  | "shipWheel"
  | "bird"
  | "building2"
  | "fish"
  | "treePine"
  | "trees"
  | "flag"
  | "shovel"
  | "recycle"
  | "trophy"
  | "move"
  | "forklift"
  | "medal"
  | "wavesLadder"
  | "landmark"
  | "landPlot"
  | "shieldCheck"
  | "merge"
  | "chevronsUp"
  | "compass"
  | "mountain"
  | "users"

export type ResponsiveProfileEnum =
  | "large"
  | "medium"
  | "small"
  | "thumbnail"

export type ServiceEnum =
  | "weed-cutting"
  | "bulrush-removal"
  | "invasive-species-removal"
  | "blanket-weed-removal"
  | "water-lily-management"
  | "reed-bed-management"
  | "trash-and-debris-removal"
  | "tree-work"
  | "silt-pumping"
  | "excavation-and-ditching"

export interface HeroSection {
  title: string;
  description?: string;
  image: ImageMetadata;
  alt?: string;
  buttons?: ButtonType[];
}

export interface PageHeaderSection {
  eyebrow?: string;
  title: string;
  description?: string;
}

export interface RichTextSection {
  eyebrow?: string;
  title: string;
  content: string;
  media?: MediaUnion;
  buttons?: ButtonType[];
  readMore?: ReadMoreType;
}

export interface RichTextSectionsSection {
  eyebrow?: string;
  title?: string;
  description?: string;
  items: RichTextType[];
  readMore?: ReadMoreType;
}

export interface ContactFormSection {
  eyebrow?: string;
  title?: string;
  description?: string;
}

export interface CardsSection {
  eyebrow?: string;
  title?: string;
  description?: string;
  items: CardType[];
  readMore?: ReadMoreType;
}

export interface CarouselSection {
  eyebrow?: string;
  title?: string;
  description?: string;
  items: CarouselUnion;
  readMore?: ReadMoreType;
}

export interface IconListSection {
  eyebrow?: string;
  title: string;
  description?: string;
  media: MediaUnion;
  alt?: string;
  items: IconType[];
  buttons?: ButtonType[];
  readMore?: ReadMoreType;
}

export interface AccordionSection {
  eyebrow?: string;
  title?: string;
  description?: string;
  groups: AccordionGroupType[];
}

export interface MediaSection {
  eyebrow?: string;
  title?: string;
  description?: string;
  media: MediaUnion;
}

export interface GallerySection {
  eyebrow?: string;
  title?: string;
  description?: string;
  items: MediaUnion[];
}

export interface CtaSection {
  eyebrow?: string;
  title: string;
  description?: string;
  buttons?: ButtonType[];
}

export interface StickyListSection {
  eyebrow?: string;
  title: string;
  description?: string;
  groups: StickyGroupType[];
  buttons?: ButtonType[];
}

export interface KeyFeaturesSection {
  items: KeyFeatureType[];
}

export interface SplitContentSection {
  eyebrow?: string;
  title?: string;
  description?: string;
  items: SplitContentItemType[];
}

export interface MetadataSection {
  title: string;
  client: string;
  location: string;
  date: string;
  services: ServiceEnum[];
  summary: string;
}

export interface BannerSection {
  items: BannerItemUnion[];
}

export type ContentSection =
  | ({ type: "hero" } & HeroSection)
  | ({ type: "pageHeader" } & PageHeaderSection)
  | ({ type: "richTextSection" } & RichTextSection)
  | ({ type: "richTextSections" } & RichTextSectionsSection)
  | ({ type: "contactForm" } & ContactFormSection)
  | ({ type: "cards" } & CardsSection)
  | ({ type: "carouselSection" } & CarouselSection)
  | ({ type: "iconListSection" } & IconListSection)
  | ({ type: "accordionSection" } & AccordionSection)
  | ({ type: "mediaSection" } & MediaSection)
  | ({ type: "gallery" } & GallerySection)
  | ({ type: "cta" } & CtaSection)
  | ({ type: "stickyList" } & StickyListSection)
  | ({ type: "keyFeatures" } & KeyFeaturesSection)
  | ({ type: "splitContent" } & SplitContentSection)
  | ({ type: "metadata" } & MetadataSection)
  | ({ type: "banner" } & BannerSection)
