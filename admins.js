// https://res.cloudinary.com/markg16/image/upload/v1741953114/signed_upload_demo_uw/umfms0sq3s78bow4hp8f.jpg
var cloudinary = require('cloudinary');


cloudinary.v2.config({
    cloud_name: "markg16",
    api_key: "219387516764329",
    api_secret: "1vPv1FgQaqKEZIdu0IRSXlNSjQU" // Store securely in environment variables!
});


cloudinary.v2.api
.update("signed_upload_demo_uw/f7igl7q0rat0mvh4gciu", 
  { categorization: "google_tagging",
  	auto_tagging: 0.3,
  	
    })
.then(result=>console.log(result));



// Call the function with your asset's public ID
// applyGoogleAutoTagging('signed_upload_demo_uw/umfms0sq3s78bow4hp8f');