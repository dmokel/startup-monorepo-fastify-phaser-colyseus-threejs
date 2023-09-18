import { RouteShorthandOptionsWithHandler } from 'fastify';
import { AddressCheckManger } from '../../../../address-check';

export const CheckSingleAddressV1: RouteShorthandOptionsWithHandler = {
  handler: async (req) => {
    const address = (req.query as any).address as string;
    if (!address) throw new Error('unexpected empty address');
    const exist = await AddressCheckManger.isExecTransactionMethodExist(address);
    return {
      address: address,
      isExecTransactionMethodExist: exist,
    };
  },
};
