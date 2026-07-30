// ======================================================
// ScamShield Background Service Worker
// Version: 5.1 FINAL
//
// Features:
// • Popup communication
// • Website scanning
// • Internal page protection
// • Chrome page handling
// • Blocked page detection
// • Scanner engine integration
// • Report saving
// • History management
// • Timestamp tracking
// • Content recovery
// ======================================================


import { runSecurityScan } 
from "./scanner/scanner.js";



let isScanning = false;






// ======================================================
// MESSAGE CONTROLLER
// ======================================================


chrome.runtime.onMessage.addListener(
(message, sender, sendResponse)=>{



if(message.type==="START_SCAN"){


startSecurityScan()

.then(report=>{


sendResponse({

success:true,

report

});


})


.catch(error=>{


console.error(
"Scan error:",
error
);


sendResponse({

success:false,

message:error.message

});


});


return true;


}








if(message.type==="GET_LAST_REPORT"){


chrome.storage.local.get("latestReport", ({ latestReport }) => {
    sendResponse(latestReport ?? null);
});


return true;


}




if(message.type==="GET_HISTORY"){


chrome.storage.local.get(
"history",
(data)=>{


sendResponse(
data.history || []
);


});


return true;


}







if(message.type==="GET_SCAN_STATUS"){


sendResponse({

scanning:isScanning

});


return true;


}




});









// ======================================================
// MAIN SCAN
// ======================================================


async function startSecurityScan(){



if(isScanning){

throw new Error(
"Scan already running"
);

}



isScanning=true;



try{


const tabs =

await chrome.tabs.query({

active:true,

currentWindow:true

});



if(!tabs.length){

throw new Error(
"No active tab"
);

}



const tab = tabs[0];

if(!tab.id){
    throw new Error("Invalid tab.");
}



const pageData =

await getPageData(
tab.id
);



console.log(
"Page Data:",
pageData
);




// ======================================================
// INTERNAL PAGE
// ======================================================

if(pageData.internalPage){

    const report = {

        url: pageData.url,

        website: pageData.hostname,

        score: null,

        status: "INFO",

        scannedAt: new Date().toISOString(),

        checks: [],

        recommendation:
        "ScamShield does not scan its own extension pages or browser internal pages."

    };

    // Save as latest report
    await saveReport(report);

    return report;

}




// ======================================================
// BLOCKED PAGE
// ======================================================


if(pageData.scanBlocked){



const report =

createBlockedReport(
pageData
);



await saveReport(report);


return report;



}









// ======================================================
// NORMAL WEBSITE
// ======================================================


const report =

await runSecurityScan(
pageData
);



report.scannedAt =

new Date().toISOString();





if(!report.recommendation){


report.recommendation =

generateRecommendation(report);



}



await saveReport(report);



return report;



}

finally{


isScanning=false;


}



}





// ======================================================
// RECOMMENDATION ENGINE
// ======================================================


function generateRecommendation(report){



switch(report.status){


case "SAFE":

return (

"This website appears safe. " +

"Continue browsing normally, but avoid sharing unnecessary sensitive information."

);



case "CAUTION":

return (

"This website shows warning signs. " +

"Verify the website identity before entering passwords or financial details."

);



case "DANGEROUS":

return (

"Avoid this website. " +

"Do not enter passwords, banking information, or personal data."

);



default:

return (

"Stay alert while browsing and verify websites before trusting them."

);


}



}





// ======================================================
// BLOCKED REPORT
// ======================================================


function createBlockedReport(pageData){


return {


url:
pageData.url || "",


website:
pageData.hostname || "Unknown",


score:0,


status:"DANGEROUS",


scannedAt:
new Date().toISOString(),



checks:[


{
id:"https",

name:"HTTPS Protection",

status:"FAIL",

severity:"HIGH",

details:
pageData.errorType

},



{
id:"domain",

name:"Domain Reputation",

status:"WARNING",

severity:"HIGH",

details:
"Browser blocked access before analysis."

},



{
id:"url",

name:"URL Analysis",

status:"WARNING",

severity:"MEDIUM",

details:
pageData.errorType

},



{
id:"forms",

name:"Form Detection",

status:"UNKNOWN",

severity:"MEDIUM",

details:
"Page unavailable."

},



{
id:"keywords",

name:"Keyword Scan",

status:"UNKNOWN",

severity:"MEDIUM",

details:
"Page unavailable."

}


],



recommendation:

"Do not continue. Chrome detected a security problem with this website."



};


}









// ======================================================
// PAGE DATA
// ======================================================


async function getPageData(tabId){



const tab =

await chrome.tabs.get(tabId);



const url =
tab.url || "";


const title =
tab.title || "";



let protocol="";



try{


protocol =
new URL(url).protocol;


}

catch{



protocol="";


}









if(protocol==="chrome-extension:"){


return {

internalPage:true,

url,

hostname:
"ScamShield Extension Page"

};


}







if(

url.startsWith("chrome://") ||

url.startsWith("edge://") ||

url.startsWith("about:")

){


return {


internalPage:true,

url,

hostname:
"Browser Internal Page"


};


}









if(

url.startsWith("chrome-error://") ||

title.includes("Privacy error") ||

title.includes("Your connection is not private")

){


return {


scanBlocked:true,

url,

hostname:
getHostname(url),

errorType:

"Chrome blocked this website because of certificate or security problems."


};


}










try{


return await chrome.tabs.sendMessage(

tabId,

{

type:"COLLECT_PAGE_DATA"

}

);



}

catch{


try{


await chrome.scripting.executeScript({

target:{
tabId
},

files:[
"content.js"
]


});



await wait(150);



return await chrome.tabs.sendMessage(

tabId,

{

type:"COLLECT_PAGE_DATA"

}

);



}

catch{


return {


scanBlocked:true,

url,

hostname:
getHostname(url),

errorType:

"Unable to access webpage."



};



}


}



}











// ======================================================
// SAVE REPORT + HISTORY
// ======================================================


// ======================================================
// SAVE REPORT + HISTORY
// ======================================================
async function saveReport(report){

    const data =
    await chrome.storage.local.get("history");

    let history =
    data.history || [];

    // Save only real website scans to history
    if(report.status !== "INFO"){

        history.unshift(report);

        if(history.length > 100){

            history =
            history.slice(0,100);

        }

    }

    // ALWAYS update latest report
    await chrome.storage.local.set({

        latestReport: report,

        history: history

    });

    console.log("💾 Report Saved");

}



// ======================================================
// HELPERS
// ======================================================


function wait(ms){

return new Promise(resolve=>{

setTimeout(resolve,ms);

});


}




        
function getHostname(url){


try{


return new URL(url).hostname;


}

catch{


return "Unknown";


}


}    

    




