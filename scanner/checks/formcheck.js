// ======================================================
// ScamShield Form Detection Scanner
// Version: 3.0
//
// Responsibility:
// • Analyze webpage forms
// • Detect suspicious credential collection
// • Identify phishing-style forms
// • Return standardized security result
// ======================================================


export async function checkForms(pageData) {



    const forms =
        pageData.forms || [];



    let riskPoints = 0;

    let detected = [];

    let severity = "LOW";





    //--------------------------------------------------
    // No forms found
    //--------------------------------------------------


    if(forms.length === 0){


        return {


            id:"forms",


            name:"Form Detection",


            status:"PASS",


            severity:"LOW",


            points:5,


            summary:
            "No forms detected.",


            details:
            "This website does not contain data collection forms.",


            recommendation:
            "Continue browsing normally."


        };


    }






    let hasPassword = false;

    let hasEmail = false;

    let suspiciousAction = false;






    //--------------------------------------------------
    // Analyze Forms
    //--------------------------------------------------


    forms.forEach(form=>{


        const action =
        (form.action || "")
        .toLowerCase();



        const inputs =
        form.inputs || [];





        //--------------------------------------------------
        // Check form destination
        //--------------------------------------------------


        const suspiciousWords = [

            "login",
            "verify",
            "secure",
            "account",
            "confirm",
            "password",
            "update"

        ];



        suspiciousWords.forEach(word=>{


            if(action.includes(word)){


                suspiciousAction = true;


            }


        });







        //--------------------------------------------------
        // Analyze Inputs
        //--------------------------------------------------


        inputs.forEach(input=>{


            const type =
            (input.type || "")
            .toLowerCase();



            const name =
            (input.name || "")
            .toLowerCase();





            //--------------------------------------------------
            // Email Detection
            //--------------------------------------------------


            if(

                type === "email" ||
                name.includes("email")

            ){


                hasEmail = true;


                detected.push(
                    "Email field detected"
                );


                // Email alone is normal
                // No penalty

            }






            //--------------------------------------------------
            // Password Detection
            //--------------------------------------------------


            if(

                type === "password" ||
                name.includes("password") ||
                name.includes("pass")

            ){


                hasPassword = true;


            }





        });



    });








    //--------------------------------------------------
    // Risk Evaluation
    //--------------------------------------------------



    // Password collection alone is not dangerous
    // Login systems are normal


    if(hasPassword){


        detected.push(
            "Password field detected"
        );


    }





    // Suspicious combination


    if(

        hasPassword &&
        suspiciousAction

    ){


        riskPoints -= 30;


        severity="HIGH";


        detected.push(

            "Suspicious credential collection pattern"

        );


    }



    else if(hasPassword){



        riskPoints -= 5;


        severity="MEDIUM";


        detected.push(

            "Credential input detected"

        );


    }








    //--------------------------------------------------
    // Return Result
    //--------------------------------------------------



    if(riskPoints < 0){



        return {


            id:"forms",


            name:"Form Detection",


            status:"WARNING",


            severity,


            points:riskPoints,


            summary:
            "Potentially risky form behavior detected.",


            details:
            [...new Set(detected)].join(", "),


            recommendation:
            "Avoid entering sensitive information unless you trust this website."


        };


    }







    return {



        id:"forms",


        name:"Form Detection",


        status:"PASS",


        severity:"LOW",


        points:5,


        summary:
        "No suspicious forms detected.",


        details:
        hasEmail
        ?
        "Normal data collection forms detected."
        :
        "No risky form behavior found.",


        recommendation:
        "Continue with normal caution."


    };



}