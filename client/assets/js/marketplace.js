function appendMarketplaceCollectionNew(
  owner,
  priceEther,
  kittyId,
  kittyGen,
  dnaString
) {
  const catCol = jQuery(newCatColumnHtml(kittyId));

  const catColCard = catCol.find(".card");
  const actionHtml = newMarketplaceActionHtml(
    owner,
    priceEther,
    kittyId,
    false
  );
  catColCard.append(actionHtml);

  catCol.appendTo("#marketplace-collection");

  renderCatColumn(kittyId, kittyGen, dnaString);
}

function appendMarketplaceCollectionClone(owner, priceEther, kittyId) {
  const catCol = $("#catCol" + kittyId).clone();
  if (catCol.length <= 0) {
    console.error("appendMarketplaceCollectionClone: object not found.");
    return;
  }

  const catColCard = catCol.find(".card");
  const actionHtml = newMarketplaceActionHtml(owner, priceEther, kittyId, true);
  catColCard.append(actionHtml);

  catCol.appendTo("#marketplace-collection");
}

function newMarketplaceActionHtml(
  owner,
  priceEther,
  kittyId,
  isCancelAction = false
) {
  let actionLabel = "Buy";
  let functionCall = `buyKitty(${kittyId}, ${priceEther})`;
  let color = "primary";

  if (isCancelAction) {
    actionLabel = "Cancel";
    functionCall = `cancelKittyOffer(${kittyId})`;
    color = "secondary";
  }

  const ownerTrimmed = owner.slice(0, 6) + "..." + owner.slice(-4);

  const html = `
    <div
      class="
        row-cols-2
        p-2 p-2
        pb-0
        d-flex
        align-items-center
        border-top
        text-${color}
      "
    >
      <span class="col">Owner:</span>
      <a
        type="button"
        class="col btn btn-link text-${color}"
        href="https://ropsten.etherscan.io/address/${owner}"
        target="_blank"
        rel="noopener noreferrer"
      >
        ${ownerTrimmed}
      </a>
    </div>
    <div class="row-cols-2 p-2 rounded d-flex align-items-center">
      <div class="col text-${color} fw-bold">
        <span class="offerPrice">${priceEther}</span> ETH
      </div>
      <button
        type="button"
        class="col btn btn-${color} light-b-shadow"
        onclick="${functionCall}"
      >
        <b>${actionLabel}</b>
      </button>
    </div>
  `;

  return html;
}

function removeMarketplaceKitty(kittyId) {
  $("#marketplace-collection #catCol" + kittyId).remove();
}
