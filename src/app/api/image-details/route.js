import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

// Configure Cloudinary
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
        const applyAIModel = async (type, model) => {
            try {
                const result = await cloudinary.v2.api.update(publicId, {
                    [type]: model,
                    auto_tagging: 0.3 // Confidence threshold
                });

                console.log(`✅ Full API Response for ${model}:`, JSON.stringify(result, null, 2));

                if (type === "detection") {
                    // ✅ Ensure COCO v2 tags are extracted correctly
                    const detectedTags = result.info?.detection?.object_detection?.data?.coco?.tags || {};

                    console.log(`✅ Extracted tags for ${model}:`, detectedTags);

                    return Object.entries(detectedTags).flatMap(([tagName, tagArray]) =>
                        tagArray.map(tag => ({
                            name: tagName,
                            confidence: tag.confidence ? (tag.confidence * 100).toFixed(2) + "%" : "N/A"
                        }))
                    ) || [];
                }

                // ✅ Extract tags for categorization models (Google, AWS, Imagga)
                return result.info?.[type]?.[model]?.data?.map(tag => ({
                    name: typeof tag.tag === "object" ? tag.tag.en : tag.tag,
                    confidence: (tag.confidence * 100).toFixed(2) + "%"
                })) || [];
            } catch (error) {
                console.error(`❌ Error applying ${type} model for ${model}:`, error.message);
                return [];
            }
        };

        // ✅ Categorization Models (Google, AWS, Imagga)
        const categorizationModels = ["google_tagging", "aws_rek_tagging", "imagga_tagging"];
        let categorizationTags = {};
        for (const model of categorizationModels) {
            categorizationTags[model] = await applyAIModel("categorization", model);
        }

        // ✅ Detection Models (Cloudinary AI Vision)
        const detectionModels = ["coco", "cld-fashion", "lvis", "unidet"];
        let detectionTags = {};
        for (const model of detectionModels) {
            detectionTags[model] = await applyAIModel("detection", model);
        }

        // ✅ Log the final API response for debugging
        const finalResponse = {
            public_id: publicId,
            secure_url: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}.jpg`,
            tags: { ...categorizationTags, ...detectionTags }
        };
        
        console.log("🚀 Final API Response:", JSON.stringify(finalResponse, null, 2));

        return NextResponse.json(finalResponse);
    } catch (error) {
        console.error("❌ Server Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
