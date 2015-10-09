(function() {

  var entry       = '';
  var entryArray  = [];
  var message     = [];
  var prediction  = [];

  var keys        = document.getElementsByClassName("key");
  var resultsList = document.getElementById('results');
  var messageDiv  = document.getElementById('message');
  var selectword  = document.getElementById('selectword');

  var numberKeys  = [48,49,50,51,52,53,54,55,56,57];
  var deleteKeys  = [46,8,110];
  var arrowKeys   = [37,39];
  var selectKeys  = [32,9,13];

  var pIndex      = 0;


// ========================================================================
//  PROCESS FUNCTIONS
// ========================================================================

  var setPrediction = function() {
    prediction = (entry.length) ?
      dict.getSuggestions(entry, 5) :
      '';

    cycleWords(0);
  };

  var suggestWord = function() {
    message.splice(-1, 1, prediction[pIndex]);
    messageDiv.innerHTML = message.join(" ");
    selectword.innerHTML = prediction[pIndex] || '---';
    showSuggestions();
  };

  var setWord = function() {
    messageDiv.innerHTML = message.join(" ");
    message.push('');
    entryArray.push(entry);
    entry = '';
    removeSuggestions();
    selectword.innerHTML = "<span>select word</span>";
  };

  var removeWord = function() {
    message.pop();
    entry = entryArray.pop() || '';
    removeSuggestions();
    setPrediction();
  };

  var showSuggestions = function() {
    var listFrag = document.createDocumentFragment();
    if(prediction.length) {
      for (var i = 1; i < 4; i++) {
        var li = document.createElement("li");
            li.textContent = (pIndex+i < prediction.length) ?
              prediction[pIndex+i] :
              prediction[i-1];

            listFrag.appendChild(li);
      }
      removeSuggestions();
      resultsList.appendChild(listFrag);
    }
  };

  var removeSuggestions = function() {
    while (resultsList.firstChild) {
      resultsList.removeChild(resultsList.firstChild);
    }
  };

// ========================================================================
//  EVENT HANDLERS
// ========================================================================

  var setValue = function(valueToSet) {
    entry      += valueToSet;
    setPrediction();
  };

  var cycleWords = function(direction) {
    // We have gone past the end or direction is false
    if (pIndex + direction > prediction.length-1 || !direction) {
      pIndex = 0;
    }
    // We have gone past the start
    else if (pIndex + direction < 0) {
      pIndex = prediction.length-1;
    }
    // All good just increment up or down respectively
    else {
      pIndex = pIndex+direction;
    }
    suggestWord();
  };

  var processClicked = function(e) {
    e.preventDefault();
    if(this.dataset.ref === 'prev') { cycleWords(-1); }
    else if (this.dataset.ref === 'next') { cycleWords(1); }
    else {
      setValue(this.dataset.ref);
    }
  };

// ========================================================================
//  USER INPUT
// ========================================================================

  // Add number key functionality
  document.onkeypress = function(e) {
    var charCode = e.which || e.keyCode;
    if (numberKeys.indexOf(charCode)>=0) {
      setValue(String.fromCharCode(charCode));
      setPrediction();
    }
  };

  // Add delete functionality and arrow key functionality
  document.onkeyup = function(e) {
    var charCode = e.which || e.keyCode;
    if (deleteKeys.indexOf(charCode)>=0) {
      if(entry.length > 1) {
        entry = entry.slice(0, -1);
        setPrediction();
      }
      else {
        removeWord();
      }
    }
    if (arrowKeys.indexOf(charCode)>=0) {
      var direction = (charCode === 37) ? -1 : 1;
      cycleWords(direction);
    }
  };

  //Add select functionality to keyboard
  document.onkeydown = function(e) {
    var charCode = e.which || e.keyCode;
    if (selectKeys.indexOf(charCode)>=0) {
      setWord();
    }
  };

  // Add select functionality
  selectword.onclick = setWord;

  // Add click functionality to screen keypad
  for (var i = keys.length - 1; i >= 0; i--) {
    keys[i].onmouseup = processClicked;
  }






})();
