var isActive = false;

var sender = browser.runtime.sendMessage({fuaeReq: "requestStatus"});
sender.then(function (msg) {setStatus(msg.fuaeActive=="t");}, function() {console.log("FUAE: Send Error");});


function getStatus() {
   var indicator = document.getElementById("statusIndicator");
   if (isActive) {
      indicator.style.backgroundColor = "#0f0";
      indicator.style.filter = "drop-shadow(0 0 0.3rem #0f0)";
      indicator.getElementsByTagName("h1")[0].innerText = "ON";
   } else {
      indicator.style.backgroundColor = "#f00";
      indicator.style.filter = "drop-shadow(0 0 0.3rem #f00)";
      indicator.getElementsByTagName("h1")[0].innerText = "OFF";
   }
}

function setStatus(inputStatus){
   isActive = inputStatus;
   getStatus();
}

function toggleStatus() {
   if (isActive) {
      setStatus(false);
      browser.runtime.sendMessage({fuaeUpdate: "f"});
   } else {
      setStatus(true);
      browser.runtime.sendMessage({fuaeUpdate: "t"});
   }
}

document.getElementById("statusIndicator").addEventListener("click", toggleStatus);
getStatus();
