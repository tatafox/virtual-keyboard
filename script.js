const inputArea = document.querySelector(".use-keyboard-input");
let sondOnOff = true;
let recognition = new webkitSpeechRecognition();

const changeEn = {
    "й":"q", "ц":"w", "у":"e", "к":"r", "е":"t", "н":"y", "г":"u",
    "ш":"i", "щ":"o", "з":"p", "х":"[", "ъ":"]", "ф":"a", "ы":"s",
    "в":"d", "а":"f", "п":"g", "р":"h", "о":"j", "л":"k", "д":"l",
    "ж":";", "э":"'", "я":"z", "ч":"x", "с":"c", "м":"v", "и":"b",
    "т":"n", "ь":"m", "б":",", "ю":"." , ",":"?", ".":"?"
}; 

const changeRu = {
  "q":"й", "w":"ц", "e":"у", "r":"к", "t":"е", "y":"н", "u":"г",
  "i":"ш", "o":"щ", "p":"з", "[":"х", "]":"ъ", "{":"х", "}":"ъ", 
  "a":"ф", "s":"ы", "d":"в", "f":"а", "g":"п", "h":"р", "j":"о", 
  "k":"л", "l":"д", ";":"ж", "'":"э", ":":"ж", '"':"э", "z":"я",
  "x":"ч", "c":"с", "v":"м", "b":"и", "n":"т", "m":"ь", ",":"б",
  ".":"ю" , "/":".", "<":"б", ">":"ю" , "?":".",
}; 

const ruShift = {
  "1":"!", "2":'"', "3":"№", "4":";", "5":"%", "6":":", "7":"?", 
  "8":"*", "9":"(", "0":")", ".":",", 
  "!":"1", '"':"2", "№":"3", ";":"4", "%":"5", ":":"6", "?":"7",
  "*":"8", "(":"9", ")":"0", ",":"." 
}; 

const enShift = {
  "1":"!", "2":"@", "3":"#", "4":"$", "5":"%", "6":"^", "7":"&", "8":"*", "9":"(", "0":")",
  ";":":" , "'":'"', "']'":'"', "[":"{" , "]":"}", ",":"<" , ".":">" , "/":"?",
  "!":"1", "@":"2", "#":"3", "$":"4", "%":"5", "^":"6", "&":"7", "*":"8", "(":"9", ")":"0",
  ":":";" , '"':"'", "{":"[" , "}":"]", "<":"," , ">":"." , "?":"/"
}; 

 

