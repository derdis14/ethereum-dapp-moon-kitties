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

//###################################################
//Functions below will be used later on in the project
//###################################################
function eyeVariation(num) {
  $("#dnashape").html(num);
  switch (num) {
    case 1:
      normalEyes();
      $("#eyeName").html("Basic");
      break;
  }
}

function decorationVariation(num) {
  $("#dnadecoration").html(num);
  switch (num) {
    case 1:
      $("#decorationName").html("Basic");
      normaldecoration();
      break;
  }
}

async function normalEyes() {
  await $(".cat__eye").find("span").css("border", "none");
}

async function normaldecoration() {
  //Remove all style from other decorations
  //In this way we can also use normalDecoration() to reset the decoration style
  $(".cat__head-dots").css({
    transform: "rotate(0deg)",
    height: "48px",
    width: "14px",
    top: "1px",
    "border-radius": "0 0 50% 50%",
  });
  $(".cat__head-dots_first").css({
    transform: "rotate(0deg)",
    height: "35px",
    width: "14px",
    top: "1px",
    "border-radius": "50% 0 50% 50%",
  });
  $(".cat__head-dots_second").css({
    transform: "rotate(0deg)",
    height: "35px",
    width: "14px",
    top: "1px",
    "border-radius": "0 50% 50% 50%",
  });
}
