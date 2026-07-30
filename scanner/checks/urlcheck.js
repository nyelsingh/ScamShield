// ======================================================
// ScamShield URL Analysis Check
// Version: 2.0
//
// Responsibility:
// • Analyze URL structure
// • Detect suspicious URL patterns
// • Return standardized security result
// ======================================================


export async function checkURL(pageData) {


    const url = pageData.url;

    const hostname = pageData.hostname;


    let riskPoints = 0;

    let warnings = [];



    //--------------------------------------------------
    // Check 1: IP address instead of domain
    //--------------------------------------------------

    const ipPattern =
        /^https?:\/\/(\d{1,3}\.){3}\d{1,3}/;


    if (ipPattern.test(url)) {

        riskPoints -= 25;

        warnings.push(
            "Website uses an IP address instead of a domain."
        );

    }



    //--------------------------------------------------
    // Check 2: Very long URL
    //--------------------------------------------------

    if (url.length > 120) {

        riskPoints -= 10;

        warnings.push(
            "URL is unusually long."
        );

    }



    //--------------------------------------------------
    // Check 3: Too many subdomains
    //--------------------------------------------------

    const subdomains =
        hostname.split(".").length - 2;


    if (subdomains > 2) {

        riskPoints -= 10;

        warnings.push(
            "Multiple subdomains detected."
        );

    }



    //--------------------------------------------------
    // Check 4: Suspicious URL characters
    //--------------------------------------------------

    const suspiciousCharacters = [

        "@",
        "%",

    ];


    suspiciousCharacters.forEach(character => {

        if (url.includes(character)) {

            riskPoints -= 5;

            warnings.push(
                `Suspicious character detected: ${character}`
            );

        }

    });



    //--------------------------------------------------
    // Check 5: Suspicious words in URL
    //--------------------------------------------------

    const suspiciousWords = [

        "login",
        "verify",
        "account",
        "secure",
        "update",
        "password",
        "confirm"

    ];


    const lowerURL =
        url.toLowerCase();


    suspiciousWords.forEach(word => {


        if (lowerURL.includes(word)) {

            riskPoints -= 5;

            warnings.push(
                `Suspicious word detected: ${word}`
            );

        }

    });



    //--------------------------------------------------
    // Final Result
    //--------------------------------------------------

    if (riskPoints < 0) {


        return {


            id: "url",


            name: "URL Analysis",


            status: "WARNING",


            severity:
                riskPoints <= -20
                ? "HIGH"
                : "MEDIUM",


            points: riskPoints,


            summary:
                "Suspicious URL patterns detected.",


            details:
                warnings.join(" "),


            recommendation:
                "Verify the website address before entering sensitive information."


        };


    }



    return {


        id: "url",


        name: "URL Analysis",


        status: "PASS",


        severity: "LOW",


        points: 5,


        summary:
            "URL structure appears normal.",


        details:
            "No major suspicious URL patterns detected.",


        recommendation:
            "Continue with normal caution."


    };


}