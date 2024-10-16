import * as yup from 'yup';

export const options = yup.object({
  image: yup.string(),
});

export const backgroundRemovalSchema = options;

export type BackgroundRemovalDto = yup.InferType<typeof options>;
export type BackgroundRemovalMetadata = {
  figmaID: string;
};
