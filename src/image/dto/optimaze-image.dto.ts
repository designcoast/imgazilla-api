import * as yup from 'yup';
import { IMAGE_OPTIMISATION_FORMATS } from '~/constants';

export const imageOptimizationSchema = yup.object({
  outputFormat: yup
    .string()
    .oneOf(Object.values(IMAGE_OPTIMISATION_FORMATS))
    .required(),
  quality: yup.number().required(),
});

export type ImageOptimizationDto = yup.InferType<
  typeof imageOptimizationSchema
>;
