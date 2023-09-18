import { start } from './api';

process.on('unhandledRejection', (err) => {
  console.log('unhandledRejection, err:', err);

  process.exit(1);
});

const setup = async () => {};

setup().then(() => start());
