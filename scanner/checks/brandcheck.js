// ======================================================
// ScamShield Brand Intelligence Check
// Version: 3.0
//
// Responsibility:
// • Detect brand impersonation
// • Detect fake brand domains
// • Detect phishing words
// • Detect typosquatting
// ======================================================


import { brandDatabase } from "../database/brandDatabase.js";

import { normalizeBrand } 
from "./brand/normalizeBrand.js";

import { detectFakeWords } 
from "./brand/detectFakeWords.js";

import { detectTypos } 
from "./brand/detectTypos.js";




//======================================================
// Main Brand Check
//======================================================


export async function checkBrand(pageData) {


    const hostname =
        pageData.hostname.toLowerCase();



    let riskPoints = 0;

    let findings = [];

    let detectedBrand = null;



    //--------------------------------------------------
    // Extract clean domain
    //--------------------------------------------------


    const domain =
        hostname.replace("www.", "");



    //--------------------------------------------------
    // Normalize domain
    //--------------------------------------------------


    const normalizedDomain =
        normalizeBrand(domain);





    //--------------------------------------------------
    // Check official brands
    //--------------------------------------------------


    for (const company of brandDatabase) {


        const brand =
            company.brand.toLowerCase();



        const official =
            company.domains.some(domain =>

                hostname === domain ||
                hostname.endsWith("." + domain)

            );



        // Official website

        if (official) {


            return {


                id:"brand",


                name:"Brand Impersonation",


                status:"PASS",


                severity:"LOW",


                points:5,


                summary:
                "Official brand domain detected.",


                details:
                `This website matches an official ${brand} domain.`,


                recommendation:
                "Continue browsing normally."

            };


        }





        //--------------------------------------------------
        // Brand mentioned in hostname
        //--------------------------------------------------


        if(
            normalizedDomain.includes(brand)
        ){

            detectedBrand = brand;


            riskPoints -= 25;


            findings.push(

                `Domain contains brand name "${brand}" but is not official.`

            );


        }



    }





    //--------------------------------------------------
    // Detect suspicious words
    //--------------------------------------------------


    const fakeWords =
        detectFakeWords(hostname);



    if(fakeWords.length > 0){


        riskPoints -=
        fakeWords.length * 5;



        findings.push(

            "Suspicious words detected: "
            +
            fakeWords.join(", ")

        );


    }





    //--------------------------------------------------
    // Detect typosquatting
    //--------------------------------------------------


    const typoResult =
        detectTypos(

            normalizedDomain,

            brandDatabase

        );



    if(typoResult.detected){


        riskPoints -= 30;



        detectedBrand =
            typoResult.brand;



        findings.push(

            `Possible fake spelling of ${typoResult.brand}.`

        );


    }





    //--------------------------------------------------
    // Final Decision
    //--------------------------------------------------


    if(riskPoints < 0){



        return {


            id:"brand",


            name:"Brand Impersonation",


            status:"WARNING",


            severity:
            riskPoints <= -30
            ? "HIGH"
            : "MEDIUM",


            points:riskPoints,


            summary:
            "Possible brand impersonation detected.",


            details:
            findings.join(" "),


            recommendation:
            "Verify the domain carefully before entering passwords or payment details."

        };


    }






    //--------------------------------------------------
    // No Risk
    //--------------------------------------------------


    return {


        id:"brand",


        name:"Brand Impersonation",


        status:"PASS",


        severity:"LOW",


        points:5,


        summary:
        "No brand impersonation detected.",


        details:
        "No suspicious brand patterns were found.",


        recommendation:
        "Continue browsing normally."

    };


}