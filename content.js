// ======================================================
// ScamShield Content Script
// Version: 3.0
//
// Responsibility:
// • Collect current webpage information
// • Detect blocked/error pages
// • Return data when background requests it
// ======================================================



//======================================================
// Check if page cannot be scanned
//======================================================

function checkPageAvailability() {


    const title =
        document.title.toLowerCase();



    const url =
        window.location.href;



    //--------------------------------------------------
    // Chrome internal pages
    //--------------------------------------------------

    if(
        url.startsWith("chrome://") ||
        url.startsWith("chrome-error://") ||
        url.startsWith("edge://")
    ){

        return {

            scanBlocked:true,

            reason:
            "Browser internal page cannot be scanned."

        };

    }





    //--------------------------------------------------
    // Security error pages
    //--------------------------------------------------

    const errorWords = [

        "privacy error",

        "your connection is not private",

        "this site can't be reached",

        "this site can’t be reached",

        "err_",

        "certificate error",

        "connection refused",

        "connection reset",

        "network error"

    ];




    const detectedError =
        errorWords.some(word =>
            title.includes(word)
        );



    if(detectedError){


        return {


            scanBlocked:true,


            reason:
            "Chrome blocked this page because of a connection or certificate problem."


        };


    }



    return {


        scanBlocked:false


    };


}








//======================================================
// Collect Page Data
//======================================================


function collectPageData() {



    //--------------------------------------------------
    // Validate page first
    //--------------------------------------------------


    const availability =
        checkPageAvailability();



    if(availability.scanBlocked){


        return {


            scanBlocked:true,


            errorType:
            availability.reason,


            url:
            window.location.href,


            hostname:
            window.location.hostname,


            protocol:
            window.location.protocol,


            title:
            document.title,


            scannedAt:
            new Date().toISOString()


        };


    }






    //--------------------------------------------------
    // Forms
    //--------------------------------------------------


    const forms =
    Array.from(document.forms).map(form => ({


        action:
        form.action,


        method:
        form.method,



        inputs:
        Array.from(form.elements).map(input => ({


            type:
            input.type || "",



            name:
            input.name || "",



            placeholder:
            input.placeholder || ""


        }))


    }));









    //--------------------------------------------------
    // Links
    //--------------------------------------------------


    const links =
    Array.from(document.links).map(link => ({


        text:
        (link.innerText || "").trim(),



        url:
        link.href


    }));








    //--------------------------------------------------
    // Images
    //--------------------------------------------------


    const images =
    Array.from(document.images).map(image => ({


        src:
        image.src,



        alt:
        image.alt || ""


    }));









    //--------------------------------------------------
    // Meta Tags
    //--------------------------------------------------


    const meta = {};



    document
    .querySelectorAll("meta")
    .forEach(tag => {



        const key =
        tag.name ||
        tag.getAttribute("property");



        if(key){


            meta[key] =
            tag.content || "";


        }


    });









    //--------------------------------------------------
    // Final Page Object
    //--------------------------------------------------


    return {


        scanBlocked:false,



        url:
        window.location.href,



        hostname:
        window.location.hostname,



        protocol:
        window.location.protocol,



        title:
        document.title,



        language:
        document.documentElement.lang || "",



        text:
        document.body
        ?
        document.body.innerText.slice(0,10000)
        :
        "",



        html:
        document.documentElement.outerHTML
        .slice(0,30000),



        forms,



        links,



        images,



        meta,



        scannedAt:
        new Date().toISOString()


    };


}









//======================================================
// Listen for Background Requests
//======================================================


chrome.runtime.onMessage.addListener(

(message, sender, sendResponse)=>{


    if(
        message.type !== "COLLECT_PAGE_DATA"
    ){

        return;


    }



    try{


        console.log(
            "🛡 ScamShield collecting page data..."
        );



        const pageData =
        collectPageData();




        sendResponse(
            pageData
        );


    }



    catch(error){



        console.error(
            "❌ Content script error:",
            error
        );



        sendResponse({


            error:true,


            message:
            error.message


        });



    }




    return true;



});