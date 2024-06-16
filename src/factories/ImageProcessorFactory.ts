import * as sharp from 'sharp';
import * as PDFDocument from 'pdfkit';
import { optimize as optimizeSvg } from 'svgo';
import { IMAGE_OPTIMISATION_FORMATS } from '~/constants';

interface ConstraintSettings {
  constraint?: {
    type?: 'SCALE' | 'WIDTH' | 'HEIGHT' | string;
    value?: number;
  };
  format?: string;
  colorProfile?: string;
  suffix?: string;
}

export abstract class ImageProcessor {
  protected buffer: Buffer;
  protected format: string;
  protected optimizationPercent: number;
  protected settings?: ConstraintSettings;

  constructor(
    buffer: Buffer,
    format: string,
    optimizationPercent: number,
    settings?: ConstraintSettings,
  ) {
    this.buffer = buffer;
    this.format = format;
    this.optimizationPercent = optimizationPercent;
    this.settings = settings;
  }

  abstract process(): Promise<Buffer>;

  protected async optimizeImage(image: sharp.Sharp): Promise<sharp.Sharp> {
    if (this.settings?.colorProfile) {
      image = image.toColourspace(this.settings.colorProfile);
    }

    // Add other optimization logic here
    return image;
  }
}

export class PNGProcessor extends ImageProcessor {
  async process(): Promise<Buffer> {
    let image = sharp(this.buffer).png({ quality: this.optimizationPercent });
    image = await this.optimizeImage(image);
    return image.toBuffer();
  }
}

export class JPGProcessor extends ImageProcessor {
  async process(): Promise<Buffer> {
    let image = sharp(this.buffer).jpeg({ quality: this.optimizationPercent });
    image = await this.optimizeImage(image);
    return image.toBuffer();
  }
}

export class SVGProcessor extends ImageProcessor {
  async process(): Promise<Buffer> {
    const optimizedSvg = optimizeSvg(this.buffer.toString('utf-8'), {
      multipass: true,
      floatPrecision: 2,
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              removeViewBox: false,
            },
          },
        },
      ],
    });
    return Buffer.from(optimizedSvg.data, 'utf-8');
  }
}

export class PDFProcessor extends ImageProcessor {
  async process(): Promise<Buffer> {
    const optimizedImageBuffer = await sharp(this.buffer).png().toBuffer();
    const doc = new PDFDocument();
    const buffers: Buffer[] = [];

    doc.on('data', (chunk) => {
      buffers.push(chunk);
    });

    await new Promise<void>((resolve) => {
      doc.on('end', () => {
        resolve();
      });

      doc.image(optimizedImageBuffer, 0, 0, {
        fit: [doc.page.width, doc.page.height],
      });
      doc.end();
    });

    return Buffer.concat(buffers);
  }
}

export class ImageProcessorFactory {
  static getProcessor(
    format: string,
    buffer: Buffer,
    optimizationPercent: number,
    settings?: ConstraintSettings,
  ) {
    switch (format) {
      case IMAGE_OPTIMISATION_FORMATS.PNG:
        return new PNGProcessor(buffer, format, optimizationPercent, settings);
      case IMAGE_OPTIMISATION_FORMATS.JPG:
      case IMAGE_OPTIMISATION_FORMATS.JPEG:
        return new JPGProcessor(buffer, format, optimizationPercent, settings);
      case IMAGE_OPTIMISATION_FORMATS.SVG:
        return new SVGProcessor(buffer, format, optimizationPercent, settings);
      case IMAGE_OPTIMISATION_FORMATS.PDF:
        return new PDFProcessor(buffer, format, optimizationPercent, settings);
      default:
        throw new Error('Unsupported format');
    }
  }
}
