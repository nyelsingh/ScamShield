// ======================================================
// ScamShield Report Viewer
// Version: 4.1 FINAL
//
// Features:
// • Load saved report
// • Render security analysis
// • Handle internal pages
// • Handle blocked pages
// • Calculate risk summary
// • Show recommendation
// • Show scan timestamp
// • Safe DOM handling
// ======================================================


console.log(
    "🛡 ScamShield Report Loaded"
);




//======================================================
// DOM REFERENCES
//======================================================


const website =
document.getElementById("website");


const url =
document.getElementById("url");


const score =
document.getElementById("score");


const status =
document.getElementById("status");


const checks =
document.getElementById("checks");


const recommendation =
document.getElementById("recommendation");


const highRisk =
document.getElementById("highRisk");


const mediumRisk =
document.getElementById("mediumRisk");


const lowRisk =
document.getElementById("lowRisk");


const scanTime =
document.getElementById("scanTime");









//======================================================
// LOAD REPORT
//======================================================


async function loadReport(){


try{


const report =

await chrome.runtime.sendMessage({

type:
"GET_LAST_REPORT"

});



console.log(
"Report received:",
report
);




if(!report){

showNoReport();

return;

}



renderReport(report);



}


catch(error){


console.error(
"Report loading failed:",
error
);


showNoReport();


}



}









//======================================================
// RENDER REPORT
//======================================================


function renderReport(report){



// WEBSITE

if(website){

website.textContent =
report.website || "Unknown";

}


// URL

if(url){

url.textContent =
report.url || "";

}





// SCORE

if(score){


if(typeof report.score === "number"){


score.textContent =
`${report.score}/100`;


}

else{


score.textContent =
"--";


}


}








// SCAN TIME


if(scanTime){


if(report.scannedAt){


scanTime.textContent =

new Date(

report.scannedAt

)

.toLocaleString();


}

else{


scanTime.textContent =
"Not Available";


}


}








// STATUS


if(status){


switch(report.status){


case "SAFE":


status.textContent =
"🟢 SAFE";


break;



case "CAUTION":


status.textContent =
"🟡 CAUTION";


break;



case "DANGEROUS":


status.textContent =
"🔴 DANGEROUS";


break;



case "BLOCKED":


status.textContent =
"🚫 BLOCKED";


break;



case "INFO":


status.textContent =
"🔵 INTERNAL PAGE";


renderInternalPage(report);


return;



default:


status.textContent =
"⚪ UNKNOWN";


}



}







// NORMAL REPORT


renderChecks(report);



renderRecommendation(report);



}











//======================================================
// SECURITY CHECK RENDER
//======================================================


function renderChecks(report){



if(!checks){

return;

}



checks.innerHTML =
"";



let high = 0;

let medium = 0;

let low = 0;




const results =


Array.isArray(report.checks)

?

report.checks

:

report.results;






if(!Array.isArray(results)){


resetRiskCount();

return;


}







results.forEach(check=>{



const box =

document.createElement(
"div"
);



box.className =
"security-check";



box.innerHTML = `
<hr>

<h3>${check.name || "Security Check"}</h3>

<p><strong>Status:</strong> ${check.status || "UNKNOWN"}</p>

<p>${check.summary || ""}</p>

<p>${check.details || ""}</p>

${
check.recommendation
? `<p><strong>Recommendation:</strong> ${check.recommendation}</p>`
: ""
}
`;



checks.appendChild(box);






// Ignore unavailable checks

if(

check.status === "UNKNOWN" ||

check.status === "BLOCKED"

){

return;

}






if(check.status === "PASS"){
    return;
}

if(check.severity === "HIGH"){
    high++;
}
else if(check.severity === "MEDIUM"){
    medium++;
}
else if(check.severity === "LOW"){
    low++;
}



});






if(highRisk){

highRisk.textContent =
high;

}


if(mediumRisk){

mediumRisk.textContent =
medium;

}


if(lowRisk){

lowRisk.textContent =
low;

}



}











//======================================================
// RECOMMENDATION
//======================================================


function renderRecommendation(report){

    if(!recommendation){
        return;
    }

    recommendation.textContent =
    report.recommendation ||
    "Stay alert while browsing websites.";

    recommendation.className = "recommendation-box";

    switch(report.status){

        case "SAFE":
            recommendation.style.borderLeftColor = "#22c55e";
            break;

        case "CAUTION":
            recommendation.style.borderLeftColor = "#f59e0b";
            break;

        case "DANGEROUS":
        case "BLOCKED":
            recommendation.style.borderLeftColor = "#ef4444";
            break;

        case "INFO":
            recommendation.style.borderLeftColor = "#3b82f6";
            break;

        default:
            recommendation.style.borderLeftColor = "#6b7280";
    }

}





//======================================================
// INTERNAL PAGE
//======================================================


function renderInternalPage(){



if(score){

score.textContent =
"--";

}



if(checks){


checks.innerHTML = `


<hr>


<h3>
ScamShield Internal Page
</h3>


<p>
This extension page is not scanned.
</p>


`;

}




resetRiskCount();



if(recommendation){


recommendation.textContent =
"ScamShield does not scan its own extension pages or browser internal pages.";

recommendation.className = "recommendation-box";
recommendation.style.borderLeftColor = "#3b82f6";
}




}











//======================================================
// RESET RISK COUNTERS
//======================================================


function resetRiskCount(){



if(highRisk){

highRisk.textContent =
"0";

}



if(mediumRisk){

mediumRisk.textContent =
"0";

}



if(lowRisk){

lowRisk.textContent =
"0";

}



}












//======================================================
// NO REPORT
//======================================================


function showNoReport(){



if(website){

website.textContent =
"No scan available";

}



if(url){

url.textContent =
"";

}



if(score){

score.textContent =
"--";

}



if(status){

status.textContent =
"⚪ No Report";

}



if(checks){

checks.innerHTML =

"<p>No security report available.</p>";

}



resetRiskCount();



if(recommendation){

recommendation.textContent =
"Run a security scan first.";

recommendation.className = "recommendation-box";
recommendation.style.borderLeftColor = "#6b7280";

}



if(scanTime){

scanTime.textContent =
"Not Available";

}



}











//======================================================
// START
//======================================================


loadReport();