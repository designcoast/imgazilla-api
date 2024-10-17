export const gradioClient = async (): Promise<any> => {
  const importDynamic = new Function('modulePath', 'return import(modulePath)');

  const { Client } = await importDynamic('@gradio/client');

  return await Client.connect('http://localhost:7000/');
};
