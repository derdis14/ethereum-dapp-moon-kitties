const defaultDNA = {
  // colors
  outerColor: 20,
  innerColor: 20,
  eyesColor: 300,
  // cattributes
  decoration1: 1,
  decoration2: 0,
  decoration3: 0,
  decorationsRotation: 35,
  animationCat: 1,
  animationDecorations: 1,
};

// when page loads
$(document).ready(function () {
  const factoryCatHtml = newCatHtml("");
  $("#factoryCatContainer").html(factoryCatHtml);
  renderCatFactory(defaultDNA);
  setEyesTrackCursor(true);
});

function renderCatFactory(dna) {
  $("#outercolor").val(dna.outerColor).change();
  $("#innercolor").val(dna.innerColor).change();
  $("#eyescolor").val(dna.eyesColor).change();
  $("#decoration1").prop("checked", Boolean(dna.decoration1)).change();
  $("#decoration2").prop("checked", Boolean(dna.decoration2)).change();
  $("#decoration3").prop("checked", Boolean(dna.decoration3)).change();
  $("#decorationsrotation").val(dna.decorationsRotation).change();
  $("#animationcat").val(dna.animationCat).change();
  $("#animationdecorations").val(dna.animationDecorations).change();
}

// event listeners for factory kitty
$("#outercolor").change(() => {
  const val = $("#outercolor").val();
  outerColor(val);
});
$("#innercolor").change(() => {
  const val = $("#innercolor").val();
  innerColor(val);
});
$("#eyescolor").change(() => {
  const val = $("#eyescolor").val();
  eyesColor(val);
});
$("#decoration1").change(() => {
  const isChecked = $("#decoration1").is(":checked");
  decorationsVisiblity(1, isChecked ? 1 : 0);
});
$("#decoration2").change(() => {
  const isChecked = $("#decoration2").is(":checked");
  decorationsVisiblity(2, isChecked ? 1 : 0);
});
$("#decoration3").change(() => {
  const isChecked = $("#decoration3").is(":checked");
  decorationsVisiblity(3, isChecked ? 1 : 0);
});
$("#decorationsrotation").change(() => {
  const val = $("#decorationsrotation").val();
  decorationsRotation(val);
});
$("#animationcat").change(() => {
  const val = $("#animationcat").val();
  animationCat(val);
});
$("#animationdecorations").change(() => {
  const val = $("#animationdecorations").val();
  animationDecorations(val);
});

// Sets whether eyes of factory cat track mouse cursor.
function setEyesTrackCursor(val) {
  if (val) {
    document.addEventListener("mousemove", eyesTrackCursor);
  } else {
    document.removeEventListener("mousemove", eyesTrackCursor);
    $("#pupil-left, #pupil-right").css("transform", "none");
  }
}

function defaultKitty() {
  renderCatFactory(defaultDNA);
}

function randomKitty() {
  const dna = randomDNA();
  renderCatFactory(dna);
}

function randomDNA() {
  const dna = {};
  dna.outerColor = randomValueOfRangeInput("outercolor");
  dna.innerColor = randomValueOfRangeInput("innercolor");
  dna.eyesColor = randomValueOfRangeInput("eyescolor");
  dna.decoration1 = Math.round(Math.random());
  dna.decoration2 = Math.round(Math.random());
  dna.decoration3 = Math.round(Math.random());
  dna.decorationsRotation = randomValueOfRangeInput("decorationsrotation");
  dna.animationCat = randomValueOfRangeInput("animationcat");
  dna.animationDecorations = randomValueOfRangeInput("animationdecorations");
  return dna;
}

function randomValueOfRangeInput(id) {
  const minVal = parseInt($(`#${id}`).attr("min"));
  const maxVal = parseInt($(`#${id}`).attr("max"));
  return String(Math.round(Math.random() * (maxVal - minVal) + minVal));
}

// Returns DNA of current factory kitty.
function getDNAString() {
  let dna = "";
  dna += $("#dnaouter").html();
  dna += $("#dnainner").html();
  dna += $("#dnaeyes").html();
  dna += $("#dnadecoration1").html();
  dna += $("#dnadecoration2").html();
  dna += $("#dnadecoration3").html();
  dna += $("#dnadecorationsrotation").html();
  dna += $("#dnaanimationcat").html();
  dna += $("#dnaanimationdecorations").html();
  return dna;
}
