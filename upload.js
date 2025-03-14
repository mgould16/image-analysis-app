var cloudinary = require('cloudinary');


cloudinary.v2.config({
    cloud_name: "markg16",
    api_key: "219387516764329",
    api_secret: "1vPv1FgQaqKEZIdu0IRSXlNSjQU" // Store securely in environment variables!
});

cloudinary.v2.uploader
.upload("https://res.cloudinary.com/markg16/image/upload/v1741952217/signed_upload_demo_uw/wa6cqhlpxfbtmsszhevz.jpg", 
  { categorization: "google_tagging" })
.then(result=>console.log(result));