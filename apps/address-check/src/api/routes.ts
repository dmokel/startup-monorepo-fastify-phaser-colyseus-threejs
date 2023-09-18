import { FastifyInstance } from 'fastify';
import * as addressCheckEndpoints from './endpoints/address-check';

export const httpRoutes = async (server: FastifyInstance) => {
  server.get('/', () => {
    return `Address Check Server ${new Date()}`;
  });

  server.get('/address-check/single-address/v1', addressCheckEndpoints.CheckSingleAddressV1);
};
