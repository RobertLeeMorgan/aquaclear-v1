import type { ImageMetadata } from "astro";

export interface ImageItemType {
  src: ImageMetadata;
  alt: string;
}

export interface ButtonType {
  title: string;
  href?: string;
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
  | "boat"
  | "anchor"
  | "leaf"
  | "wave"

export type ResponsiveProfileEnum =
  | "large"
  | "medium"
  | "small"
  | "thumbnail"

export interface HeroSection {
  title: string;
  description?: string;
  image: ImageMetadata;
  alt?: string;
  buttons?: ButtonType[];
}

export interface RichTextSection {
  eyebrow?: string;
  title: string;
  content: string;
  media?: MediaUnion;
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
}

export interface CarouselSection {
  eyebrow?: string;
  title?: string;
  description?: string;
  carousel: CarouselUnion;
}

export interface IconListSection {
  eyebrow?: string;
  title: string;
  description?: string;
  media: MediaUnion;
  alt?: string;
  items: IconType[];
  buttons?: ButtonType[];
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

export interface BannerSection {
  items: BannerItemUnion[];
}

export type ContentSection =
  | ({ type: "hero" } & HeroSection)
  | ({ type: "richTextSection" } & RichTextSection)
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
  | ({ type: "banner" } & BannerSection)