const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: []
  },

  eventHandlers: {
    oninput: null,
    onclose: null
  },

  properties: {
    value: "",
    capsLock: false,
    shift: false,
    lang: 'en',
    mic: false
  },

  init() {
    // Create main elements
    this.elements.main = document.createElement("div");
    this.elements.keysContainer = document.createElement("div");

    // Setup main elements
    this.elements.main.classList.add("keyboard", "keyboard--hidden");
    this.elements.keysContainer.classList.add("keyboard__keys");
    this.elements.keysContainer.appendChild(this._createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    // Automatically use keyboard for elements with .use-keyboard-input
    document.querySelectorAll(".use-keyboard-input").forEach(element => {
      element.addEventListener("focus", () => {
        this.open(element.value, currentValue => {
            element.value = currentValue;
        });
        //console.log('666666666666666666');
      });
    });
  },

  _createKeys() {
    const fragment = document.createDocumentFragment();
    
    const keyLayout = [
      "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
      "caps", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]",
      "shift", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", 
       "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "arrow_up", "enter",//"opacity",
      "done","mic", "lang", "space", "audio", "arrow_left", "arrow_down", "arrow_right",
    ];

    // Creates HTML for an icon
    const createIconHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`;
    };

    keyLayout.forEach(key => {
      const keyElement = document.createElement("button");
      const insertLineBreak = ["backspace", "]", "enter", "'"].indexOf(key) !== -1;

      

      // Add attributes/classes
      keyElement.setAttribute("type", "button");
      keyElement.classList.add("keyboard__key");

      switch (key) {
        case "opacity":
          keyElement.classList.add("keyboard__opacity");
          keyElement.innerHTML = ``;

          keyElement.addEventListener("click", () => {
            
          });

          break;

        case "lang":
          keyElement.classList.add("keyboard__key--dark");//"keyboard__key--wide", 
          keyElement.innerHTML = `<span>${this.properties.lang}</span>`;

          keyElement.addEventListener("click", () => {
            audioButton(1);
            inputArea.focus();
            this._toggleLanguage();
            keyElement.innerHTML = `<span>${this.properties.lang}</span>`;
          });

          break;

          case "mic":
            keyElement.classList.add("keyboard__key--activatable");
            keyElement.innerHTML = createIconHTML("mic");
  
            keyElement.addEventListener("click", () => {
              audioButton(1);
              inputArea.focus();
              this.properties.mic = !this.properties.mic;
              keyElement.classList.toggle("keyboard__key--active", this.properties.mic);
              if (this.properties.mic) {
                startRecognizer();
              } else {
                recognition.stop();
              }
             });
  
            break;  

        case "arrow_up":
          keyElement.classList.add("keyboard__key--darkS");//"keyboard__key--wide"
          keyElement.innerHTML = createIconHTML("arrow_upward");

          keyElement.addEventListener("click", () => {
            inputArea.focus();
            let cursorPosition = getCursorPosition(inputArea);
            cursorPosition = getCursorUp(cursorPosition, inputArea.value);
            inputArea.setSelectionRange(cursorPosition,cursorPosition);     
          });

          break;
          
        case "arrow_left":
          keyElement.classList.add("keyboard__key--darkS");//"keyboard__key--wide"
           keyElement.innerHTML = createIconHTML("arrow_back");

          keyElement.addEventListener("click", () => {
            inputArea.focus();
            let cursorPosition = getCursorPosition(inputArea);
            inputArea.setSelectionRange(cursorPosition-1,cursorPosition-1);  
          });

          break;
          
        case "arrow_down":
          keyElement.classList.add("keyboard__key--darkS");//"keyboard__key--wide"
           keyElement.innerHTML = createIconHTML("arrow_downward");

          keyElement.addEventListener("click", () => {
            inputArea.focus();
            let cursorPosition = getCursorPosition(inputArea);
            cursorPosition = getCursorDown(cursorPosition, inputArea.value);
            inputArea.setSelectionRange(cursorPosition,cursorPosition);   
          });

          break;

        case "arrow_right":
          keyElement.classList.add("keyboard__key--darkS");//"keyboard__key--wide"
           keyElement.innerHTML = createIconHTML("arrow_forward");

          keyElement.addEventListener("click", () => {
            inputArea.focus();
            let cursorPosition = getCursorPosition(inputArea);
            inputArea.setSelectionRange(cursorPosition+1,cursorPosition+1);  
          });

          break;

        case "audio":
          keyElement.classList.add("keyboard__key--activatable", "keyboard__key--active");//"keyboard__key--wide", 
          keyElement.innerHTML = createIconHTML("audiotrack");

          keyElement.addEventListener("click", () => {
            audioButton(1);
            inputArea.focus();
            sondOnOff = !sondOnOff;
            keyElement.classList.toggle("keyboard__key--active", sondOnOff);
          });

          break;

        case "backspace":
          
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("backspace");

          keyElement.addEventListener("click", () => {
            audioButton(1);
            inputArea.focus();
            let cursorPosition = getCursorPosition(inputArea);
            let newString = this.properties.value.substring(0, cursorPosition - 1) + this.properties.value.slice(cursorPosition,this.properties.value.length);
            this.properties.value = newString;
            //this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
            this._triggerEvent("oninput");
            inputArea.setSelectionRange(cursorPosition-1,cursorPosition-1);
          });

          break;

        case "caps":
          
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
          keyElement.innerHTML = createIconHTML("keyboard_capslock");

          keyElement.addEventListener("click", () => {
            audioButton(1);
            inputArea.focus();
            this._toggleCapsLock();
            keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
          });

          break;

        case "shift":
          
            keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
            keyElement.innerHTML = `<span>Shift</span>`;
            //keyElement.textContent = '';
  
            keyElement.addEventListener("click", () => {
              audioButton(1);
              inputArea.focus();
              this._toggleShift();
              keyElement.classList.toggle("keyboard__key--active", this.properties.shift);
            });
  
            break;      

        case "enter":
          
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("keyboard_return");

          keyElement.addEventListener("click", () => {
            audioButton(1);
            inputArea.focus();
            let cursorPosition = getCursorPosition(inputArea);
            let newString = this.properties.value.slice(0,cursorPosition) + "\n" + this.properties.value.slice(cursorPosition,this.properties.value.length);
            this.properties.value = newString;
            this._triggerEvent("oninput");
            inputArea.setSelectionRange(cursorPosition+1,cursorPosition+1);
            //this.properties.value += "\n";
            //this._triggerEvent("oninput");
          });

          break;

        case "space":
         
          keyElement.classList.add("keyboard__key--extra-wide");
          keyElement.innerHTML = createIconHTML("space_bar");

          keyElement.addEventListener("click", () => {
            audioButton(1);
            inputArea.focus();
            let cursorPosition = getCursorPosition(inputArea);
            let newString = this.properties.value.slice(0,cursorPosition) + " " + this.properties.value.slice(cursorPosition,this.properties.value.length);
            this.properties.value = newString;
            this._triggerEvent("oninput");
            inputArea.setSelectionRange(cursorPosition+1,cursorPosition+1);
            //this.properties.value += " ";
            //this._triggerEvent("oninput");
          });

          break;

        case "done":
          
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
          keyElement.innerHTML = createIconHTML("check_circle");

          keyElement.addEventListener("click", () => {
            //inputArea.focus();
            this.close();
            this._triggerEvent("onclose");
          });

          break;

        default:
          keyElement.textContent = key.toLowerCase();
          

          keyElement.addEventListener("click", () => {
            inputArea.focus();
            audioButton();
            let cursorPosition = getCursorPosition(inputArea);
            //console.log(key);
            let newSymbol; //= key.toLowerCase();
            
            if (this.properties.lang === 'en') {
              newSymbol = key.toLowerCase();    
              /*if (enShift[key.toLowerCase()] != undefined){
                  newSymbol = enShift[key];  
              } */
            } else {
              newSymbol = (changeRu[key.toLowerCase()] != undefined) ? 
                          changeRu[key.toLowerCase()] :
                          key.toLowerCase();
            }
            if (this.properties.capsLock & this.properties.shift) {
              newSymbol = newSymbol.toLowerCase();
              
            } 
            if (this.properties.capsLock ||  this.properties.shift) {
              newSymbol = newSymbol.toUpperCase();
            } 
            
            if (this.properties.shift) {
              let changeShift = this.properties.lang == 'en' ? enShift : ruShift;
              if( changeShift[newSymbol] != undefined){
                newSymbol = changeShift[newSymbol];  
              } 
            }
            let newString = this.properties.value.slice(0,cursorPosition) + newSymbol + this.properties.value.slice(cursorPosition,this.properties.value.length);
            //this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
            this.properties.value = newString;
            this._triggerEvent("oninput");
            inputArea.setSelectionRange(cursorPosition+1,cursorPosition+1);
          });

          break;
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement("br"));
      }
    });

    return fragment;
  },

  _triggerEvent(handlerName) {
    //console.log('555555555555555555555555');
    if (typeof this.eventHandlers[handlerName] == "function") {
      this.eventHandlers[handlerName](this.properties.value);
      //console.log('151')
    }
  },

  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;
    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        let upperKey = this.properties.shift ? !this.properties.capsLock : this.properties.capsLock;
        key.textContent = upperKey ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
      }
    }
  },

  _toggleShift() {
    let changeShift = this.properties.lang == 'en' ? enShift : ruShift;
    this.properties.shift = !this.properties.shift;
     for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
          if( changeShift[key.textContent.toLowerCase()] != undefined){
          //console.log(changeShift[key.textContent]);
          key.textContent = changeShift[key.textContent];  
        } else {
          let upperKey = this.properties.capsLock ? !this.properties.shift : this.properties.shift;
          key.textContent = upperKey ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
        }
      }
      }
    },

    _toggleLanguage() {
      //let changeShift2 = this.properties.lang == 'en' ? enShift : ruShift
      //let changeShift = this.properties.lang == 'en' ? ruShift : enShift
      /*let upperKey = this.properties.capsLock ? !this.properties.shift : this.properties.shift;
       for (const key of this.elements.keys) {
        if (key.childElementCount === 0) {
            if( changeRuEn[key.textContent.toLowerCase()] != undefined){
              let textContent = changeRuEn[key.textContent.toLowerCase()]; 
              key.textContent = upperKey ? textContent.toUpperCase() : textContent.toLowerCase();
              }
            if (this.properties.shift) {
              //console.log(changeShift[key.textContent.toLowerCase()], key.textContent)
              if( changeShift[key.textContent.toLowerCase()] != undefined){
                console.log(changeShift[key.textContent.toLowerCase()], key.textContent);
                let shiftText = changeShift[key.textContent];
                if( changeShift2[shiftText.toLowerCase()] != undefined){
                  key.textContent = changeShift2[shiftText];  
                } 
              }
           
          } /*else {
            let upperKey = this.properties.capsLock ? !this.properties.shift : this.properties.shift;
            key.textContent = upperKey ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
          }*/
          let shift = this.properties.shift;
          if (shift) {
            this._toggleShift()
          }
          this.properties.lang = this.properties.lang == 'en' ? 'ru' : 'en'
          let changeRuEn = this.properties.lang == 'en' ? changeEn : changeRu
          for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                if( changeRuEn[key.textContent.toLowerCase()] != undefined){
                  let textContent = changeRuEn[key.textContent.toLowerCase()]; 
                  key.textContent = this.properties.capsLock ? textContent.toUpperCase() : textContent.toLowerCase();
                  }
                }
              }
            if (shift) {
              this._toggleShift()
            }
      },  

  open(initialValue, oninput, onclose) {
    //console.log('3333333333333333333333333333');
    //console.log(document.querySelector(".use-keyboard-input"));
    document.querySelector(".use-keyboard-input").focus();
    this.properties.value = initialValue || "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove("keyboard--hidden");
  },

  close() {
    //console.log('22222222222222222222222');
    this.properties.value = "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add("keyboard--hidden");
  }
};

window.addEventListener("DOMContentLoaded", function () {
 //console.log('111111111111111111111111');
  Keyboard.init();
});

function keyboardPress(e) {
    let elems = document.getElementsByClassName("keyboard__key");
      
      for(let i =0; i < elems.length; i++) {
        
        //enter
        if (e.keyCode == 13 & elems[i].innerText == 'keyboard_return') {
          addPressVirtualKeyboard(elems[i], 1)
        //shift  
        } else if (e.keyCode == 16 & elems[i].innerText == 'Shift') {
          if (!Keyboard.properties.shift) {
            inputArea.focus();
            Keyboard._toggleShift();
            Keyboard.properties.shift = true;
            addPressVirtualKeyboard(elems[i], 1);
            elems[i].classList.toggle("keyboard__key--active", Keyboard.properties.shift);
          }  
        //caps lock  
        } else if (e.keyCode == 20 & elems[i].innerText == 'keyboard_capslock') {
          addPressVirtualKeyboard(elems[i], 1);
          inputArea.focus();
          Keyboard._toggleCapsLock();
          elems[i].classList.toggle("keyboard__key--active", Keyboard.properties.capsLock);
        //spase  
        } else if (e.keyCode == 32 & elems[i].innerText == 'space_bar') {
          addPressVirtualKeyboard(elems[i], 1)
        //backspace  
        } else if (e.keyCode == 8 & elems[i].innerText == 'backspace') {
          addPressVirtualKeyboard(elems[i], 1)
        } else if (e.key.toLowerCase() == elems[i].innerText.toLowerCase())  {
          addPressVirtualKeyboard(elems[i], 0)
        }
      }
    
}

function startRecognizer(){
  if ('webkitSpeechRecognition' in window) {
    
    recognition.lang = Keyboard.properties.lang; //'ru';

    recognition.onresult = function (event) {
      let result = event.results[event.resultIndex];
        //console.clear();
        inputArea.focus();
        let cursorPosition = getCursorPosition(inputArea);
        //cursorPosition = getCursorUp(cursorPosition, inputArea.value);
        //inputArea.setSelectionRange(cursorPosition,cursorPosition); 
        let value = inputArea.value.substr(0, cursorPosition) +  result[0].transcript + ' ' +  inputArea.value.substr(cursorPosition, inputArea.value.length);
        inputArea.value = value;
        inputArea.setSelectionRange(cursorPosition + result[0].transcript.length +1,cursorPosition + result[0].transcript.length+1); 
        //inputArea.value += result[0].transcript + ' ';
        //console.log(result[0].transcript);
    };

    recognition.onend = function() {
      //console.log('Распознавание завершилось.');
      if (Keyboard.properties.mic) {
        recognition.start(); 
      } else {
        recognition.stop();
      }
    };

    recognition.start();
 
  } else alert('webkitSpeechRecognition не поддерживается :(')
}


document.addEventListener('keyup', function(e) {
  if (e.keyCode == 16) {
    let elems = document.getElementsByClassName("keyboard__key--active");
    for(let i =0; i < elems.length; i++) {
      if (e.keyCode == 16 & elems[i].innerText == 'Shift') {
        inputArea.focus();
        Keyboard._toggleShift();
        Keyboard.properties.shift = false;
        elems[i].classList.toggle("keyboard__key--active", Keyboard.properties.shift);
      }
    }
  }  
});


function addPressVirtualKeyboard(e, snd) {
  e.classList.add("keyboard__key_active");
    setTimeout((function() {
      e.classList.toggle("keyboard__key_active");
    }), 305);
  audioButton(snd);
}

function audioButton(ver) {
  if (sondOnOff) {
    let snd; //= (ver==1) ? new Audio("./assets/audio/backspace.mp3")
             //           : new Audio("./assets/audio/button.wav");
    if (ver==1) {
      snd = new Audio("./assets/audio/backspace.mp3")  
    } else {
      snd = (Keyboard.properties.lang=='ru') ? new Audio("./assets/audio/button2.wav")
                         : new Audio("./assets/audio/button.wav");  
    }
    //to play the sound:
    snd.play();
    //to re-cue it to the beginning (so that you can play it again):
    snd.currentTime=0;  
  }
}


function getCursorPosition(ctrl) {
  let CaretPos = 0;
  if ( document.selection ) {
    ctrl.focus ();
      let Sel = document.selection.createRange();
      Sel.moveStart ('character', -ctrl.value.length);
      CaretPos = Sel.text.length;
  } else if ( ctrl.selectionStart || ctrl.selectionStart == '0' ) {
      CaretPos = ctrl.selectionStart;
  }
  return CaretPos;
}

function getCursorUp(curPosition, str) {
  let newCurPosition,
      prevLenght = 0,
      prevN = -1;
  while (true) {

    let foundPos = str.indexOf("\n", (prevN + 1));
    if (foundPos == -1) {
      if (prevN == -1) break;
      foundPos = str.length;
    } 
    if (curPosition > prevN & curPosition <= foundPos) {
      let beginSym = curPosition - prevN;
      if (beginSym <= prevLenght) {
        newCurPosition = prevN - (prevLenght - beginSym);
        break;
      } else {
        newCurPosition = prevN == -1 ? 0 : prevN;  
        break;
      }
    }
    prevLenght = foundPos - prevN;
    prevN = foundPos;
  }
  return newCurPosition;
}

function getCursorDown(curPosition, str) {
  let newCurPosition = str.length,
      beginSym,
      prevN = -1;
  while (true) {

    let foundPos = str.indexOf("\n", (prevN + 1));
    if (foundPos == -1) {
       if (prevN == -1) break;
        
      foundPos = str.length;
    } 
    if (curPosition <= prevN & curPosition < foundPos) {
      //let beginSym = curPosition - prevN;
      let nextLenght = foundPos - prevN;
      if (beginSym <= nextLenght) {
        newCurPosition = prevN + beginSym;
        break;
      } else {
        newCurPosition = foundPos;  
        break;
      }
    }
    beginSym = curPosition - prevN;
    //prevLenght = foundPos - prevN;
    prevN = foundPos;
  }
  return newCurPosition;
}
  

document.querySelector(".use-keyboard-input").addEventListener('keydown', keyboardPress);