// ======================================================
// ScamShield Typosquatting Detector
// Version: 2.0
//
// Responsibility:
// • Detect domains similar to trusted brands
// • Uses Levenshtein Distance
// ======================================================

export function detectTypos(hostname, brandDatabase) {

    const host = hostname.toLowerCase();

    for (const company of brandDatabase) {

        const brand = company.brand.toLowerCase();

        const distance = levenshtein(host, brand);

        if (distance <= 2 && host !== brand) {

            return {

                detected: true,

                brand,

                distance

            };

        }

    }

    return {

        detected: false

    };

}



//======================================================
// Levenshtein Distance
//======================================================

function levenshtein(a, b) {

    const matrix = [];

    for (let i = 0; i <= b.length; i++) {

        matrix[i] = [i];

    }

    for (let j = 0; j <= a.length; j++) {

        matrix[0][j] = j;

    }

    for (let i = 1; i <= b.length; i++) {

        for (let j = 1; j <= a.length; j++) {

            if (b.charAt(i - 1) === a.charAt(j - 1)) {

                matrix[i][j] = matrix[i - 1][j - 1];

            }

            else {

                matrix[i][j] = Math.min(

                    matrix[i - 1][j - 1] + 1,

                    matrix[i][j - 1] + 1,

                    matrix[i - 1][j] + 1

                );

            }

        }

    }

    return matrix[b.length][a.length];

}