// Decode Cloudinary API authentication header
const encodedAuth = "MjE5Mzg3NTI2NzY0MzI5OjF2Pv1FgQaqKEZIdu0IRSXlNSjQU="; // Replace with your encoded Auth Header
const decodedAuth = Buffer.from(encodedAuth, "base64").toString();

console.log("✅ Decoded Auth Header:", decodedAuth);