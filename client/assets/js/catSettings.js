const defaultDNA = {
  //Colors
  outerColor: 20,
  innerColor: 20,
  eyesColor: 300,
  //Cattributes
  decoration1: 1,
  decoration2: 0,
  decoration3: 0,
  decorationsRotation: 35,
  animationcat: 1,
  animationdecorations: 1,
};

// when page load
$(document).ready(function () {
  renderCat(defaultDNA);
  setEyesTrackCursor(true);
});

function renderCat(dna) {
  $("#outercolor").val(dna.outerColor).change();
  $("#innercolor").val(dna.innerColor).change();
  $("#eyescolor").val(dna.eyesColor).change();
  $("#decoration1").prop("checked", Boolean(dna.decoration1)).change();
  $("#decoration2").prop("checked", Boolean(dna.decoration2)).change();
  $("#decoration3").prop("checked", Boolean(dna.decoration3)).change();
  $("#decorationsrotation").val(dna.decorationsRotation).change();
  $("#animationcat").val(dna.animationcat).change();
  $("#animationdecorations").val(dna.animationdecorations).change();
}

// On changed color settings
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

// On changed cattributes settings
$("#decoration1").change(() => {
  const isChecked = $("#decoration1").is(":checked");
  decorationsVisiblity(1, isChecked);
});
$("#decoration2").change(() => {
  const isChecked = $("#decoration2").is(":checked");
  decorationsVisiblity(2, isChecked);
});
$("#decoration3").change(() => {
  const isChecked = $("#decoration3").is(":checked");
  decorationsVisiblity(3, isChecked);
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

// Sets if cat eyes track mouse cursor
function setEyesTrackCursor(val) {
  if (val) {
    document.addEventListener("mousemove", eyesTrackCursor);
  } else {
    document.removeEventListener("mousemove", eyesTrackCursor);
    $(".pupil-left, .pupil-right").css("transform", "none");
  }
}

function defaultKitty() {
  renderCat(defaultDNA);
}

function randomKitty() {
  const dna = randomDNA();
  renderCat(dna);
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
  dna.animationcat = randomValueOfRangeInput("animationcat");
  dna.animationdecorations = randomValueOfRangeInput("animationdecorations");
  return dna;
}

function randomValueOfRangeInput(id) {
  const minVal = parseInt($(`#${id}`).attr("min"));
  const maxVal = parseInt($(`#${id}`).attr("max"));
  return String(Math.round(Math.random() * (maxVal - minVal) + minVal));
}

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
