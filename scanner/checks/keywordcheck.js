// ======================================================
// ScamShield Keyword Analysis Check
// Version: 2.0
//
// Responsibility:
// • Analyze webpage text
// • Detect suspicious scam phrases
// • Return standardized security result
// ======================================================


const suspiciousKeywords = [

    {
        word: "verify your account",
        severity: "HIGH",
        points: -15
    },

    {
        word: "account suspended",
        severity: "HIGH",
        points: -15
    },

    {
        word: "confirm identity",
        severity: "HIGH",
        points: -10
    },

    {
        word: "password reset",
        severity: "MEDIUM",
        points: -8
    },

    {
        word: "login now",
        severity: "MEDIUM",
        points: -8
    },

    {
        word: "security alert",
        severity: "MEDIUM",
        points: -8
    },

    {
        word: "urgent",
        severity: "LOW",
        points: -5
    },

    {
        word: "claim reward",
        severity: "MEDIUM",
        points: -10
    },

    {
        word: "free prize",
        severity: "MEDIUM",
        points: -10
    },

    {
        word: "winner",
        severity: "LOW",
        points: -5
    }

];



//======================================================
// Keyword Scanner
//======================================================

export async function checkKeywords(pageData) {


    const text = (

        pageData.text || ""

    ).toLowerCase();



    let detected = [];

    let totalPoints = 0;

    let highestSeverity = "LOW";



    //--------------------------------------------------
    // Scan Keywords
    //--------------------------------------------------

    suspiciousKeywords.forEach(item => {


        if (text.includes(item.word)) {


            detected.push(item.word);


            totalPoints += item.points;



            if (

                item.severity === "HIGH"

            ) {

                highestSeverity = "HIGH";

            }

            else if (

                item.severity === "MEDIUM" &&
                highestSeverity !== "HIGH"

            ) {

                highestSeverity = "MEDIUM";

            }


        }


    });



    //--------------------------------------------------
    // Threats Found
    //--------------------------------------------------

    if (detected.length > 0) {


        return {


            id: "keywords",


            name: "Keyword Analysis",


            status: "WARNING",


            severity: highestSeverity,


            points: totalPoints,


            summary:
                "Suspicious language detected on webpage.",


            details:
                `Detected phrases: ${detected.join(", ")}`,


            recommendation:
                "Avoid entering personal information until this website is verified."


        };


    }



    //--------------------------------------------------
    // Clean Result
    //--------------------------------------------------

    return {


        id: "keywords",


        name: "Keyword Analysis",


        status: "PASS",


        severity: "LOW",


        points: 0,


        summary:
            "No suspicious scam keywords detected.",


        details:
            "The page text does not contain known scam indicators.",


        recommendation:
            "Continue with normal browsing precautions."


    };


}