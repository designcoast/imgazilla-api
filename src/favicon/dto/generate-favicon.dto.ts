import * as yup from 'yup';
import { DEFAULT_OPTIONS } from '~/constants';

const platformsSchema = yup.object().shape({
  default: yup.boolean().default(true),
  iOS: yup.boolean(),
  android: yup.boolean(),
});

export const generateFaviconOptionsSchema = yup.object({
  image: yup.string(),
  websiteName: yup.string().default('imgazilla'),
  themeColor: yup.string().default(DEFAULT_OPTIONS.theme_color),
  bgColor: yup.string().default(DEFAULT_OPTIONS.background),
  platforms: platformsSchema,
});

export type GenerateFaviconOptionsDto = yup.InferType<
  typeof generateFaviconOptionsSchema
>;
