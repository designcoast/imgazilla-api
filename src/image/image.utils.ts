import { Sharp } from 'sharp';
import { IMAGE_OPTIMISATION_FORMATS } from '~/constants';
import { OutputFormat } from '~/types';

export const getImageOptimizationFnByFormat = (format: OutputFormat) => {
  const optimizationFnMap = {
    [IMAGE_OPTIMISATION_FORMATS.PNG]: (
      imageProcessor: Sharp,
      quality: number,
    ) => imageProcessor.png({ quality }),
  };

  return optimizationFnMap[format];
};
