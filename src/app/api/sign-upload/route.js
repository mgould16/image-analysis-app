
import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

// Load environment variables
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST() {
    try {
        const timestamp = Math.round(new Date().getTime() / 1000);

        // Generate signature using Cloudinary's recommended approach
        const paramsToSign = {
            timestamp: timestamp,
            source: "uw", // 'uw' stands for Upload Widget
            folder: "signed_upload_demo_uw"
        };

        const signature = cloudinary.v2.utils.api_sign_request(
            paramsToSign,
            cloudinary.v2.config().api_secret
        );

        console.log("✅ Generated Cloudinary Signature:", signature);
        console.log("🔹 String to Sign:", paramsToSign);

        return NextResponse.json({ 
            signature, 
            timestamp, 
            apiKey: cloudinary.v2.config().api_key,
            cloudName: cloudinary.v2.config().cloud_name
        });
    } catch (error) {
        console.error("❌ Error generating signature:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
