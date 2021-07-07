/* COLORS */

function outerColor(code) {
  //This changes the color of the cat
  const color = parseInt(code);
  $(`.cat__head,
    .cat__chest,
    .cat__ear--right,
    .cat__ear--left,
    .cat__paw-left,
    .cat__paw-right,
    .cat__paw-left_inner,
    .cat__paw-right_inner,
    .cat__tail`).css("background", `hsl(0,0%,${color}%)`);

  $("#outercode").html("code: " + code); //This updates the text of the badge next to the slider
  $("#dnaouter").html(code); //This updates the DNA text below the cat
}

function innerColor(code) {
  const color = parseInt(code);
  $(`.cat__mouth-contour,
    .cat__chest_inner,
    .cat__ear--left-inside,
    .cat__ear--right-inside`).css("background", `hsl(0,0%,${color}%)`);

  $("#innercode").html("code: " + code); //This updates the text of the badge next to the slider
  $("#dnainner").html(code); //This updates the DNA text below the cat
}

function eyesColor(code) {
  //This changes the color of the cat
  const color = parseInt(code) - 100;
  $(".cat__eye span").css("background", `hsl(${color}, 100%, 40%)`);

  $("#eyescode").html("code: " + code); //This updates the text of the badge next to the slider
  $("#dnaeyes").html(code); //This updates the DNA text below the cat
}

/* CATTRIBUTES */

function decorationsVisiblity(idOfDeco, isChecked) {
  let code = "0";
  //This sets the visibility of the decorations
  if (isChecked) {
    code = "1";
    $(`.star${idOfDeco}`).css("visibility", "visible");
  } else {
    $(`.star${idOfDeco}`).css("visibility", "hidden");
  }

  //This updates text of the badge next to the slider
  $(`#decorationscode${idOfDeco}`).html(code);
  //This updates the DNA text that is displayed below the cat
  $(`#dnadecoration${idOfDeco}`).html(code);
}

function decorationsRotation(code) {
  //This changes the rotation of the decorations
  const rotation = parseInt(code) - 10;
  $(".cat__head-dots > *").css("transform", `rotate(${rotation}deg)`);

  $("#decorationsrotationcode").html("code: " + code); //This updates the text of the badge next to the slider
  $("#dnadecorationsrotation").html(code); //This updates the DNA text below the cat
}
