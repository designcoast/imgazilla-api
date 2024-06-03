import { IMAGE_OPTIMISATION_FORMATS } from '~/constants';
import { encode } from 'base64-arraybuffer';

export interface IIconOptions {
  name: string;
  sizes: {
    width: number;
    height: number;
  }[];
  offset: number;
  background: boolean;
  transparent: boolean;
  rotate: boolean;
}

export interface IFaviconImages {
  name: string;
  buffer: Buffer;
}

export type OutputFormat =
  (typeof IMAGE_OPTIMISATION_FORMATS)[keyof typeof IMAGE_OPTIMISATION_FORMATS];

export interface ImageOptimizationResult {
  uuid: string;
  name: string;
  base64Image: string;
  optimizedImageSize: number;
  format: string;
  sourceImageSize: number;
  pdfBuffer?: string;
}
