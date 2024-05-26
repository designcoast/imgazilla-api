import * as yup from 'yup';

export const options = yup.object({
  uuid: yup.string(),
  extension: yup.string(),
  name: yup.string(),
  base64Image: yup.string(),
  optimizationPercent: yup.number(),
});

export const imageOptimizationSchema = yup.array().of(options);

export type ImageOptimizationDto = yup.InferType<typeof options>;
