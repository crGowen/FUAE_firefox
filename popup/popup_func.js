class FuaePopup {
   static init() {
      FuaePopup.isActive = false;

      FuaePopup.sender = browser.runtime.sendMessage({fuaeReq: "requestStatus"});
      FuaePopup.sender.then((msg) => FuaePopup.setStatus(msg.fuaeActive=="t"), () => console.error("FUAE: Send Error"));

      document.getElementById("statusIndicator").addEventListener("click", FuaePopup.toggleStatus);
   }

   static getStatus() {
      var indicator = document.getElementById("statusIndicator");
      if (FuaePopup.isActive) {
         indicator.style.backgroundColor = "#0f0";
         indicator.style.filter = "drop-shadow(0 0 0.3rem #0f0)";
         indicator.getElementsByTagName("h1")[0].innerText = "ON";
      } else {
         indicator.style.backgroundColor = "#f00";
         indicator.style.filter = "drop-shadow(0 0 0.3rem #f00)";
         indicator.getElementsByTagName("h1")[0].innerText = "OFF";
      }
   }

   static setStatus(status) {
      FuaePopup.isActive = status;
      FuaePopup.getStatus();
   }

   static toggleStatus() {
      if (FuaePopup.isActive) {
         FuaePopup.setStatus(false);
         browser.runtime.sendMessage({fuaeUpdate: "f"});
      } else {
         FuaePopup.setStatus(true);
         browser.runtime.sendMessage({fuaeUpdate: "t"});
      }
   }
}

FuaePopup.init();
