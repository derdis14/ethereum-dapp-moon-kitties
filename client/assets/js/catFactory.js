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

/* ANIMATIONS */

function shiningStars() {
  $(".star1").addClass("shiningStarV1");
  $(".star2").addClass("shiningStarV2");
  $(".star3").addClass("shiningStarV3");
}

function shiningAndRotatingStars() {
  $(".star1").addClass("shiningStarV1Rotating");
  $(".star2").addClass("shiningStarV2Rotating");
  $(".star3").addClass("shiningStarV3Rotating");
}

function removeAnimationsDecorations() {
  $(".cat__head-dots > *").removeClass(`
    shiningStarV1 shiningStarV2 shiningStarV3
    shiningStarV1Rotating shiningStarV2Rotating shiningStarV3Rotating
  `);
}

function playfulMotions() {
  $(".cat__tailBase").addClass("playingTail");
  $("#head").addClass("playingHead");
  $("#rightEar").addClass("playingRightEar");
  $("#leftEar").addClass("playingLeftEar");
}

function tenseMotions() {
  $(".cat__tailBase").addClass("tensingTail");
  $("#rightEar").addClass("tensingRightEar");
  $("#leftEar").addClass("tensingLeftEar");
}

function jumpMotions() {
  $(".cat").addClass("jumpingCat");
  $(
    ".cat__paw-left_inner, .cat__paw-left, .cat__paw-right_inner, .cat__paw-right"
  ).addClass("jumpingLegs");
  $(".cat__tailBase").addClass("jumpingTail");
  $("#rightEar").addClass("jumpingRightEar");
  $("#leftEar").addClass("jumpingLeftEar");
}

function removeAnimationsCat() {
  $("#head").removeClass("playingHead");
  $("#rightEar").removeClass("playingRightEar tensingRightEar jumpingRightEar");
  $("#leftEar").removeClass("playingLeftEar tensingLeftEar jumpingLeftEar");
  $(".cat__tailBase").removeClass("playingTail tensingTail jumpingTail");
  $(".cat").removeClass("jumpingCat");
  $(
    ".cat__paw-left_inner, .cat__paw-left, .cat__paw-right_inner, .cat__paw-right"
  ).removeClass("jumpingLegs");
}

function animationCat(code) {
  //This changes the animation of the cat
  removeAnimationsCat();
  const animation = parseInt(code);
  switch (animation) {
    case 1:
      playfulMotions();
      break;

    case 2:
      tenseMotions();
      break;

    case 3:
      jumpMotions();
      break;

    default:
      break;
  }

  $("#animationcatcode").html("code: " + code); //This updates the text of the badge next to the slider
  $("#dnaanimationcat").html(code); //This updates the DNA text below the cat
}

function animationDecorations(code) {
  //This changes the animation of the decorations
  removeAnimationsDecorations();
  const animation = parseInt(code);
  switch (animation) {
    case 1:
      shiningStars();
      break;

    case 2:
      shiningAndRotatingStars();
      break;

    default:
      break;
  }

  $("#animationdecorationscode").html("code: " + code); //This updates the text of the badge next to the slider
  $("#dnaanimationdecorations").html(code); //This updates the DNA text below the cat
}

function eyesTrackCursor(e) {
  const cursorX = e.pageX;
  const cursorY = e.pageY;
  const width = window.innerWidth;
  const height = window.innerHeight;

  const catPosition = $(".cat__nose").offset();
  const offsetX = width / 2 - catPosition.left;
  const offsetY = height / 2 - catPosition.top;
  const maxMove = 2; // in px

  let moveX = ((cursorX - width / 2 + offsetX) / (width / 2)) * maxMove;
  let moveY = ((cursorY - height / 2 + offsetY) / (height / 2)) * maxMove;
  if (moveX > maxMove) {
    moveX = maxMove;
  }
  if (moveY > maxMove) {
    moveY = maxMove;
  }

  $(".pupil-left, .pupil-right").css(
    "transform",
    `translate(${moveX}px, ${moveY}px`
  );
}
