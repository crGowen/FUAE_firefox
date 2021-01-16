class Fuae {
   // a "tick" is just a 1.2 second interval, once per tick get the status of the extension (communication with background) and deal with the response in handleResponse(msg) function
   static tickInterval() {
      Fuae.sender = browser.runtime.sendMessage({fuaeReq: "requestStatus"});
      Fuae.sender.then(Fuae.handleResponse, (msg) => console.error(msg));
      Fuae.tick = setTimeout(Fuae.tickInterval, 1200);
   }

   // function for communication with the background, in short it checks if the user has the extension set to ON or OFF in the popup
   static handleResponse(msg) {
      if(msg.fuaeActive=="t"){
         Fuae.monitorText();
      } else if(Fuae.indicator){
         Fuae.removeIndicator();
      }
   }

   // add the indicator icon the textbox
   static addIndicator() {
      if (Fuae.indicator) return;

      var pos = document.activeElement.getBoundingClientRect();   
      var ind = document.createElement("img");

      ind.id = "fuaeIndicatorIcon";
      ind.style.display = "block";
      ind.style.position = "absolute";
      ind.style.top = pos.top + 5 + window.scrollY + "px";
      ind.style.left = pos.right - 20 + window.scrollX + "px";
      ind.style.width = "15px";
      ind.style.height = "15px";
      ind.style.borderRadius = "2px";
      ind.style.zIndex = 900000000;
      ind.style.opacity = 0.4;
   
      document.body.appendChild(ind);

      Fuae.indicator = true;
   }

   // remove the indicator icon the textbox
   static removeIndicator(){
      if (!Fuae.indicator) return;

      var ind = document.getElementById("fuaeIndicatorIcon");
      ind.parentNode.removeChild(ind);

      Fuae.indicator = false;
   }

   // each tick, if the user background reports the extension is active, and if the current active element in the DOM is a valid text field,
   // then the indicator icon should be displayed in the top-right of the text field, and call the function checkTextForChange()
   static monitorText(){
      if (document.activeElement.nodeName=="BODY") {
         Fuae.removeIndicator();
         return;
      }

      if (document.activeElement.nodeName=="INPUT") {
         if (document.activeElement.type=="text" || document.activeElement.type=="search") {
            Fuae.addIndicator();
            Fuae.checkTextForChange();
            return;
         }
      } else if (document.activeElement.nodeName=="TEXTAREA" || document.activeElement.contentEditable == "true") {
         Fuae.addIndicator();
         Fuae.checkTextForChange();
         return;
      }
      else {
         Fuae.removeIndicator();
      }
   }

   static updateText() {
      if (document.activeElement.nodeName=="TEXTAREA" || document.activeElement.nodeName=="INPUT") {
         document.activeElement.value = Fuae.parseText(document.activeElement.value);
      } else {
         document.activeElement.innerText = Fuae.parseText(document.activeElement.innerText);
      }
   }

   static getText() {
      if (document.activeElement.nodeName=="TEXTAREA" || document.activeElement.nodeName=="INPUT") {
         return document.activeElement.value;
      } else {
         return document.activeElement.innerText;
      }
   }

   // if the text has changed since the previous parse, but the text has not changed since the last two ticks (indicating the user has typed out some characters and now paused) then parse the text
   // if the text has changed since the previous parse, as well as changed since the last tick (indicating the user is currently typing out some characters), set the indicator to orange and do nothing else
   // in short: do NOT intrude on the user while they are typing, wait for them to pause before parsing the text to Russian characters
   static checkTextForChange() {
      if (Fuae.getText()!=Fuae.textSincePreviousParse){
         if (Fuae.getText()==Fuae.textSincePreviousTick) {
            document.getElementById("fuaeIndicatorIcon").src = browser.runtime.getURL("statusIcons/FUAE_48G.png");
            Fuae.updateText();
            Fuae.textSincePreviousParse = Fuae.getText();
            let evt = new Event("input", {"bubbles":true, "cancelable":true});
            setTimeout(()=>document.activeElement.dispatchEvent(evt), 200);
         } else {
            document.getElementById("fuaeIndicatorIcon").src = browser.runtime.getURL("statusIcons/FUAE_48R.png");
         }
      } else {
         document.getElementById("fuaeIndicatorIcon").src = browser.runtime.getURL("statusIcons/FUAE_48G.png");
      }

      Fuae.textSincePreviousTick = Fuae.getText();
   }

   // parse latin characters to russian characters based on their phonetic
   static parseText(text) {
      var retStr = "";

   var i;
   for (i = 0; i < text.length; i++) {
      switch(text[i]) {
         case 'A':
         if (i+2<text.length) {
            if (text[i+1] == "\'" && text[i+2] == "\'") {
               retStr += "Ä";
               i += 2;
            } else {
               retStr += "A";
            }
         } else {
            retStr += "A";
         }
         break;
         case 'a':
         if (i+2<text.length) {
            if (text[i+1] == "\'" && text[i+2] == "\'") {
               retStr += "ä";
               i += 2;
            } else {
               retStr += "a";
            }
         } else {
            retStr += "a";
         }
         break;

         case 'O':
         if (i+2<text.length) {
            if (text[i+1] == "\'" && text[i+2] == "\'") {
               retStr += "Ö";
               i += 2;
            } else {
               retStr += "O";
            }
         } else {
            retStr += "O";
         }
         break;
         case 'o':
         if (i+2<text.length) {
            if (text[i+1] == "\'" && text[i+2] == "\'") {
               retStr += "ö";
               i += 2;
            } else {
               retStr += "o";
            }
         } else {
            retStr += "o";
         }
         break;

         case 'U':
         if (i+2<text.length) {
            if (text[i+1] == "\'" && text[i+2] == "\'") {
               retStr += "Ü";
               i += 2;
            } else {
               retStr += "U";
            }
         } else {
            retStr += "U";
         }
         break;
         case 'u':
         if (i+2<text.length) {
            if (text[i+1] == "\'" && text[i+2] == "\'") {
               retStr += "ü";
               i += 2;
            } else {
               retStr += "u";
            }
         } else {
            retStr += "u";
         }
         break;

         case 's':
         case 'S':
         if (i+2<text.length) {
            if (text[i+1] == "\'" && text[i+2] == "\'") {
               retStr += "ß";
               i += 2;
            } else {
               retStr += text[i];
            }
         } else {
            retStr += text[i];
         }
         break;

         default:
         retStr += text[i];
      }
   }
   return retStr;
   }

   static init() {
      Fuae.textSincePreviousParse = "";
      Fuae.textSincePreviousTick = "";

      // check if there is an existing indicator icon
      if (document.getElementById("fuaeIndicatorIcon")) {
         Fuae.indicator = true;
      } else {
         Fuae.indicator = false;
      }

      Fuae.tickInterval();
   }
}

Fuae.init();