import { Abi, Address, BaseError, ContractFunctionRevertedError, PublicClient } from 'viem';
import Web3 from 'web3';

/**
 * @description unable to penetrate proxy contracts
 * @param method The param need the format:```transferFrom(address,address,uint256)```
 */
export const isMethodExistA = async (web3: Web3, contractAddress: Address, method: string): Promise<boolean> => {
  try {
    const code = await web3.eth.getCode(contractAddress);
    const methodSignature = web3.eth.abi.encodeFunctionSignature(method);

    return code.indexOf(methodSignature.slice(2, methodSignature.length)) > 0;
  } catch (e: any) {
    return false;
  }
};

/**
 * @description unable to penetrate proxy contracts
 * @param method The param need the format:```{
    inputs: [],
    name: 'getOwners',
    outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function'
  }```
 */
export const isMethodExistB = async (web3: Web3, contractAddress: Address, method: any): Promise<boolean> => {
  try {
    const code = await web3.eth.getCode(contractAddress);
    const methodSignature = web3.eth.abi.encodeFunctionSignature(method);

    return code.indexOf(methodSignature.slice(2, methodSignature.length)) > 0;
  } catch (e: any) {
    return false;
  }
};

/**
 * @description can penetrate proxy contracts
 * @param methodABI The param need the format:```[{
    inputs: [],
    name: 'getOwners',
    outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function'
  }]```, and perform const assertion, that is ```const [] as const```
 */
export const isMethodExistC = async (
  publicClient: PublicClient,
  contractAddress: Address,
  methodABI: Abi,
  functionName: string,
  args?: any[],
) => {
  try {
    await publicClient.simulateContract({
      address: contractAddress,
      abi: methodABI,
      functionName: functionName,
      args: args,
    });
    return true;
  } catch (e: any) {
    if (e instanceof BaseError) {
      if ((e as any).cause instanceof ContractFunctionRevertedError) {
        return true;
      }
    }
    return false;
  }
};
