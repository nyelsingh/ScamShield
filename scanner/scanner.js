// ======================================================
// ScamShield Scan Engine
// Version: 2.1
//
// Responsibility:
// • Run every security check
// • Handle failures safely
// • Calculate score
// • Generate final report
// ======================================================


import { checkHTTPS } from "./checks/httpsCheck.js";
import { checkURL } from "./checks/urlCheck.js";
import { checkKeywords } from "./checks/keywordCheck.js";
import { checkForms } from "./checks/formCheck.js";

import { checkDomain } from "./checks/domaincheck.js";


import { calculateScore } from "./scoring.js";
import { generateReport } from "./report.js";

import { checkBrand } from "./checks/brandcheck.js";

//======================================================
// Register Every Security Check Here
//======================================================


const securityChecks = [

    checkHTTPS,

    checkDomain,

    checkURL,

    checkBrand,

    checkKeywords,

    checkForms

];

//======================================================
// Main Scan Function
//======================================================


export async function runSecurityScan(pageData) {


    const startedAt = Date.now();


    const results = [];





    //--------------------------------------------------
    // Run Every Security Check
    //--------------------------------------------------


    for (const check of securityChecks) {


        try {


            const result =
                await check(pageData);



            results.push(result);



        }



        catch(error) {



            console.error(


                "❌ ScamShield Check Failed:",


                error


            );




            results.push({


                id:
                check.name || "unknown",



                name:
                check.name || "Unknown Check",



                status:
                "ERROR",



                severity:
                "HIGH",



                points:
                -20,



                summary:
                "Security check failed.",



                details:
                error.message,



                recommendation:
                "Run the scan again."



            });



        }



    }







    //--------------------------------------------------
    // Calculate Final Security Score
    //--------------------------------------------------


    const score = calculateScore(results);








    //--------------------------------------------------
    // Generate Final Report
    //--------------------------------------------------


    const report =
        generateReport(


            pageData,


            score,


            results,


            Date.now() - startedAt


        );





    return report;



}