// ======================================================
// ScamShield HTTPS Security Check
// Version: 2.0
//
// Responsibility:
// • Check secure HTTPS connection
// • Return standardized security result
// ======================================================


export async function checkHTTPS(pageData) {


    const isHTTPS =
        pageData.protocol === "https:";



    if (isHTTPS) {


        return {


            id: "https",


            name: "HTTPS Protection",


            status: "PASS",


            severity: "LOW",


            points: 5,


            summary:
                "Secure HTTPS connection detected.",


            details:
                "This website uses encrypted HTTPS communication.",


            recommendation:
                "Continue using secure connections."


        };


    }



    return {


        id: "https",


        name: "HTTPS Protection",


        status: "FAIL",


        severity: "HIGH",


        points: -25,


        summary:
            "Website does not use HTTPS.",


        details:
            "Data sent to this website may not be encrypted.",


        recommendation:
            "Avoid entering passwords or sensitive information."


    };


}