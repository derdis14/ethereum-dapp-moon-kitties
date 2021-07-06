var defaultDNA = {
    //Colors
    "outerColor" : 20,
    "innerColor" : 20,
    "eyesColor" : 300,
    //Cattributes
    "eyesShape" : 1,
    "decorationPattern" : 1,
    "decorationMidcolor" : 13,
    "decorationSidescolor" : 13,
    "animation" :  1,
    "lastNum" :  1
    }

// when page load
$( document ).ready(function() {
  renderCat(defaultDNA)
});

function getDna(){
    var dna = ''
    dna += $('#dnaouter').html()
    dna += $('#dnainner').html()
    dna += $('#dnaeyes').html()

    dna += $('#dnashape').html()
    dna += $('#dnadecoration').html()
    dna += $('#dnadecorationMid').html()
    dna += $('#dnadecorationSides').html()
    dna += $('#dnaanimation').html()
    dna += $('#dnaspecial').html()

    return parseInt(dna)
}

function renderCat(dna){
    $('#outercolor').val(dna.outerColor).change()
    $('#innercolor').val(dna.innerColor).change()
    $('#eyescolor').val(dna.eyesColor).change()
}

// Changing cat colors
$('#outercolor').change(()=>{
    var val = $('#outercolor').val()
    outerColor(val)
})
$('#innercolor').change(()=>{
  var val = $('#innercolor').val()
  innerColor(val)
})
$('#eyescolor').change(()=>{
  var val = $('#eyescolor').val()
  eyesColor(val)
})