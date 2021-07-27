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
    resetMetamaskBtn();
  });
});

function resetMetamaskBtn() {
  $("#connect-metamask-btn").show();
  $(window).scrollTop(0);
}

async function connectMetamask() {
  if (typeof window.ethereum == "undefined") {
    alert("MetaMask is inaccessible.");
    return;
  }

  $("#onchain-alert").empty();

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

  // set up contract event listeners
  kittiesContract.events
    .Birth({ filter: { owner: userAddress } })
    .on("data", function (event) {
      console.log("Birth data!", event);
      const kittyId = event.returnValues.kittyId;
      const genes = event.returnValues.genes;
      const mumId = event.returnValues.mumId;
      const dadId = event.returnValues.dadId;
      const owner = event.returnValues.owner;
      const transactionHash = event.transactionHash;
      onchainAlertMsgSuccess(
        `<strong>Birth successful.</strong>
        kittyId: ${kittyId}, genes: ${genes}, mumId: ${mumId}, dadId: ${dadId}, owner: ${owner},
        transactionHash: ${transactionHash}`
      );
    })
    .on("connected", function (subscriptionId) {
      console.log("Birth connected!", subscriptionId);
    })
    .on("changed", function (event) {
      console.log("Birth changed!", event);
    })
    .on("error", function (error, receipt) {
      console.error("Birth error!", error);
    });
}

async function createKitty() {
  $("#onchain-alert").empty();
  try {
    let price = "0";
    const owner = await kittiesContract.methods.owner().call();
    if (userAddress != owner) {
      price = await kittiesContract.methods.gen0Price().call();
    }

    const res = await kittiesContract.methods
      .createKittyGen0(getDNAString())
      .send({ value: price });
    return res;
  } catch (err) {
    console.error(err);
    onchainAlertMsgDanger(
      `<strong>Action failed.</strong> ${
        userAddress === undefined
          ? "Please connect MetaMask!"
          : "See console log for details!"
      }`
    );
  }
  $(window).scrollTop(0);
}

function onchainAlertMsgSuccess(msg) {
  onchainAlertMsg("success", msg);
}

function onchainAlertMsgDanger(msg) {
  onchainAlertMsg("danger", msg);
}

function onchainAlertMsg(type, msg) {
  const alertHtml = `
    <div
    class="alert alert-${type} alert-dismissible fade show text-start"
    role="alert"
    >
    ${msg}
    <button
      type="button"
      class="btn-close"
      data-bs-dismiss="alert"
    ></button>
    </div>
  `;

  $("#onchain-alert").html(alertHtml);
}

function showNavHomeTab() {
  const tabEl = document.querySelector("#nav-home-tab");
  const tab = new bootstrap.Tab(tabEl);
  tab.show();
}

// close collapsed navbar on any click
$(document).ready(function () {
  document.addEventListener("click", function () {
    if ($("#navbarNavAltMarkup").hasClass("show") && window.innerWidth < 992) {
      $(".navbar-toggler").click();
    }
  });
});

function showMyKittiesStartTab() {
  const tabEl = document.querySelector("#nav-show-tab");
  const tab = new bootstrap.Tab(tabEl);
  tab.show();
}
