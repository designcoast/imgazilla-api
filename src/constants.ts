import {
  getIconProperties,
  getIconProperty,
  getOpaqueIconOptions,
} from '~/config/icon.config';
import { IIconOptions } from '~/types';

export const HEADER_SIZE = 6;
export const DIRECTORY_SIZE = 16;
export const COLOR_MODE = 0;
export const BITMAP_SIZE = 40;

// TODO: Add more platforms
export const PLATFORMS = {
  FAVICON: 'default',
  ANDROID: 'android',
  IOS: 'ios',
};

export const IMAGE_OPTIMISATION_FORMATS = {
  JPEG: 'jpeg',
  JPG: 'jpg',
  PNG: 'png',
  WebP: 'webp',
} as const;

export const ICONS_OPTIONS = [
  { name: 'favicon.ico', ...getIconProperties(16, 24, 32, 48, 64) },
  { name: 'favicon-16x16.png', ...getIconProperty(16) },
  { name: 'favicon-32x32.png', ...getIconProperty(32) },
  { name: 'favicon-48x48.png', ...getIconProperty(48) },
  { name: 'favicon.svg', ...getIconProperty(1024) },
] as IIconOptions[];

export const IOS_ICON_OPTIONS = [
  { name: 'apple-touch-icon-57x57.png', ...getOpaqueIconOptions(57) },
  { name: 'apple-touch-icon-60x60.png', ...getOpaqueIconOptions(60) },
  { name: 'apple-touch-icon-72x72.png', ...getOpaqueIconOptions(72) },
  { name: 'apple-touch-icon-76x76.png', ...getOpaqueIconOptions(76) },
  { name: 'apple-touch-icon-114x114.png', ...getOpaqueIconOptions(114) },
  { name: 'apple-touch-icon-120x120.png', ...getOpaqueIconOptions(120) },
  { name: 'apple-touch-icon-144x144.png', ...getOpaqueIconOptions(144) },
  { name: 'apple-touch-icon-152x152.png', ...getOpaqueIconOptions(152) },
  { name: 'apple-touch-icon-167x167.png', ...getOpaqueIconOptions(167) },
  { name: 'apple-touch-icon-180x180.png', ...getOpaqueIconOptions(180) },
  { name: 'apple-touch-icon-1024x1024.png', ...getOpaqueIconOptions(1024) },
  { name: 'apple-touch-icon.png', ...getOpaqueIconOptions(180) },
  { name: 'apple-touch-icon-precomposed.png', ...getOpaqueIconOptions(180) },
];

export const DEFAULT_CREDITS_NUMBER =
  process.env.DEFAULT_CREDITS_NUMBER || '30';
