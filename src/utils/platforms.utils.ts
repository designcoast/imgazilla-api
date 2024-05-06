import {
  ANDROID_ICONS_OPTIONS,
  ICONS_OPTIONS,
  IOS_ICON_OPTIONS,
  PLATFORMS,
} from '~/constants';

export const getPlatformOptions = (platformName: string) => {
  const platforms = {
    [PLATFORMS.FAVICON]: () => ICONS_OPTIONS,
    [PLATFORMS.ANDROID]: () => ANDROID_ICONS_OPTIONS,
    [PLATFORMS.IOS]: () => IOS_ICON_OPTIONS,
  };

  return platforms[platformName]();
};
