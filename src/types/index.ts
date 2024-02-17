export interface IIconOptions {
  name: string;
  sizes: {
    width: number;
    height: number;
  }[];
  offset: number;
  background: boolean;
  transparent: boolean;
  rotate: boolean;
}

export interface IFaviconImages {
  name: string;
  buffer: Buffer;
}
