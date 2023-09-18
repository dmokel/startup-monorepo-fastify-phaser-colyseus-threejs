import Fastify, { FastifyHttpOptions } from 'fastify';
import http from 'http';
import { httpRoutes } from './routes';

export const Server = async (opts?: FastifyHttpOptions<http.Server> | undefined) => {
  const server = await Fastify({
    logger: false,
    ...opts,
  });

  await server.register(httpRoutes);

  return server;
};
