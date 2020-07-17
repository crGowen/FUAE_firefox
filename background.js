// the background.js has basically one job: communication bridge between the user setting the ON/OFF button in the popup window and the extension functionality...
// (e.g. user sets the extension to OFF or ON in the popup window) - background.js here provides a simple interface for the status to be communicated to instances of the FUAE running in tabs

class FuaeBackground {
   static handleMsg(msg, sender, sendResponse) {
      if (msg.fuaeReq) {
         if (FuaeBackground.bgActive) {
            sendResponse({fuaeActive: "t"});
         } else {
            sendResponse({fuaeActive: "f"});
         }
      }

      if (msg.fuaeUpdate) {
         FuaeBackground.bgActive = (msg.fuaeUpdate=="t");
      }
   }

   static init() {
      FuaeBackground.bgActive = false;

      browser.runtime.onMessage.addListener(FuaeBackground.handleMsg);

      browser.commands.onCommand.addListener((command) => {
         if (command === "toggle-FUAE") {
            FuaeBackground.bgActive = !FuaeBackground.bgActive;
         }
      });

   }
}

FuaeBackground.init();
