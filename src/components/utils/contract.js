import { Contract } from 'ethers';
import ContractABI from '../../abis/ContentPlatform.json';

const contractAddress = 'Deployed_Contract_Address';

export const getContract = (signer) => {
  return new Contract(contractAddress, ContractABI.abi, signer);
};
