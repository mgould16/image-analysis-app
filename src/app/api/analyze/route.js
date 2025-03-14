import { NextResponse } from "next/server";
import axios from "axios";
import crypto from "crypto";

// Cloudinary credentials
const CLOUDINARY_API_SECRET = "1vPv1FgQaqKEZIdu0IRSXlNSjQU"; // Replace with actual API secret
const CLOUDINARY_API_KEY = "219387516764329";
const CLOUDINARY_CLOUD_NAME = "markg16";
const CLOUDINARY_UPLOAD_PRESET = "multi_auto_tagging_preset"; // New signed preset

export async function POST(req) {
    try {
        const { imageUrl } = await req.json();

        // Extract public_id from the uploaded image URL
        const publicId = imageUrl.split('/').pop().split('.')[0];

        // Generate a timestamp for signing
        const timestamp = Math.floor(Date.now() / 1000);

        // Create a signature using Cloudinary API Secret
        const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
        const signature = crypto.createHash("sha256").update(stringToSign).digest("hex");

        // Call Cloudinary's explicit API for AI auto-tagging
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/explicit`;

        const response = await axios.post(cloudinaryUrl, {
            public_id: publicId,
            type: "upload",
            upload_preset: CLOUDINARY_UPLOAD_PRESET, // Use the signed preset
            tags: "true",
            timestamp,
            api_key: CLOUDINARY_API_KEY,
            signature,
        });

        return NextResponse.json(response.data);
    } catch (error) {
        console.error("Cloudinary API Error:", error.response?.data || error.message);
        return NextResponse.json({ error: error.response?.data || error.message }, { status: 500 });
    }
}
