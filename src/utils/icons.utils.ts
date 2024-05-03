import * as sharp from 'sharp';
import { ISourceSet } from '~/favicon/favicon.service';
import {
  BITMAP_SIZE,
  COLOR_MODE,
  DIRECTORY_SIZE,
  HEADER_SIZE,
} from '~/constants';

const svgDensity = (
  metadata: sharp.Metadata,
  width: number,
  height: number,
) => {
  if (!metadata.width || !metadata.height) {
    return undefined;
  }
  const currentDensity = metadata.density ?? 72;
  return Math.min(
    Math.max(
      1,
      currentDensity,
      (currentDensity * width) / metadata.width,
      (currentDensity * height) / metadata.height,
    ),
    100000,
  );
};

export const resize = async (
  source: ISourceSet,
  width: number,
  height: number,
) => {
  if (source.metadata.format === 'svg') {
    const options = {
      density: svgDensity(source.metadata, width, height),
    };
    return await sharp(source.imgBuffer, options)
      .resize({
        width,
        height,
        fit: sharp.fit.contain,
        background: '#00000000',
      })
      .toBuffer();
  }
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
    for (let x = 0; x < height; ++x) {
      const offset = (y * width + x) * 4;
      const r = imageData.readUInt8(offset);
      const g = imageData.readUInt8(offset + 1);
      const b = imageData.readUInt8(offset + 2);
      const a = imageData.readUInt8(offset + 3);
      const pos = (height - y - 1) * width + x;

      buf.writeUInt8(b, pos * 4);
      buf.writeUInt8(g, pos * 4 + 1);
      buf.writeUInt8(r, pos * 4 + 2);
      buf.writeUInt8(a, pos * 4 + 3);
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

export const createIcoImage = (
  images: {
    data: Buffer;
    info: sharp.OutputInfo;
  }[],
) => {
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

export const createPngImage = (pipeline: sharp.Sharp): Promise<Buffer> =>
  pipeline.png().toBuffer();

export const createSvgImage = async (
  source: ISourceSet,
  options: any,
): Promise<any> => {
  const { width, height } = options;

  if (source.metadata.format === 'svg') {
    return source.imgBuffer;
  } else {
    const pipeline = await createPlane(source, options);
    const png = await createPngImage(pipeline);
    const encodedPng = png.toString('base64');
    return Buffer.from(`
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
          <image width="${width}" height="${height}" xlink:href="data:image/png;base64,${encodedPng}"/>
        </svg>`);
  }
};
