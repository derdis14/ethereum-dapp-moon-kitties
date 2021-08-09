const web3 = new Web3(Web3.givenProvider);

const KITTIES_CONTRACT_ADDRESS = "0x37a764B324977E05216E3876Ef86ebEeD16A98b9";
const KITTY_MARKETPLACE_CONTRACT_ADDRESS =
  "0x2434a5Ffe46f3C72c1D9EE30a3BEEE2073Cecd2A";

let userAddress = undefined;
let kittiesContract;
let userKitties = [];
let marketplaceContract;

let lastBirthEvent = "";
let lastMarketTransactionEvent = "";

$(document).ready(function () {
  // for off-chain development only:
  //loadKitties(true);

  // close collapsed navbar on any click
  document.addEventListener("click", function () {
    if ($("#navbarNavAltMarkup").hasClass("show") && window.innerWidth < 992) {
      $(".navbar-toggler").click();
    }
  });
  // reset tabs before showing a new tab
  const myKittiesMenu = document.getElementById("menu-my-kitties");
  myKittiesMenu.addEventListener("hidden.bs.tab", function (event) {
    resetBreed();
    resetSell();
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
    console.log("MetaMask connected.");
    $("#connect-metamask-btn").hide();
  } else {
    // user canceled connection request
    return;
  }

  $("#createKittyBtn").removeClass("disabled");

  // load contracts
  kittiesContract = new web3.eth.Contract(
    abi.Kitties,
    KITTIES_CONTRACT_ADDRESS,
    { from: userAddress }
  );
  marketplaceContract = new web3.eth.Contract(
    abi.KittyMarketplace,
    KITTY_MARKETPLACE_CONTRACT_ADDRESS,
    { from: userAddress }
  );

  // set up contract event listeners
  kittiesContract.events.Birth(
    { filter: { owner: userAddress }, fromBlock: "latest" },
    async (error, event) => {
      if (error) {
        console.warn(error);
        return;
      }

      if (isDuplicatedContractEvent("Birth", event.transactionHash)) {
        return;
      }

      const kittyId = event.returnValues.kittyId;
      const genes = event.returnValues.genes;
      const mumId = event.returnValues.mumId;
      const dadId = event.returnValues.dadId;
      const owner = event.returnValues.owner;
      const transactionHash = event.transactionHash;
      onchainAlertMsg(
        "success",
        "New kitty born.",
        `kittyId: ${kittyId}, mumId: ${mumId}, dadId: ${dadId}, genes: ${genes}, owner: ${owner},
        transactionHash: ${transactionHash}`
      );

      // update 'userKitties'
      const kitty = await getKitty(kittyId);
      userKitties.push(kitty);
      // update 'My Kitties' tab
      appendKittiesCollection(kitty.kittyId, kitty.generation, kitty.genes);

      // update 'Breed' tab if currently visible
      if (
        $("#nav-breed-tab").hasClass("active") &&
        $("#nav-my-kitties-tab").hasClass("active")
      ) {
        $("#catCol" + kitty.kittyId)
          .clone()
          .appendTo("#nav-breed > .row:first-child");
      }
    }
  );

  marketplaceContract.events.MarketTransaction(
    { filter: { caller: userAddress }, fromBlock: "latest" },
    async (error, event) => {
      if (error) {
        console.warn(error);
        return;
      }

      if (
        isDuplicatedContractEvent("MarketTransaction", event.transactionHash)
      ) {
        return;
      }

      const txType = event.returnValues.txType;
      const tokenId = event.returnValues.tokenId;

      if (txType == "Create offer") {
        const priceWei = (
          await marketplaceContract.methods.getOffer(tokenId).call()
        ).price;
        const priceEther = web3.utils.fromWei(priceWei, "ether");

        onchainAlertMsg(
          "success",
          "Sell offer created.",
          `kittyId: ${tokenId} price: ${priceEther} ETH`
        );
      }
    }
  );
}

async function createKitty() {
  $("#onchain-alert").empty();

  try {
    let price = "0";
    const owner = (await kittiesContract.methods.owner().call()).toLowerCase();
    if (userAddress != owner) {
      price = await kittiesContract.methods.gen0Price().call();
    }

    const res = await kittiesContract.methods
      .createKittyGen0(getDNAString())
      .send({ value: price });
  } catch (err) {
    onchainAlertMsgDanger(err);
  }
}

function onchainAlertMsgDanger(error) {
  if (error.message === undefined) {
    console.error(error);
  } else {
    onchainAlertMsg("danger", "Action failed.", error.message);
  }
}

function onchainAlertMsg(type, msgConcise, msgDetails) {
  const alertHtml = `
    <div
    class="alert alert-${type} alert-dismissible fade show text-start"
    role="alert"
    >
    <strong>${msgConcise}</strong> ${msgDetails}
    <button
      type="button"
      class="btn-close"
      data-bs-dismiss="alert"
    ></button>
    </div>
  `;
  $("#onchain-alert").html(alertHtml);
  scrollToTop();
}

function scrollToTop() {
  $(window).scrollTop(0);
}

function showNavHomeTab() {
  const tabEl = document.querySelector("#nav-home-tab");
  const tab = new bootstrap.Tab(tabEl);
  tab.show();
}

function myKittiesTabClicked() {
  // set active sub-tab
  const tabEl = document.querySelector("#nav-show-tab");
  const tab = new bootstrap.Tab(tabEl);
  tab.show();

  // asynchronously load kitties of current user from blockchain
  loadKitties();
}

async function loadKitties(useTestKitties = false) {
  // clear 'userKitties'
  userKitties.length = 0;
  $("#kitties-collection").empty();

  if (userAddress === undefined) {
    return;
  }

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

async function fillSelectCatModal(domId) {
  const breedMumId = $("#breedFemale ~ * .catId").html();
  const breedDadId = $("#breedMale ~ * .catId").html();
  const sellCatId = $("#sellCat ~ * .catId").html();
  userKitties.forEach((kitty) => {
    if (
      kitty.kittyId != breedMumId &&
      kitty.kittyId != breedDadId &&
      kitty.kittyId != sellCatId
    )
      appendSelectCatModal(domId, kitty.kittyId);
  });
}

function selectForBreeding(domId, kittyId) {
  renderSelectedCatCol(domId, kittyId);

  $("#selectCatModal").modal("hide");

  if ($("#breedFemale").html() != "" && $("#breedMale").html() != "") {
    $("#breedBtn").removeClass("disabled");
  }
}

function renderSelectedCatCol(domId, kittyId) {
  const selectedCat = userKitties.find((kitty) => kitty.kittyId == kittyId);
  const selectedCatEl = $("#cat" + kittyId);
  if (!selectedCat || selectedCatEl.length == 0) {
    console.error(
      "renderSelectedCatCol: 'selectedCat' or 'selectedCatEl' not found"
    );
    return;
  }
  $("#" + domId).empty();
  $("#" + domId).append(selectedCatEl.clone());

  const dnaObject = getDnaFromString(selectedCat.genes);
  const awardClass = calcCattributesAward(kittyId, dnaObject);
  $("#" + domId).addClass(awardClass);

  renderSelectedCatInfo(
    domId,
    selectedCat.kittyId,
    selectedCat.generation,
    selectedCat.genes
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
    onchainAlertMsgDanger(err);
  }
}

function selectForSale(domId, kittyId) {
  renderSelectedCatCol(domId, kittyId);
  $("#selectCatModal").modal("hide");

  const sellPrice = $("#sellPrice").val();
  const tokenId = $("#sellCat ~ * .catId").html();
  if (tokenId != "" && sellPrice != "" && sellPrice >= 0) {
    $("#sellBtn").removeClass("disabled");
  }
}

async function sellKitty() {
  $("#onchain-alert").empty();
  const tokenId = $("#sellCat ~ * .catId").html();
  const priceStr = $("#sellPrice").val();
  const price = parseFloat(priceStr);
  if (Number.isNaN(price)) {
    console.error("sellKitty: NaN");
    return;
  }
  const priceWeiStr = web3.utils.toWei(String(price), "ether");

  try {
    const marketplaceIsOperator = await kittiesContract.methods
      .isApprovedForAll(userAddress, KITTY_MARKETPLACE_CONTRACT_ADDRESS)
      .call();

    if (!marketplaceIsOperator) {
      onchainAlertMsg(
        "info",
        "Operator status requested.",
        `In order to offer any of your kitties for sale on-chain,
        you must first approve the marketplace smart contract as operator for you.
        The address of that contract is: ${KITTY_MARKETPLACE_CONTRACT_ADDRESS}`
      );
      const res = await kittiesContract.methods
        .setApprovalForAll(KITTY_MARKETPLACE_CONTRACT_ADDRESS, "true")
        .send();
      $("#onchain-alert").empty();
    }

    const res = await marketplaceContract.methods
      .setOffer(priceWeiStr, tokenId)
      .send();

    $("#sellBtn").addClass("disabled");
  } catch (err) {
    onchainAlertMsgDanger(err);
  }
}

// work around for web3 bug firing duplicated events
function isDuplicatedContractEvent(eventName, newTxHash) {
  let lastTxHash;
  switch (eventName) {
    case "Birth":
      lastTxHash = lastBirthEvent;
      lastBirthEvent = newTxHash;
      break;

    case "MarketTransaction":
      lastTxHash = lastMarketTransactionEvent;
      lastMarketTransactionEvent = newTxHash;
      break;

    default:
      console.error("isDuplicatedBirthEvent: eventName unknown.");
      return false;
  }

  if (lastTxHash === newTxHash) {
    //console.log(eventName, "event duplication handled.");
    return true;
  } else {
    return false;
  }
}
