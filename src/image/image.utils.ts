import { Sharp } from 'sharp';
import { IMAGE_OPTIMISATION_FORMATS } from '~/constants';
import { OutputFormat } from '~/types';

export const getImageOptimizationFnByFormat = (format: OutputFormat) => {
  const optimizationFnMap = {
    [IMAGE_OPTIMISATION_FORMATS.PNG]: (
      imageProcessor: Sharp,
      quality: number,
    ) => imageProcessor.png({ quality }),
    [IMAGE_OPTIMISATION_FORMATS.JPG]: (
      imageProcessor: Sharp,
      quality: number,
    ) => imageProcessor.jpeg({ quality }),
    // [IMAGE_OPTIMISATION_FORMATS.SVG]: (
    //   imageProcessor: Sharp,
    //   quality: number,
    // ) => imageProcessor.jpeg({ quality }),
  };

  return optimizationFnMap[format];
};
