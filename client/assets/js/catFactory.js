/* COLORS */

function outerColor(code) {
  //This changes the color of the cat
  const color = parseInt(code);
  $(`#head,
    #chest,
    #ear--right,
    #ear--left,
    #paw-left,
    #paw-right,
    #paw-left_inner,
    #paw-right_inner,
    #tail`).css("background", `hsl(0,0%,${color}%)`);

  $("#outercode").html("code: " + code); //This updates the text of the badge next to the slider
  $("#dnaouter").html(code); //This updates the DNA text below the cat
}

function innerColor(code) {
  const color = parseInt(code);
  $(`#mouth-contour,
    #chest_inner,
    #ear--left-inside,
    #ear--right-inside`).css("background", `hsl(0,0%,${color}%)`);

  $("#innercode").html("code: " + code); //This updates the text of the badge next to the slider
  $("#dnainner").html(code); //This updates the DNA text below the cat
}

function eyesColor(code) {
  //This changes the color of the cat
  const color = parseInt(code) - 100;
  $("#eye span").css("background", `hsl(${color}, 100%, 40%)`);

  $("#eyescode").html("code: " + code); //This updates the text of the badge next to the slider
  $("#dnaeyes").html(code); //This updates the DNA text below the cat
}

/* CATTRIBUTES */

function decorationsVisiblity(idOfDeco, isChecked) {
  let code = "0";
  //This sets the visibility of the decorations
  if (isChecked) {
    code = "1";
    $(`#head-dots > .star${idOfDeco}`).css("visibility", "visible");
  } else {
    $(`#head-dots > .star${idOfDeco}`).css("visibility", "hidden");
  }

  //This updates text of the badge next to the slider
  $(`#decorationscode${idOfDeco}`).html(code);
  //This updates the DNA text that is displayed below the cat
  $(`#dnadecoration${idOfDeco}`).html(code);
}

function decorationsRotation(code) {
  //This changes the rotation of the decorations
  const rotation = parseInt(code) - 10;
  $("#head-dots > *").css("transform", `rotate(${rotation}deg)`);

  $("#decorationsrotationcode").html("code: " + code); //This updates the text of the badge next to the slider
  $("#dnadecorationsrotation").html(code); //This updates the DNA text below the cat
}

/* ANIMATIONS */

function shiningStars() {
  $("#head-dots > .star1").addClass("shiningStarV1");
  $("#head-dots > .star2").addClass("shiningStarV2");
  $("#head-dots > .star3").addClass("shiningStarV3");
}

function shiningAndRotatingStars() {
  $("#head-dots > .star1").addClass("shiningStarV1Rotating");
  $("#head-dots > .star2").addClass("shiningStarV2Rotating");
  $("#head-dots > .star3").addClass("shiningStarV3Rotating");
}

function removeAnimationsDecorations() {
  $("#head-dots > *").removeClass(`
    shiningStarV1 shiningStarV2 shiningStarV3
    shiningStarV1Rotating shiningStarV2Rotating shiningStarV3Rotating
  `);
}

function playfulMotions() {
  $("#tail-base").addClass("playingTail");
  $("#head").addClass("playingHead");
  $("#ear--right").addClass("playingRightEar");
  $("#ear--left").addClass("playingLeftEar");
}

function tenseMotions() {
  $("#tail-base").addClass("tensingTail");
  $("#ear--right").addClass("tensingRightEar");
  $("#ear--left").addClass("tensingLeftEar");
}

function jumpMotions() {
  $("#cat").addClass("jumpingCat");
  $("#paw-left_inner, #paw-left, #paw-right_inner, #paw-right").addClass(
    "jumpingLegs"
  );
  $("#tail-base").addClass("jumpingTail");
  $("#ear--right").addClass("jumpingRightEar");
  $("#ear--left").addClass("jumpingLeftEar");
}

function removeAnimationsCat() {
  $("#head").removeClass("playingHead");
  $("#ear--right").removeClass(
    "playingRightEar tensingRightEar jumpingRightEar"
  );
  $("#ear--left").removeClass("playingLeftEar tensingLeftEar jumpingLeftEar");
  $("#tail-base").removeClass("playingTail tensingTail jumpingTail");
  $("#cat").removeClass("jumpingCat");
  $("#paw-left_inner, #paw-left, #paw-right_inner, #paw-right").removeClass(
    "jumpingLegs"
  );
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

  const catPosition = $("#nose").offset();
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

  $("#pupil-left, #pupil-right").css(
    "transform",
    `translate(${moveX}px, ${moveY}px`
  );
}
