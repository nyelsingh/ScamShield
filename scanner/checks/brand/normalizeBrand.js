// ======================================================
// ScamShield Brand Normalizer
// Version: 2.0
//
// Responsibility:
// • Normalize fake brand spellings
// • Replace common phishing substitutions
// ======================================================

const substitutions = {

    "0": "o",
    "1": "l",
    "3": "e",
    "4": "a",
    "5": "s",
    "6": "g",
    "7": "t",
    "8": "b",
    "@": "a",
    "$": "s",
    "!": "i"

};

export function normalizeBrand(text) {

    let normalized = text.toLowerCase();

    for (const [fake, real] of Object.entries(substitutions)) {

        normalized = normalized.replaceAll(fake, real);

    }

    return normalized;

}