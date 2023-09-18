import { Server } from './server';

export const start = async () => {
  const server = await Server();

  server.listen({ port: 8777, host: '0.0.0.0' }, (err, addr) => {
    if (err) {
      console.log('err:', err);
      process.exit(1);
    }
    console.log(`listening at ${addr}`);
  });
};
