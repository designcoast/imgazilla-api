import { IIconConfig, IIconOptions } from '~/types';

export function getIconProperty(width: number, height?: number) {
  return {
    sizes: [{ width, height: height ?? width }],
    offset: 0,
    background: false,
    transparent: true,
    rotate: false,
  };
}

export function getIconProperties(...sizes: number[]) {
  return {
    sizes: sizes.map((size) => ({ width: size, height: size })),
    offset: 0,
    background: false,
    transparent: true,
    rotate: false,
  };
}

export const getIconOptions = (options: IIconOptions & IIconConfig) =>
  options.sizes.map((size) => ({
    ...size,
    offset: options.offset ?? 0,
    background:
      options.backgroundColor !== '' ? options.backgroundColor : undefined,
    transparent: options.transparent,
    rotate: options.rotate,
  }));

export function getOpaqueIconOptions(width: number, height?: number) {
  return {
    sizes: [{ width, height: height ?? width }],
    offset: 0,
    background: true,
    transparent: false,
    rotate: false,
  };
}
