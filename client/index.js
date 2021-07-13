const web3 = new Web3(Web3.givenProvider);

const KITTIES_CONTRACT_ADDRESS = "0xc6A42C7dfbB9BF8eD2F86b59117Bb550eE65160C";

let userAddress;
let kittiesContract;

$(document).ready(function () {
  if (typeof window.ethereum !== "undefined") {
    console.log("MetaMask is installed.");
  } else {
    console.error("MetaMask is inaccessible.");
    return;
  }

  // set up MetaMask event listeners
  ethereum.on("accountsChanged", function (accounts) {
    userAddress = undefined;
    console.warn(
      "MetaMask account has been changed. Please reconnect MetaMask."
    );
    $("#connect-metamask-btn").show();
  });
});

async function connectMetamask() {
  if (typeof window.ethereum == "undefined") {
    alert("MetaMask is inaccessible.");
    return;
  }

  // will start the MetaMask extension
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  userAddress = accounts[0];

  if (accounts.length > 0) {
    console.log("Connected MetaMask.");
    $("#connect-metamask-btn").hide();
  } else {
    // user canceled connection request
    return;
  }

  // load contracts
  kittiesContract = new web3.eth.Contract(
    abiKitties,
    KITTIES_CONTRACT_ADDRESS,
    { from: userAddress }
  );
}
