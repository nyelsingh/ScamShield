// ======================================================
// ScamShield Popup Controller
// Version: 4.0 FINAL
//
// Features:
// • Current website detection
// • Old report protection
// • Security scan trigger
// • Blocked page handling
// • Internal extension page handling
// • Live status updates
// • Report rendering
// • Background communication
// ======================================================



//======================================================
// DOM REFERENCES
//======================================================


const scanBtn =
document.getElementById("scanBtn");


const website =
document.getElementById("website");


const score =
document.getElementById("score");


const status =
document.getElementById("status");


const lastScan =
document.getElementById("lastScan");


const httpsCheck =
document.getElementById("httpsCheck");


const domainCheck =
document.getElementById("domainCheck");


const urlCheck =
document.getElementById("urlCheck");


const formCheck =
document.getElementById("formCheck");


const keywordCheck =
document.getElementById("keywordCheck");


const reportBtn =
document.getElementById("reportBtn");





//======================================================
// OPEN SECURITY REPORT
//======================================================


if(reportBtn){


reportBtn.addEventListener(
"click",
()=>{


chrome.tabs.create({

url:
chrome.runtime.getURL(
"report/report.html"
)

});


});


}





//======================================================
// GET CURRENT WEBSITE
//======================================================


async function getCurrentWebsite(){


const tabs =
await chrome.tabs.query({

active:true,

currentWindow:true

});



if(!tabs.length){

return null;

}



try{


const url =
new URL(
tabs[0].url
);



if(url.protocol === "chrome-extension:"){


return "extension-page";


}



return normalizeDomain(
url.hostname
);



}

catch{


return null;


}


}







//======================================================
// NORMALIZE DOMAIN
//======================================================


function normalizeDomain(domain){


return domain

.replace(
/^www\./,
""
)

.toLowerCase();


}







//======================================================
// LOAD LAST REPORT
//======================================================


async function loadReport(){


try{


const currentWebsite =
await getCurrentWebsite();




const report =
await chrome.runtime.sendMessage({

type:"GET_LAST_REPORT"

});





if(!report){


resetPopup();

return;


}







const reportWebsite =
normalizeDomain(

report.website || ""

);






// Prevent showing another website report


if(

currentWebsite &&

reportWebsite &&

currentWebsite !== reportWebsite

){


resetPopup();

return;


}






renderReport(report);



}

catch(error){


console.error(
"Report loading error:",
error
);


resetPopup();


}


}








//======================================================
// START SECURITY SCAN
//======================================================


if(scanBtn){


scanBtn.addEventListener(

"click",

async()=>{


scanBtn.disabled=true;


scanBtn.innerText =
"Scanning...";



resetChecks(
"scanning"
);



status.innerText =
"🟡 Scanning...";




try{


const response =

await chrome.runtime.sendMessage({

type:"START_SCAN"

});





if(!response || !response.success){


throw new Error(

response?.message ||

"Scan failed"

);


}





renderReport(

response.report

);



}



catch(error){


console.error(
"Scan error:",
error
);



status.innerText =
"⚠️ Scan Failed";


setFailedChecks();



}



finally{


scanBtn.disabled=false;


scanBtn.innerText =
"Start Security Scan";


}



}


);


}










//======================================================
// RENDER REPORT
//======================================================


function renderReport(report){


if(!report){

return;

}





website.innerText =

report.website ||

"Unknown";






// SCORE


if(

typeof report.score === "number"

){


score.innerText =

`${report.score}/100`;


}

else{


score.innerText =
"--";


}









// INTERNAL EXTENSION PAGE


if(report.status === "INFO"){


status.innerText =
"🔵 INTERNAL PAGE";


resetChecks(
"idle"
);


lastScan.innerText =
"Not scanned";


return;


}








// STATUS


switch(report.status){


case "SAFE":


status.innerText =
"🟢 SAFE";


break;



case "CAUTION":


status.innerText =
"🟡 CAUTION";


break;



case "DANGEROUS":


status.innerText =
"🔴 DANGEROUS";


break;



case "BLOCKED":


status.innerText =
"🚫 BLOCKED";


break;



default:


status.innerText =
"⚠️ UNKNOWN";


}









// TIME


if(report.scannedAt){


lastScan.innerText =

new Date(

report.scannedAt

)

.toLocaleTimeString();



}

else{


lastScan.innerText =
"Never";


}








// CHECKS


const checks =

Array.isArray(report.checks)

?

report.checks

:

report.results;






if(!Array.isArray(checks)){


resetChecks(
"idle"
);


return;


}






checks.forEach(check=>{


switch(check.id){



case "https":


httpsCheck.innerText =

getStatusIcon(check);


break;




case "domain":


if(domainCheck){


domainCheck.innerText =

getStatusIcon(check);


}


break;





case "url":


urlCheck.innerText =

getStatusIcon(check);


break;





case "forms":


formCheck.innerText =

getStatusIcon(check);


break;





case "keywords":


keywordCheck.innerText =

getStatusIcon(check);


break;



}



});



}









//======================================================
// STATUS ICON
//======================================================


function getStatusIcon(check){



switch(check.status){



case "PASS":

return "✅ Secure";



case "WARNING":

return "⚠️ Risk Found";



case "FAIL":

return "❌ Failed";



case "UNKNOWN":

return "⚪ Not Available";



default:

return "⚪ Not Scanned";


}


}









//======================================================
// RESET CHECKS
//======================================================


function resetChecks(mode="idle"){



const value =


mode === "scanning"

?

"Scanning..."

:

"⚪ Not Available";





httpsCheck.innerText =
value;



if(domainCheck){

domainCheck.innerText =
value;

}



urlCheck.innerText =
value;



formCheck.innerText =
value;



keywordCheck.innerText =
value;



}










//======================================================
// FAILED SCAN
//======================================================


function setFailedChecks(){



httpsCheck.innerText =
"❌ Failed";


if(domainCheck){

domainCheck.innerText =
"❌ Failed";

}



urlCheck.innerText =
"❌ Failed";



formCheck.innerText =
"⚪ Not Available";



keywordCheck.innerText =
"⚪ Not Available";


}









//======================================================
// RESET POPUP
//======================================================


function resetPopup(){



website.innerText =
"No Scan Available";



score.innerText =
"--";



status.innerText =
"⚪ Ready";



lastScan.innerText =
"Never";



resetChecks(
"idle"
);



}








//======================================================
// INITIAL LOAD
//======================================================


loadReport();