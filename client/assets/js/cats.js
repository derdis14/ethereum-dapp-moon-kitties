function appendKittiesCollection(kittyId, kittyGen, dnaString) {
  // add new cat HTML with new ids to 'My Kitties' tab
  const html = newCatColumnHtml(kittyId);
  $("#kitties-collection").append(html);

  renderCatColumn(kittyId, kittyGen, dnaString);
}

function newCatColumnHtml(kittyId) {
  const catHtml = newCatHtml(kittyId);
  const columnHtml = `
    <div id="catCol${kittyId}" class="col">
      <div
        class="card catCard bg-light text-dark"
        style="width: 18rem"
      >
        <div class="catContainer">
          ${catHtml}
        </div>
        <div class="card-body">
          ID: <span class="catId"></span> GEN:
          <span class="catGen"></span>
          <br />
          DNA: <span class="catDna"></span>
        </div>
      </div>
    </div>
  `;
  return columnHtml;
}

function newCatHtml(kittyId = "") {
  const catHtml = `
    <div id="cat${kittyId}" class="cat__">
      <div class="cat__ear">
        <div id="ear--left${kittyId}" class="cat__ear--left">
          <div
            id="ear--left-inside${kittyId}"
            class="cat__ear--left-inside"
          ></div>
        </div>
        <div id="ear--right${kittyId}" class="cat__ear--right">
          <div
            id="ear--right-inside${kittyId}"
            class="cat__ear--right-inside"
          ></div>
        </div>
      </div>

      <div id="head${kittyId}" class="cat__head">
        <div id="head-dots${kittyId}" class="cat__head-dots">
          <!-- https://www.htmlsymbols.xyz/unicode/U+1F7C4 -->
          <span class="star1">&#128964;</span>
          <span class="star2">&#128964;</span>
          <span class="star3">&#128964;</span>
        </div>
        <div id="eye${kittyId}" class="cat__eye">
          <div class="cat__eye-left">
            <span id="pupil-left${kittyId}" class="cat__pupil-left"></span>
          </div>
          <div class="cat__eye-right">
            <span id="pupil-right${kittyId}" class="cat__pupil-right"></span>
          </div>
        </div>
        <div id="nose${kittyId}" class="cat__nose"></div>

        <div id="mouth-contour${kittyId}" class="cat__mouth-contour"></div>
        <div class="cat__mouth-left"></div>
        <div class="cat__mouth-right"></div>

        <div class="cat__whiskers-left"></div>
        <div class="cat__whiskers-right"></div>
      </div>

      <div class="cat__body">
        <div id="chest${kittyId}" class="cat__chest"></div>

        <div id="chest_inner${kittyId}" class="cat__chest_inner"></div>

        <div id="paw-left${kittyId}" class="cat__paw-left"></div>
        <div id="paw-left_inner${kittyId}" class="cat__paw-left_inner"></div>

        <div id="paw-right${kittyId}" class="cat__paw-right"></div>
        <div
          id="paw-right_inner${kittyId}"
          class="cat__paw-right_inner"
        ></div>
        <div id="tail-base${kittyId}" class="cat__tail-base">
          <div id="tail${kittyId}" class="cat__tail"></div>
        </div>
      </div>
    </div>
  `;
  return catHtml;
}

function renderCatColumn(kittyId, kittyGen, dnaString) {
  // set cat CSS according to 'dnaString'
  const dnaObject = getDnaFromString(dnaString);
  renderCat(kittyId, dnaObject);

  // set information about the cat below cat HTML
  renderCatInfo(kittyId, kittyGen, dnaString);

  // set border color according to number of cattributes
  const awardClass = calcCattributesAward(kittyId, dnaObject);
  $(`#catCol${kittyId} .catContainer`).addClass(awardClass);
}

function getDnaFromString(dnaString) {
  const dnaObject = {
    outerColor: dnaString.substring(0, 2),
    innerColor: dnaString.substring(2, 4),
    eyesColor: dnaString.substring(4, 7),
    decoration1: dnaString.substring(7, 8),
    decoration2: dnaString.substring(8, 9),
    decoration3: dnaString.substring(9, 10),
    decorationsRotation: dnaString.substring(10, 12),
    animationCat: dnaString.substring(12, 13),
    animationDecorations: dnaString.substring(13, 14),
  };
  return dnaObject;
}

function renderCat(kittyId, dnaObject) {
  if ($(`#cat${kittyId}`).length <= 0) {
    console.error(`renderCat: HTML element 'cat${kittyId}' not found.`);
    return;
  }

  outerColor(dnaObject.outerColor, kittyId);
  innerColor(dnaObject.innerColor, kittyId);
  eyesColor(dnaObject.eyesColor, kittyId);
  decorationsVisiblity(1, dnaObject.decoration1, kittyId);
  decorationsVisiblity(2, dnaObject.decoration2, kittyId);
  decorationsVisiblity(3, dnaObject.decoration3, kittyId);
  decorationsRotation(dnaObject.decorationsRotation, kittyId);
  animationCat(dnaObject.animationCat, kittyId);
  animationDecorations(dnaObject.animationDecorations, kittyId);
}

function renderCatInfo(kittyId, kittyGen, dnaString) {
  $(`#catCol${kittyId} .catId`).html(kittyId);
  $(`#catCol${kittyId} .catGen`).html(kittyGen);
  $(`#catCol${kittyId} .catDna`).html(dnaString);
}

function calcCattributesAward(kittyId, dnaObject) {
  let awardClass = "";
  if (
    dnaObject.decoration1 != "0" &&
    dnaObject.decoration2 != "0" &&
    dnaObject.decoration3 != "0" &&
    dnaObject.animationCat != "0"
  ) {
    awardClass = "silverBorder";
    if (dnaObject.animationDecorations != "0") {
      awardClass = "goldBorder";
    }
  }
  return awardClass;
}
