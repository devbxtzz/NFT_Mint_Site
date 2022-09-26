import "./App.css";
import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import contractABI from "./contractABI.json";

const contractAddress = "0x32ED0A6C66D999A6Cb22C60Cd9cf3722690421F5";

function App() {
 
	const [account, setAccount] = useState(null);
	const [isWalletInstalled, setIsWalletInstalled] = useState(false);
  const [NFTContract, setNFTContract] = useState(null);
  // state for whether app is minting or not.
	const [isMinting, setIsMinting] = useState(false);


  useEffect(() => {
		if (window.ethereum) {
			setIsWalletInstalled(true);
		}
	}, []);

  useEffect(() => {
		function initNFTContract() {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setNFTContract(new Contract(contractAddress,contractABI.abi,signer));
		}
		initNFTContract();
	}, [account]);


  async function connectWallet() {
		window.ethereum
			.request({
				method: "eth_requestAccounts",
			})
			.then((accounts) => {
				setAccount(accounts[0]);
			})
			.catch((error) => {
				alert("Something went wrong");
			});
	}
 

    const data = [
      {
        "description": "This is polar bear NFT",
        "image": "https://gateway.pinata.cloud/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/1.png",
        "name": "Polar Bear"
    },
    
    {
        "description": "This is a cow NFT",
        "image": "https://gateway.pinata.cloud/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/2.png",
        "name": "Cow"
    },
    
    {
        "description": "This is a lion NFT",
        "image": "https://gateway.pinata.cloud/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/3.png",
        "name": "Lion"
    },
    
    {
        "description": "This is a fox NFT",
        "image": "https://gateway.pinata.cloud/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/4.png",
        "name": "Fox"
    },
    
    {
        "description": "This is a dog NFT",
        "image": "https://gateway.pinata.cloud/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/5.png",
        "name": "dog"
    },
    ];

    async function withdrawMoney(){
        try {
 
            const response = await NFTContract.withdrawMoney();
            console.log("Received: ", response);
          } catch (err) {
              alert(err);
          }
          
    }

    async function handleMint(tokenURI) {
        setIsMinting(true);
            try {
              const options = {value: ethers.utils.parseEther("0.01")};
              const response = await NFTContract.mintNFT(tokenURI, options);
              console.log("Received: ", response);
            } catch (err) {
                alert(err);
            }
            finally {
              setIsMinting(false);
            }
    }

    if (account === null) {
      return (
        <>
         <div className="container">
           <br/>
          <h1> 🔮 metaschool</h1>
          <h2>NFT Marketplace</h2>
          <p>Buy an NFT from our marketplace.</p>
  
          {isWalletInstalled ? (
            <button onClick={connectWallet}>Connect Wallet</button>
          ) : (
            <p>Install Metamask wallet</p>
          )}
          </div>
          </>
      );
    }

    return (
        <>
            <div className="container">
            <br/>
            <h1> 🔮 metaschool</h1>
          
             <h2>NFT Marketplace</h2>
                {data.map((item, index) => (
                    <div className="imgDiv">
                        <img
                            src={item.url}
                            key={index}
                            alt="images"
                            width={250}
                            height={250}
                        />
                        <button isLoading={isMinting}
                            onClick={() => {
                                eval(item.param);
                            }}
                        >
                            Mint - 0.01 eth
                        </button>
                    </div>
                ))}
                 <button 
                            onClick={() => {
                                withdrawMoney();
                            }}
                        >
                            Withdraw Money from Contract
                 </button>
          
        </div>

        </>
    );
}

export default App;