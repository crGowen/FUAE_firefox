var indicator;

if (document.getElementById("fuaeIndicatorIcon")) {
   indicator = true;
} else {
   indicator = false;
}

var textSincePreviousParse = "";
var textSincePreviousTick = "";

var tick = setInterval(function() {
   var sender = browser.runtime.sendMessage({fuaeReq: "requestStatus"});
   sender.then(handleResponse, function(msg) {
      console.log("error");
      console.log(msg);
   });
}, 1200);

function handleResponse(msg){
   if(msg.fuaeActive=="t"){
      monitorText();
   } else if(indicator){
      removeIndicator();
      indicator = false;
   }
}

function monitorText(){
   if(document.activeElement.nodeName=="INPUT") {
      if (document.activeElement.type=="text") {
         if (!indicator) {
            addIndicator();
         }
         checkTextForChange();
         indicator = true;
      } else {
         if(indicator) {
            removeIndicator();
         }
         indicator = false;
      }
   } else if (document.activeElement.nodeName=="TEXTAREA") {
      if (!indicator) {
         addIndicator();
      }
      checkTextForChange();
      indicator = true;
   } else {
      if(indicator) {
         removeIndicator();
      }
      indicator = false;
   }
}

function checkTextForChange(){
   if (document.activeElement.value!=textSincePreviousParse){
      if (document.activeElement.value==textSincePreviousTick) {
         document.getElementById("fuaeIndicatorIcon").src = browser.runtime.getURL("statusIcons/FUAE_48G.png");
         document.activeElement.value = parseText(document.activeElement.value);
         textSincePreviousParse = document.activeElement.value;
      } else {
         document.getElementById("fuaeIndicatorIcon").src = browser.runtime.getURL("statusIcons/FUAE_48R.png");
      }
   } else {
      document.getElementById("fuaeIndicatorIcon").src = browser.runtime.getURL("statusIcons/FUAE_48G.png");
   }
   textSincePreviousTick = document.activeElement.value;
}

function parseText(text) {
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

function addIndicator() {
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
   ind.style.zIndex = 800;
   ind.style.opacity = 0.4;

   document.body.appendChild(ind);
}

function removeIndicator(){
   var ind = document.getElementById("fuaeIndicatorIcon");
   ind.parentNode.removeChild(ind);
}
