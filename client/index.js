const web3 = new Web3(Web3.givenProvider);

const KITTIES_CONTRACT_ADDRESS = "0xc6A42C7dfbB9BF8eD2F86b59117Bb550eE65160C";

let userAddress;
let kittiesContract;
let userKitties;

$(document).ready(function () {
  // TODO: remove (this is for development only)
  loadKitties(true);

  // close collapsed navbar on any click
  document.addEventListener("click", function () {
    if ($("#navbarNavAltMarkup").hasClass("show") && window.innerWidth < 992) {
      $(".navbar-toggler").click();
    }
  });
  // reset 'Breed' tab before showing
  const breedTab = document.getElementById("nav-breed-tab");
  breedTab.addEventListener("shown.bs.tab", function (event) {
    resetBreed();
  });

  // set up MetaMask event listener
  if (typeof window.ethereum !== "undefined") {
    console.log("MetaMask is installed.");
    ethereum.on("accountsChanged", function (accounts) {
      userAddress = undefined;
      console.warn(
        "MetaMask account has been changed. Please reconnect MetaMask."
      );
      resetMetamaskBtn();
    });
  } else {
    console.error("MetaMask is inaccessible.");
  }
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

function showMyKittiesStartTab() {
  const tabEl = document.querySelector("#nav-show-tab");
  const tab = new bootstrap.Tab(tabEl);
  tab.show();
}

async function loadKitties(useTestKitties = false) {
  if (useTestKitties) {
    userKitties = getTestKitties();
  } else {
    // TODO: get kitties from blockchain
  }

  // add kitties to user collection in 'My Kitties' tab
  userKitties.forEach((kitty) => {
    appendKittiesCollection(kitty.kittyId, kitty.generation, kitty.genes);
  });
}

function getTestKitties() {
  testKitties = [
    new Kitty("1", "60842070003200", "0", "0", "0", "0"),
    new Kitty("2", "15873571102911", "0", "0", "0", "1"),
    new Kitty("3", "20842670103720", "0", "0", "0", "0"),
    new Kitty("4", "60492871002232", "0", "0", "0", "2"),
    new Kitty("5", "11072791113921", "0", "0", "0", "3"),
    new Kitty("6", "30843570011201", "0", "0", "0", "2"),
    new Kitty("7", "70841290111002", "0", "0", "0", "1"),
  ];
  return testKitties;
}

class Kitty {
  constructor(kittyId, genes, birthTime, mumId, dadId, generation) {
    this.kittyId = kittyId;
    this.genes = genes;
    this.birthTime = birthTime;
    this.mumId = mumId;
    this.dadId = dadId;
    this.generation = generation;
  }
}

async function fillBreedModal(domId) {
  const breedMumId = $("#breedFemale ~ * .catId").html();
  const breedDadId = $("#breedMale ~ * .catId").html();
  userKitties.forEach((kitty) => {
    if (kitty.kittyId != breedMumId && kitty.kittyId != breedDadId)
      appendBreedModal(domId, kitty.kittyId);
  });
}

function selectForBreeding(domId, kittyId) {
  const selectedKitty = userKitties.find((kitty) => kitty.kittyId == kittyId);
  if (!selectedKitty) {
    console.error("selectForBreeding: 'selectedKitty' not found");
    return;
  }

  renderBreedCatInfo(
    domId,
    selectedKitty.kittyId,
    selectedKitty.generation,
    selectedKitty.genes
  );
  $("#" + domId).empty();
  $("#" + domId).append($("#cat" + kittyId).clone());

  $("#breedModal").modal("hide");

  if ($("#breedFemale").html() != "" && $("#breedMale").html() != "") {
    $("#breedMultiplyBtn").removeClass("disabled");
  }
}
