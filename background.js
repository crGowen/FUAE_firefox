var bgActive = false;

function handleMsg(msg, sender, sendResponse) {
   if (msg.fuaeReq) {
      if (bgActive) {
         sendResponse({fuaeActive: "t"});
      } else {
         sendResponse({fuaeActive: "f"});
      }
   }

   if (msg.fuaeUpdate) {
      bgActive = (msg.fuaeUpdate=="t");
   }
}
browser.runtime.onMessage.addListener(handleMsg);