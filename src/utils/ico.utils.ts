import * as sharp from 'sharp';
import { ISourceSet } from '~/favicon/favicon.service';
import {
  BITMAP_SIZE,
  COLOR_MODE,
  DIRECTORY_SIZE,
  HEADER_SIZE,
} from '~/constants';

export const resize = async (
  source: ISourceSet,
  width: number,
  height: number,
) => {
  return await sharp(source.imgBuffer)
    .ensureAlpha()
    .resize({
      width,
      height,
      fit: sharp.fit.contain,
      background: '#00000000',
      kernel: 'lanczos3',
    })
    .toBuffer();
};

export const createBlankImage = (
  width: number,
  height: number,
  background?: string,
) => {
  const transparent = !background || background === 'transparent';

  let image = sharp({
    create: {
      width,
      height,
      channels: transparent ? 4 : 3,
      background: transparent ? '#00000000' : background,
    },
  });

  if (transparent) {
    image = image.ensureAlpha();
  }
  return image;
};

export const createPlane = async (sourceset: ISourceSet, options: any) => {
  const offset =
    Math.round(
      (Math.max(options.width, options.height) * options.offset) / 100,
    ) || 0;
  const width = options.width - offset * 2;
  const height = options.height - offset * 2;

  const image = await resize(sourceset, width, height);

  let pipeline = createBlankImage(
    options.width,
    options.height,
    options.background,
  ).composite([{ input: image, left: offset, top: offset }]);

  if (options.rotate) {
    const degrees = 90;
    pipeline = pipeline.rotate(degrees);
  }

  return pipeline;
};

export const createRawImage = (pipeline: sharp.Sharp) =>
  pipeline
    .toColorspace('srgb')
    .raw({ depth: 'uchar' })
    .toBuffer({ resolveWithObject: true });

const createICOHeader = (numberOfImages: number): Buffer => {
  const buf = Buffer.alloc(HEADER_SIZE);

  buf.writeUInt16LE(0, 0);
  buf.writeUInt16LE(1, 2);
  buf.writeUInt16LE(numberOfImages, 4);
  return buf;
};

const createICOBitmap = (image: any, compression: number) => {
  const buf = Buffer.alloc(BITMAP_SIZE);
  const { width, height } = image.info;

  buf.writeUInt32LE(BITMAP_SIZE, 0);
  buf.writeInt32LE(width, 4);
  buf.writeInt32LE(height * 2, 8);
  buf.writeUInt16LE(1, 12);
  buf.writeUInt16LE(32, 14);
  buf.writeUInt32LE(compression, 16);
  buf.writeUInt32LE(width * height, 20);
  buf.writeInt32LE(0, 24);
  buf.writeInt32LE(0, 28);
  buf.writeUInt32LE(0, 32);
  buf.writeUInt32LE(0, 36);
  return buf;
};

const createDib = (image: any) => {
  const { width, height } = image.info;
  const imageData = image.data;
  const buf = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      const offset = (y * width + x) * 4;
      const pos = ((height - y - 1) * width + x) * 4;

      buf.writeUInt32LE(imageData.readUInt32LE(offset), pos);
    }
  }

  return buf;
};

const createDirectory = (image: any, offset: number) => {
  const buf = Buffer.alloc(DIRECTORY_SIZE);
  const { width, height } = image.info;
  const size = width * height * 4 + BITMAP_SIZE;
  const bpp = 32;

  buf.writeUInt8(width === 256 ? 0 : width, 0);
  buf.writeUInt8(height === 256 ? 0 : height, 1);
  buf.writeUInt8(0, 2);
  buf.writeUInt8(0, 3);
  buf.writeUInt16LE(1, 4);
  buf.writeUInt16LE(bpp, 6);
  buf.writeUInt32LE(size, 8);
  buf.writeUInt32LE(offset, 12);
  return buf;
};

export const createIcoImage = (images: any) => {
  const header = createICOHeader(images.length);
  let arr = [header];

  let offset = HEADER_SIZE + DIRECTORY_SIZE * images.length;

  const bitmaps = images.map((image) => {
    const bitmapHeader = createICOBitmap(image, COLOR_MODE);
    const dib = createDib(image);

    return Buffer.concat([bitmapHeader, dib]);
  });

  for (let i = 0; i < images.length; ++i) {
    const image = images[i];
    const bitmap = bitmaps[i];

    const dir = createDirectory(image, offset);

    arr.push(dir);
    offset += bitmap.length;
  }

  arr = [...arr, ...bitmaps];

  return Buffer.concat(arr);
};
