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
  animation: 1,
};

// when page load
$(document).ready(function () {
  renderCat(defaultDNA);
});

function renderCat(dna) {
  $("#outercolor").val(dna.outerColor).change();
  $("#innercolor").val(dna.innerColor).change();
  $("#eyescolor").val(dna.eyesColor).change();
  $("#decoration1").prop("checked", Boolean(dna.decoration1)).change();
  $("#decoration2").prop("checked", Boolean(dna.decoration2)).change();
  $("#decoration3").prop("checked", Boolean(dna.decoration3)).change();
  $("#decorationsrotation").val(dna.decorationsRotation).change();
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
