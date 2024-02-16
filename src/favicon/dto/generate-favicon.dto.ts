import * as yup from 'yup';
import { PLATFORMS } from '~/constants';

export const generateFaviconOptionsSchema = yup.object({
  appName: yup.string().required(),
  themeColor: yup.string().required(),
  platforms: yup
    .array()
    .of(yup.string().oneOf(Object.values(PLATFORMS)).min(1).required())
    .required(),
});

export type GenerateFaviconOptionsDto = yup.InferType<
  typeof generateFaviconOptionsSchema
>;
