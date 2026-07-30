// ======================================================
// ScamShield Fake Brand Word Detector
// Version: 2.0
//
// Responsibility:
// • Detect phishing words inside hostnames
// ======================================================

const suspiciousWords = [

    "login",
    "signin",
    "verify",
    "verification",
    "secure",
    "security",
    "account",
    "update",
    "confirm",
    "support",
    "auth",
    "wallet",
    "recover",
    "recovery",
    "password",
    "payment",
    "billing"

];

export function detectFakeWords(hostname) {

    const found = [];

    const lowerHostname = hostname.toLowerCase();

    for (const word of suspiciousWords) {

        if (lowerHostname.includes(word)) {

            found.push(word);

        }

    }

    return found;

}