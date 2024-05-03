import * as yup from 'yup';

const platformsSchema = yup.object().shape({
  default: yup.boolean().default(true),
  iOS: yup.boolean(),
  android: yup.boolean(),
});

export const generateFaviconOptionsSchema = yup.object({
  websiteName: yup.string().default('imgazilla'),
  themeColor: yup.string().default('#FFFFFF'),
  platforms: platformsSchema,
});

export type GenerateFaviconOptionsDto = yup.InferType<
  typeof generateFaviconOptionsSchema
>;
