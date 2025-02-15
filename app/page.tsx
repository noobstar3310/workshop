// "use client";
// import Navbar from "./components/Navbar";
// import { useEffect, useState } from "react";
// import abi from "../config/abi.json";
// import { ethers } from "ethers";

// export default function Home() {
//   const contractadd = "0xb459e9195Fd3298A047731E204FFF390B9666AdA";
//   const [address, setAddress] = useState("");
//   const [contract, setContract] = useState(null);
//   useEffect(() => {
//     async function initialize() {
//       if (typeof window.ethereum !== undefined) {
//         const provider = new ethers.providers.Web3Provider(window.ethereum);
//         const signer = provider.getSigner();
//         const address = await signer.getAddress();
//         const contract = new ethers.Contract(contractadd, abi, signer);
//         setAddress(address);
//         setContract(contract);
//       }
//     }
//     initialize();
//   });
//   console.log(address);
//   return (
//     <main>
//       <Navbar />
//       <p>My Add: {address}</p>
//     </main>
//   );
// }
"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function Home() {
  const [walletAddress, setWalletAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      setIsLoading(true);
      try {
        // First check if MetaMask is locked
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        // Request account access - this will prompt MetaMask to unlock if it's locked
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        if (accounts && accounts.length > 0) {
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          setWalletAddress(address);
          console.log("Connected to:", address);
        } else {
          alert("Please unlock MetaMask and select an account");
        }
      } catch (error: any) {
        if (error.code === 4001) {
          // User rejected the connection
          alert("Please connect your MetaMask wallet");
        } else if (error.code === -32002) {
          // MetaMask is already processing a request
          alert("Please open MetaMask and accept the connection request");
        } else {
          console.error("Error:", error);
          alert(
            "Error connecting to MetaMask. Please make sure it's unlocked and try again."
          );
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  useEffect(() => {
    // Check if MetaMask is installed and get initial connection status
    const checkConnection = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    };

    // checkConnection();

    // Handle account changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", function (accounts: string[]) {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        } else {
          setWalletAddress("");
        }
      });

      // Handle chain changes
      window.ethereum.on("chainChanged", function () {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", () => {});
        window.ethereum.removeListener("chainChanged", () => {});
      }
    };
  }, []);

  return (
    <div className="p-4">
      <button
        onClick={connectWallet}
        disabled={isLoading}
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
          ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isLoading
          ? "Connecting..."
          : walletAddress
          ? "Connected"
          : "Connect Wallet"}
      </button>

      {walletAddress && (
        <p className="mt-4">Connected Wallet: {walletAddress}</p>
      )}
    </div>
  );
}
