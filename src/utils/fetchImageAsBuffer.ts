import axios from 'axios';

/**
 * Utility function to fetch an image by URL and return it as a Buffer
 * @param url - The URL of the image to fetch
 * @returns Promise<Buffer> - The image data as a Buffer
 */
export const fetchImageAsBuffer = async (url: string): Promise<Buffer> => {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
    });
    return Buffer.from(response.data);
  } catch (error) {
    throw new Error(`Failed to fetch image from URL: ${error.message}`);
  }
};
