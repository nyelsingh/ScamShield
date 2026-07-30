// ======================================================
// ScamShield Scoring Engine
// Version: 2.0
// ======================================================

export function calculateScore(results) {

    let score = 100;

    let highRisk = 0;
    let mediumRisk = 0;
    let lowRisk = 0;

    for (const result of results) {

        score += result.points;

        switch (result.severity) {

            case "HIGH":
                highRisk++;
                break;

            case "MEDIUM":
                mediumRisk++;
                break;

            case "LOW":
                lowRisk++;
                break;
        }

    }

    //--------------------------------------------------
    // Keep score inside valid range
    //--------------------------------------------------

    score = Math.max(0, Math.min(100, score));

    //--------------------------------------------------
    // Overall Status
    //--------------------------------------------------

    let status;

    if (score >= 90) {

        status = "SAFE";

    }

    else if (score >= 70) {

        status = "CAUTION";

    }

    else {

        status = "DANGEROUS";

    }

    return {

        score,

        status,

        risks: {

            high: highRisk,

            medium: mediumRisk,

            low: lowRisk

        }

    };

}