import * as yup from 'yup';

export const options = yup.object({
  uuid: yup.string(),
  format: yup.string(),
  name: yup.string(),
  base64Image: yup.string(),
  optimizationPercent: yup.number(),
  settings: yup.object({
    colorProfile: yup.string(),
    format: yup.string(),
    suffix: yup.string(),
    constraint: yup.object({
      type: yup.string().oneOf(['SCALE', 'WIDTH', 'HEIGHT']),
      value: yup.number(),
    }),
  }),
});

export const imageOptimizationSchema = yup.array().of(options);

export type ImageOptimizationDto = yup.InferType<typeof options>;
