import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

// Load environment variables
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(req) {
    try {
        const { imageUrl } = await req.json();

        // Extract public_id from the uploaded image URL
        const urlParts = imageUrl.split("/");
        let publicId = urlParts.slice(-2).join("/").split(".")[0];

        console.log("✅ Extracted public_id:", publicId);

        // ✅ Apply AI Auto-Tagging using `update` API
        const applyAutoTagging = async (categorization) => {
            try {
                const result = await cloudinary.v2.api.update(publicId, {
                    categorization: categorization,
                    auto_tagging: 0.3 // Confidence threshold
                });

                console.log(`✅ Auto-tagging applied successfully for ${categorization}:`, result.info.categorization);

                // ✅ Extract only the tag names, handling object-based tags
                return result.info?.categorization?.[categorization]?.data.map(tag => ({
                    name: typeof tag.tag === "object" ? tag.tag.en : tag.tag, // Handle multi-language objects
                    confidence: tag.confidence.toFixed(2)
                })) || [];
            } catch (error) {
                console.error(`❌ Error applying auto-tagging for ${categorization}:`, error.message);
                return [];
            }
        };

        // Apply auto-tagging for Google, AWS, and Imagga separately
        const googleTags = await applyAutoTagging("google_tagging");
        const awsTags = await applyAutoTagging("aws_rek_tagging");
        const imaggaTags = await applyAutoTagging("imagga_tagging");

        return NextResponse.json({
            public_id: publicId,
            secure_url: `https://res.cloudinary.com/markg16/image/upload/${publicId}.jpg`, // Ensure image URL is accessible
            tags: {
                google: googleTags,
                aws: awsTags,
                imagga: imaggaTags
            }
        });
    } catch (error) {
        console.error("❌ Server Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
