import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const { imageUrl, confidence = 0.3 } = await req.json(); // Get dynamic confidence

    // Extract public_id from the uploaded image URL
    const urlParts = imageUrl.split("/");
    const publicId = urlParts.slice(-2).join("/").split(".")[0];

    console.log("✅ Extracted public_id:", publicId);
    console.log("🟡 Confidence threshold:", confidence);

    const applyAIModel = async (type, model) => {
      try {
        const result = await cloudinary.v2.api.update(publicId, {
          [type]: model,
          auto_tagging: confidence, // Pass threshold to Cloudinary
        });

        console.log(`✅ Full API Response for ${model}:`, JSON.stringify(result, null, 2));

        // Detection (COCO, UNIDET, etc.)
        if (type === "detection") {
          const detectedTags = result.info?.detection?.object_detection?.data?.[model]?.tags || {};
          return Object.entries(detectedTags).flatMap(([tagName, tagArray]) =>
            tagArray
              .filter(tag => tag.confidence >= confidence)
              .map(tag => ({
                name: tagName,
                confidence: tag.confidence ? (tag.confidence * 100).toFixed(2) + "%" : "N/A"
              }))
          ) || [];
        }

        // Categorization (Google, AWS, Imagga)
        return result.info?.[type]?.[model]?.data
          ?.filter(tag => tag.confidence >= confidence) // Manual filter required
          .map(tag => ({
            name: typeof tag.tag === "object" ? tag.tag.en : tag.tag,
            confidence: (tag.confidence * 100).toFixed(2) + "%"
          })) || [];

      } catch (error) {
        console.error(`❌ Error applying ${type} model for ${model}:`, error.message);
        return [];
      }
    };

    // Run Categorization Models
    const categorizationModels = ["google_tagging", "aws_rek_tagging", "imagga_tagging"];
    const categorizationTags = {};
    for (const model of categorizationModels) {
      categorizationTags[model] = await applyAIModel("categorization", model);
    }

    // Run Detection Models
    const detectionModels = ["coco", "cld-fashion", "lvis", "unidet"];
    const detectionTags = {};
    for (const model of detectionModels) {
      detectionTags[model] = await applyAIModel("detection", model);
    }

    const response = {
      public_id: publicId,
      secure_url: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}.jpg`,
      tags: {
        ...categorizationTags,
        ...detectionTags
      }
    };

    console.log("🚀 Final API Response:", JSON.stringify(response, null, 2));
    return NextResponse.json(response);

  } catch (error) {
    console.error("❌ Server Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
