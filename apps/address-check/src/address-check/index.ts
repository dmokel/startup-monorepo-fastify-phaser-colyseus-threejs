import { isMethodExistC } from '@startup-monorepo-fastify-phaser-colyseus-threejs/address-discrimination';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

const execTransactionABI = [
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
      {
        internalType: 'enum Enum.Operation',
        name: 'operation',
        type: 'uint8',
      },
      { internalType: 'uint256', name: 'safeTxGas', type: 'uint256' },
      { internalType: 'uint256', name: 'baseGas', type: 'uint256' },
      { internalType: 'uint256', name: 'gasPrice', type: 'uint256' },
      { internalType: 'address', name: 'gasToken', type: 'address' },
      {
        internalType: 'address payable',
        name: 'refundReceiver',
        type: 'address',
      },
      { internalType: 'bytes', name: 'signatures', type: 'bytes' },
    ],
    name: 'execTransaction',
    outputs: [{ internalType: 'bool', name: 'success', type: 'bool' }],
    stateMutability: 'payable',
    type: 'function',
  },
] as const;

export class AddressCheckManger {
  private static publicClient = createPublicClient({
    chain: mainnet,
    transport: http('https://eth-mainnet.g.alchemy.com/v2/...'),
  });

  public static async isExecTransactionMethodExist(address: string) {
    const exist = await isMethodExistC(
      this.publicClient,
      `0x${address.slice(2, address.length)}`,
      execTransactionABI,
      'execTransaction',
      [
        '0xfec7443780F800601118288dEd58D339Fd06dAC4',
        33,
        '0x4444',
        0,
        33,
        33,
        33,
        '0xfec7443780F800601118288dEd58D339Fd06dAC4',
        '0xfec7443780F800601118288dEd58D339Fd06dAC4',
        '0x233',
      ],
    );

    return exist;
  }
}
