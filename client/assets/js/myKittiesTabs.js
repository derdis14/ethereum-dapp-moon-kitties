const EMPTY_CARD_BODY = `
  ID: <span class="catId"></span> GEN:
  <span class="catGen"></span>
  <br />
  DNA: <span class="catDna"></span>
`;

$(document).ready(function () {
  const selectCatModal = document.getElementById("selectCatModal");
  selectCatModal.addEventListener("hidden.bs.modal", function (event) {
    $("#select-cat-collection").empty();
  });
});

$("#sellPrice").change(() => {
  const sellPrice = $("#sellPrice").val();
  const tokenId = $("#sellCat ~ * .catId").html();
  if (tokenId != "" && sellPrice != "" && sellPrice >= 0) {
    $("#sellBtn").removeClass("disabled");
  } else {
    $("#sellBtn").addClass("disabled");
  }
});

function appendSelectCatModal(domId, kittyId) {
  const kittyCopy = $("#catCol" + kittyId).clone();
  const kittyCopyCatContainer = kittyCopy.find(".catContainer");
  kittyCopyCatContainer.addClass("pointer");

  let functionName = "selectForBreeding";
  if (domId == "sellCat") {
    functionName = "selectForSale";
  }
  kittyCopyCatContainer.attr(
    "onclick",
    `${functionName}("${domId}", "${kittyId}")`
  );

  kittyCopy.appendTo("#select-cat-collection");
}

function renderSelectedCatInfo(domId, kittyId, kittyGen, dnaString) {
  $(`#${domId} ~ * .catId`).html(kittyId);
  $(`#${domId} ~ * .catGen`).html(kittyGen);
  $(`#${domId} ~ * .catDna`).html(dnaString);
}

function resetBreed() {
  $("#breedFemale").empty();
  $("#breedMale").empty();
  $("#nav-breed > .row:first-child > .col:nth-child(3)").remove();

  $("#breedFemale + .card-body").html(EMPTY_CARD_BODY);
  $("#breedMale + .card-body").html(EMPTY_CARD_BODY);
  $("#breedFemale").removeClass("silverBorder goldBorder");
  $("#breedMale").removeClass("silverBorder goldBorder");

  $("#breedBtn").addClass("disabled");

  $("#breedFemale").addClass("pointer");
  $("#breedMale").addClass("pointer");
  $("#breedFemale").attr("data-bs-toggle", "modal");
  $("#breedMale").attr("data-bs-toggle", "modal");
  $("#breedFemale").attr("onclick", "fillSelectCatModal(this.id)");
  $("#breedMale").attr("onclick", "fillSelectCatModal(this.id)");
}

function resetSell() {
  $("#sellCat").empty();
  $("#sellPrice").val("");

  $("#sellCat + .card-body").html(EMPTY_CARD_BODY);
  $("#sellCat").removeClass("silverBorder goldBorder");

  $("#sellBtn").addClass("disabled");
  $("#sellPrice").removeAttr("disabled");

  $("#sellCat").addClass("pointer");
  $("#sellCat").attr("data-bs-toggle", "modal");
  $("#sellCat").attr("onclick", "fillSelectCatModal(this.id)");
}
