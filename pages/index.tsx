import { FC, useState } from "react";
import { ethers } from "ethers";
import erc20Abi from '../contracts/erc20.json'
import erc721Abi from '../contracts/erc721.json'
const Index: FC = () => {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();
  const [account, setAccount] = useState<string>();
  let [Contract, setContract] = useState<any>();
  let [TokenContract, setTokenContract] = useState<any>();
  const [tokenBalance, setTokenBalance] = useState<string>();
  const [approvedToken, setAllowance] = useState<any>(0);
  const TOKEN_ADDR = "0x42EBA1d39F133dcE76f073F954BF69E6BCB898D1";
  const CONTRACT_ADDR = "0x94Ae991864EC4B9aCc4800bA312647B0E0993cB7";
  const connect = async () => {
    if (!window.ethereum?.request) {
      alert("MetaMask is not installed!");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setProvider(provider);
    setAccount(accounts[0]);
    if (provider && account) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner();
      const token = new ethers.Contract(TOKEN_ADDR, erc20Abi, signer);
      const nftContract = new ethers.Contract(CONTRACT_ADDR, erc721Abi, signer);
      setTokenContract(TokenContract = token)
      setContract(Contract = nftContract)
      console.log(Contract)
      console.log(TokenContract)
      allowance(account)
    }
  };

  const getTokenBalance = async () => {
    if (provider && account) {

        console.log(TokenContract)

      const rawBalance = await TokenContract.balanceOf(account);
      const decimals = await TokenContract.decimals();

      const balance = ethers.utils.formatUnits(rawBalance, decimals);
      setTokenBalance(balance);
    }
  };
  const approve = async () => {
    console.log(TokenContract)
    try{

       await TokenContract?.approve(CONTRACT_ADDR, "1000000000000000000000000000")
       setAllowance(100000000000000)
    }
catch(error){
  console.log(error)
}
  }
  const allowance = async (account: any) => {

    setAllowance((await TokenContract.allowance(account, CONTRACT_ADDR)).toString())
  }
  const buyNFT = async () => {
    const txHash = await Contract.mint(account);
    alert("nft minting ...:" + txHash.hash);
    alert("100 Token sent to :" +CONTRACT_ADDR);
    console.log(txHash)
  }
  return (
    <>
      <button onClick={connect}>Connect</button>
      <p>Account: {account}</p>
      <button onClick={getTokenBalance}>Get Token Balance</button>
      <p>Token Balance: {tokenBalance}</p>
      <div>
        {approvedToken <= 0 ? <button onClick={approve}>Approve</button> : <button onClick={buyNFT}>BUY NFT</button>}
      </div>
    </>
  );
};

export default Index;
