const web3 = new Web3(Web3.givenProvider);

const KITTIES_CONTRACT_ADDRESS = "0x1DD40f7056b0762c1FaB96009635DFca7bF9d29C";

let userAddress = undefined;
let kittiesContract;
let userKitties = [];

$(document).ready(function () {
  // for off-chain development only:
  //loadKitties(true);

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
      if (userAddress !== undefined) {
        //alert("MetaMask account changed. Website will reload.");
        // reload website
        window.location.reload();
      }
    });
  } else {
    console.error("MetaMask is inaccessible.");
  }
});

async function connectMetamask() {
  if (typeof window.ethereum === "undefined") {
    alert("This action requires the MetaMask browser extension.");
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
    .on("data", async (event) => {
      console.log("Birth data!", event);
      const kittyId = event.returnValues.kittyId;
      const genes = event.returnValues.genes;
      const mumId = event.returnValues.mumId;
      const dadId = event.returnValues.dadId;
      const owner = event.returnValues.owner;
      const transactionHash = event.transactionHash;
      onchainAlertMsgSuccess(
        `<strong>Birth successful.</strong>
        kittyId: ${kittyId}, mumId: ${mumId}, dadId: ${dadId}, genes: ${genes}, owner: ${owner},
        transactionHash: ${transactionHash}`
      );

      // update 'userKitties'
      const kitty = await getKitty(kittyId);
      userKitties.push(kitty);

      // update 'My Kitties' and 'Breed' tab
      appendKittiesCollection(kitty.kittyId, kitty.generation, kitty.genes);
      $("#catCol" + kitty.kittyId)
        .clone()
        .appendTo("#nav-breed > .row:first-child");
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

  // load kitties
  await loadKitties();
}

async function createKitty() {
  $("#onchain-alert").empty();

  try {
    let price = "0";
    const owner = (await kittiesContract.methods.owner().call()).toLowerCase();
    console.log(userAddress, owner);
    if (userAddress != owner) {
      price = await kittiesContract.methods.gen0Price().call();
    }

    const res = await kittiesContract.methods
      .createKittyGen0(getDNAString())
      .send({ value: price });
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
  $(window).scrollTop(0);
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
  // clear 'userKitties'
  userKitties.length = 0;
  $("#kitties-collection").empty();

  if (useTestKitties) {
    userKitties = getTestKitties();
  } else {
    // get kitties from blockchain
    const totalTokens = parseInt(
      await kittiesContract.methods.balanceOf(userAddress).call()
    );
    for (let i = 0; i < totalTokens; i++) {
      const tokenId = await kittiesContract.methods
        .tokenOfOwnerByIndex(userAddress, i)
        .call();
      const kitty = await getKitty(tokenId);
      userKitties.push(kitty);
    }
    console.log(userKitties);
  }

  // add kitties to user collection in 'My Kitties' tab
  userKitties.forEach((kitty) => {
    appendKittiesCollection(kitty.kittyId, kitty.generation, kitty.genes);
  });
}

async function getKitty(kittyId) {
  const token = await kittiesContract.methods.getKitty(kittyId).call();
  const kitty = new Kitty(
    kittyId,
    token.genes,
    token.birthTime,
    token.mumId,
    token.dadId,
    token.generation
  );
  return kitty;
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
  renderBreedCatCol(domId, kittyId);

  $("#breedModal").modal("hide");

  if ($("#breedFemale").html() != "" && $("#breedMale").html() != "") {
    $("#breedBtn").removeClass("disabled");
  }
}

function renderBreedCatCol(domId, kittyId) {
  const breedCat = userKitties.find((kitty) => kitty.kittyId == kittyId);
  const breedCatEl = $("#cat" + kittyId);
  if (!breedCat || breedCatEl.length == 0) {
    console.error("renderBreedCatCol: 'breedCat' or 'breedCatEl' not found");
    return;
  }

  $("#" + domId).empty();
  $("#" + domId).append(breedCatEl.clone());
  renderBreedCatInfo(
    domId,
    breedCat.kittyId,
    breedCat.generation,
    breedCat.genes
  );
}

async function breedKitty() {
  $("#onchain-alert").empty();
  const breedMumId = $("#breedFemale ~ * .catId").html();
  const breedDadId = $("#breedMale ~ * .catId").html();

  try {
    const breedCost = await kittiesContract.methods.breedCost().call();
    const res = await kittiesContract.methods
      .breed(breedMumId, breedDadId)
      .send({ value: breedCost });

    $("#breedBtn").addClass("disabled");
    $("#breedFemale").removeClass("pointer");
    $("#breedMale").removeClass("pointer");
    $("#breedFemale").removeAttr("data-bs-toggle");
    $("#breedMale").removeAttr("data-bs-toggle");
    $("#breedFemale").removeAttr("onclick");
    $("#breedMale").removeAttr("onclick");
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
}
