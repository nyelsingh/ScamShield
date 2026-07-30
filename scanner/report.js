// ======================================================
// ScamShield Report Generator
// Version: 2.0
//
// Responsibility:
// • Create final scan report
// • Normalize scan data
// • Prepare data for UI/history
// ======================================================


export function generateReport(

    pageData,

    scoreData,

    results,

    scanDuration

) {


    const passedChecks = results.filter(check =>

        check.status === "PASS"

    ).length;



    const failedChecks = results.filter(check =>

        check.status === "FAIL" ||
        check.status === "WARNING"

    ).length;



    return {


        //--------------------------------------------------
        // Website Information
        //--------------------------------------------------

        website: pageData.hostname,

        url: pageData.url,

        title: pageData.title || "",



        //--------------------------------------------------
        // Security Result
        //--------------------------------------------------

        score: scoreData.score,

        status: scoreData.status,



        //--------------------------------------------------
        // Risk Summary
        //--------------------------------------------------

        risks: scoreData.risks,



        //--------------------------------------------------
        // Check Results
        //--------------------------------------------------

        checks: results,



        //--------------------------------------------------
        // Statistics
        //--------------------------------------------------

        summary: {

            totalChecks: results.length,

            passed: passedChecks,

            issues: failedChecks

        },



        //--------------------------------------------------
        // Timing
        //--------------------------------------------------

        scanDuration,

        scannedAt: new Date().toISOString()

    };

}