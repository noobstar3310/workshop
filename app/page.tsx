"use client";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import abi from "../config/abi.json";
import { ethers } from "ethers";

export default function Home() {
  const contractadd = "0xb459e9195Fd3298A047731E204FFF390B9666AdA";
  const [address, setAddress] = useState("");
  const [contract, setContract] = useState(null);
  const [fundamount, setfundamount] = useState("");
  const [withdrawamount, setwithdrawamount] = useState("");
  const [balance, setbalance] = useState("");
  useEffect(() => {
    async function initialize() {
      if (typeof window.ethereum !== undefined) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const contract = new ethers.Contract(contractadd, abi, signer);
        setAddress(address);
        setContract(contract);
      }
    }
    initialize();
  });
  async function fund() {
    const log = await contract?.fund({ value: fundamount });
    console.log(log);
  }

  async function withdraw() {
    const log = await contract?.withdraw(withdrawamount);
    console.log(log);
  }

  async function getBalance() {
    const log = await contract?.getBalance();
    console.log(log);
    setbalance(log.toString());
  }

  getBalance();
  return (
    <main>
      <Navbar />
      <div className="flex justify-center text-center flex-col">
        <div className="flex space-x-5 my-2">
          <p>Fund</p>
          <input
            type="number"
            onChange={(e) => {
              setfundamount(e.target.value);
            }}
            className="border-black outline none"
          ></input>
          <button
            onClick={fund}
            className="bg-blue-600 text-white px-3 py-2 rounded-lg"
          >
            Deposit here
          </button>
          <p>Withdraw</p>
          <input
            type="number"
            onChange={(e) => {
              setwithdrawamount(e.target.value);
            }}
            className="border-black outline none"
          ></input>
          <button
            onClick={withdraw}
            className="bg-blue-600 text-white px-3 py-2 rounded-lg"
          >
            Withdraw here
          </button>
        </div>
        <div>My Balance: {balance}</div>
      </div>
      <p>My Add: {address}</p>
    </main>
  );
}
