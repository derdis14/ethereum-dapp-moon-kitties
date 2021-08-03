$(document).ready(function () {
  const breedModal = document.getElementById("breedModal");
  breedModal.addEventListener("hidden.bs.modal", function (event) {
    $("#breed-collection").empty();
  });
});

function appendBreedModal(domId, kittyId) {
  const kittyCopy = $("#catCol" + kittyId).clone();
  const kittyCopyCatContainer = kittyCopy.find(".catContainer");
  kittyCopyCatContainer.addClass("pointer");
  kittyCopyCatContainer.attr(
    "onclick",
    `selectForBreeding("${domId}", "${kittyId}")`
  );
  kittyCopy.appendTo("#breed-collection");
}

function renderBreedCatInfo(domId, kittyId, kittyGen, dnaString) {
  $(`#${domId} ~ * .catId`).html(kittyId);
  $(`#${domId} ~ * .catGen`).html(kittyGen);
  $(`#${domId} ~ * .catDna`).html(dnaString);
}

function resetBreed() {
  $("#breedFemale").empty();
  $("#breedMale").empty();
  $("#nav-breed > .row:first-child > .col:nth-child(3)").remove();

  const emptyCardBody = `
    ID: <span class="catId"></span> GEN:
    <span class="catGen"></span>
    <br />
    DNA: <span class="catDna"></span>
  `;
  $("#breedFemale + .card-body").html(emptyCardBody);
  $("#breedMale + .card-body").html(emptyCardBody);
  $("#breedFemale").removeClass("silverBorder goldBorder");
  $("#breedMale").removeClass("silverBorder goldBorder");

  $("#breedBtn").addClass("disabled");

  $("#breedFemale").addClass("pointer");
  $("#breedMale").addClass("pointer");
  $("#breedFemale").attr("data-bs-toggle", "modal");
  $("#breedMale").attr("data-bs-toggle", "modal");
  $("#breedFemale").attr("onclick", "fillBreedModal(this.id)");
  $("#breedMale").attr("onclick", "fillBreedModal(this.id)");
}
