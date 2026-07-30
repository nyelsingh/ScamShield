// ======================================================
// ScamShield Domain Reputation Check
// Version: 1.0
//
// Responsibility:
// • Analyze domain reputation
// • Detect suspicious domains
// • Identify trusted websites
// • Return standardized security result
// ======================================================



export async function checkDomain(pageData){



    const hostname =
        (pageData.hostname || "")
        .toLowerCase();




    let riskPoints = 0;

    let detected = [];





    //--------------------------------------------------
    // Trusted Domains
    //--------------------------------------------------


    const trustedDomains = [

        "google.com",
        "youtube.com",
        "github.com",
        "microsoft.com",
        "apple.com",
        "amazon.com",
        "facebook.com",
        "linkedin.com",
        "mozilla.org"

    ];






    const isTrusted =
        trustedDomains.some(domain =>

            hostname === domain ||
            hostname.endsWith("." + domain)

        );





    if(isTrusted){


        return {


            id:"domain",


            name:"Domain Reputation",


            status:"PASS",


            severity:"LOW",


            points:10,


            summary:
            "Trusted domain recognized.",


            details:
            "This domain belongs to a known trusted organization.",


            recommendation:
            "Stay alert while browsing."


        };


    }








    //--------------------------------------------------
    // Suspicious Domain Patterns
    //--------------------------------------------------


    const suspiciousWords = [

        "login",
        "verify",
        "secure",
        "account",
        "update",
        "confirm",
        "wallet",
        "password"

    ];





    suspiciousWords.forEach(word=>{


        if(hostname.includes(word)){


            riskPoints -= 15;


            detected.push(

                `Suspicious keyword in domain: ${word}`

            );


        }


    });








    //--------------------------------------------------
    // Excessive Hyphens
    //--------------------------------------------------


    const hyphenCount =

    (hostname.match(/-/g) || [])
    .length;



    if(hyphenCount >= 3){


        riskPoints -= 10;


        detected.push(

            "Domain contains many hyphens."

        );


    }








    //--------------------------------------------------
    // Very Long Domain
    //--------------------------------------------------


    if(hostname.length > 35){


        riskPoints -= 10;


        detected.push(

            "Unusually long domain name."

        );


    }








    //--------------------------------------------------
    // Numbers in Domain
    //--------------------------------------------------


    const numberCount =

    (hostname.match(/[0-9]/g) || [])
    .length;



    if(numberCount >= 5){


        riskPoints -= 10;


        detected.push(

            "Large number sequence detected."

        );


    }









    //--------------------------------------------------
    // Final Result
    //--------------------------------------------------



    if(riskPoints < 0){



        return {


            id:"domain",


            name:"Domain Reputation",


            status:"WARNING",


            severity:

            riskPoints <= -25
            ?
            "HIGH"
            :
            "MEDIUM",



            points:riskPoints,


            summary:
            "Suspicious domain characteristics detected.",


            details:
            detected.join(", "),


            recommendation:
            "Verify the website identity before continuing."


        };


    }








    return {



        id:"domain",


        name:"Domain Reputation",


        status:"PASS",


        severity:"LOW",


        points:5,


        summary:
        "Domain appears normal.",


        details:
        "No suspicious domain patterns detected.",


        recommendation:
        "Stay alert while browsing."


    };



}