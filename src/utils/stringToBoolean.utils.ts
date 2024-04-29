/* eslint-disable prettier/prettier */

export const stringToBoolean = (value: string | boolean) => {
  try {
    if (typeof value === 'boolean') {
      return value;
    }

    if (value === 'false') {
      return false;
    }

    if (value === 'true') {
      return true;
    }
  } catch (err) {
    throw new Error('Invalid input string');
  }
};
