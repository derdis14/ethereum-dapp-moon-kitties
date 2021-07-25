/* COLORS */

function outerColor(code, kittyId = "") {
  const color = parseInt(code);
  //This changes the color of the cat
  $(`#head${kittyId},
    #chest${kittyId},
    #ear--right${kittyId},
    #ear--left${kittyId},
    #paw-left${kittyId},
    #paw-right${kittyId},
    #paw-left_inner${kittyId},
    #paw-right_inner${kittyId},
    #tail${kittyId}`).css("background", `hsl(0,0%,${color}%)`);

  $("#outercode").html("code: " + code); //This updates the text of the badge next to the slider
  $("#dnaouter").html(code); //This updates the DNA text below the cat
}

function innerColor(code, kittyId = "") {
  const color = parseInt(code);
  //This changes the color of the cat
  $(`#mouth-contour${kittyId},
    #chest_inner${kittyId},
    #ear--left-inside${kittyId},
    #ear--right-inside${kittyId}`).css("background", `hsl(0,0%,${color}%)`);

  $("#innercode").html("code: " + code); //This updates the text of the badge next to the slider
  $("#dnainner").html(code); //This updates the DNA text below the cat
}

function eyesColor(code, kittyId = "") {
  const color = parseInt(code) - 100;
  //This changes the color of the cat
  $(`#eye${kittyId} span`).css("background", `hsl(${color}, 100%, 40%)`);

  $("#eyescode").html("code: " + code); //This updates the text of the badge next to the slider
  $("#dnaeyes").html(code); //This updates the DNA text below the cat
}

/* CATTRIBUTES */

function decorationsVisiblity(idOfDeco, code, kittyId = "") {
  const val = parseInt(code);
  //This sets the visibility of the decorations
  if (val > 0) {
    $(`#head-dots${kittyId} > .star${idOfDeco}`).css("visibility", "visible");
  } else {
    $(`#head-dots${kittyId} > .star${idOfDeco}`).css("visibility", "hidden");
  }

  //This updates text of the badge next to the slider
  $(`#decorationscode${idOfDeco}`).html(code);
  //This updates the DNA text that is displayed below the cat
  $(`#dnadecoration${idOfDeco}`).html(code);
}

function decorationsRotation(code, kittyId = "") {
  const rotation = parseInt(code) - 10;
  //This changes the rotation of the decorations
  $(`#head-dots${kittyId} > *`).css("transform", `rotate(${rotation}deg)`);

  $("#decorationsrotationcode").html("code: " + code); //This updates the text of the badge next to the slider
  $("#dnadecorationsrotation").html(code); //This updates the DNA text below the cat
}

/* ANIMATIONS */

function shiningStars(kittyId = "") {
  $(`#head-dots${kittyId} > .star1`).addClass("shiningStarV1");
  $(`#head-dots${kittyId} > .star2`).addClass("shiningStarV2");
  $(`#head-dots${kittyId} > .star3`).addClass("shiningStarV3");
}

function shiningAndRotatingStars(kittyId = "") {
  $(`#head-dots${kittyId} > .star1`).addClass("shiningStarV1Rotating");
  $(`#head-dots${kittyId} > .star2`).addClass("shiningStarV2Rotating");
  $(`#head-dots${kittyId} > .star3`).addClass("shiningStarV3Rotating");
}

function removeAnimationsDecorations(kittyId = "") {
  $(`#head-dots${kittyId} > *`).removeClass(`
    shiningStarV1 shiningStarV2 shiningStarV3
    shiningStarV1Rotating shiningStarV2Rotating shiningStarV3Rotating
  `);
}

function playfulMotions(kittyId = "") {
  $(`#tail-base${kittyId}`).addClass("playingTail");
  $(`#head${kittyId}`).addClass("playingHead");
  $(`#ear--right${kittyId}`).addClass("playingRightEar");
  $(`#ear--left${kittyId}`).addClass("playingLeftEar");
}

function tenseMotions(kittyId = "") {
  $(`#tail-base${kittyId}`).addClass("tensingTail");
  $(`#ear--right${kittyId}`).addClass("tensingRightEar");
  $(`#ear--left${kittyId}`).addClass("tensingLeftEar");
}

function jumpMotions(kittyId = "") {
  $(`#cat${kittyId}`).addClass("jumpingCat");
  $(
    `#paw-left_inner${kittyId}, #paw-left${kittyId}, #paw-right_inner${kittyId}, #paw-right${kittyId}`
  ).addClass("jumpingLegs");
  $(`#tail-base${kittyId}`).addClass("jumpingTail");
  $(`#ear--right${kittyId}`).addClass("jumpingRightEar");
  $(`#ear--left${kittyId}`).addClass("jumpingLeftEar");
}

function removeAnimationsCat(kittyId = "") {
  $(`#head${kittyId}`).removeClass("playingHead");
  $(`#ear--right${kittyId}`).removeClass(
    "playingRightEar tensingRightEar jumpingRightEar"
  );
  $(`#ear--left${kittyId}`).removeClass(
    "playingLeftEar tensingLeftEar jumpingLeftEar"
  );
  $(`#tail-base${kittyId}`).removeClass("playingTail tensingTail jumpingTail");
  $(`#cat${kittyId}`).removeClass("jumpingCat");
  $(
    `#paw-left_inner${kittyId}, #paw-left${kittyId}, #paw-right_inner${kittyId}, #paw-right${kittyId}`
  ).removeClass("jumpingLegs");
}

function animationCat(code, kittyId = "") {
  //This changes the animation of the cat
  removeAnimationsCat(kittyId);
  const animation = parseInt(code);
  switch (animation) {
    case 1:
      playfulMotions(kittyId);
      break;

    case 2:
      tenseMotions(kittyId);
      break;

    case 3:
      jumpMotions(kittyId);
      break;

    default:
      break;
  }

  $("#animationcatcode").html("code: " + code); //This updates the text of the badge next to the slider
  $("#dnaanimationcat").html(code); //This updates the DNA text below the cat
}

function animationDecorations(code, kittyId = "") {
  //This changes the animation of the decorations
  removeAnimationsDecorations(kittyId);
  const animation = parseInt(code);
  switch (animation) {
    case 1:
      shiningStars(kittyId);
      break;

    case 2:
      shiningAndRotatingStars(kittyId);
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

  const catPosition = $(`#nose`).offset();
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

  $(`#pupil-left, #pupil-right`).css(
    "transform",
    `translate(${moveX}px, ${moveY}px`
  );
}
