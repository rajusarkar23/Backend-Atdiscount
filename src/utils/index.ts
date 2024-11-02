export const DB_Name = "at-discount"

// generate otp function

export function generateOtp(l=6) {
    let otp = ""
    for (let i = 0; i < l; i++) {
        otp += Math.floor(Math.random() * 10)
    }
    return otp
}