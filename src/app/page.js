"use client";

import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // ✅ Bootstrap for styling
import Image from "next/image";


export default function Home() {
    const [imageUrl, setImageUrl] = useState(null);
    const [imageDetails, setImageDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState({});

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://upload-widget.cloudinary.com/global/all.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const handleUpload = async () => {
        try {
            const signResponse = await fetch("/api/sign-upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });

            const { signature, timestamp, apiKey, cloudName } = await signResponse.json();
            if (!signature) return console.error("❌ Failed to get a valid signature.");

            if (window.cloudinary) {
                const uploadWidget = window.cloudinary.createUploadWidget(
                    {
                        cloudName: cloudName,
                        uploadSignature: async (callback) => {
                            const signRes = await fetch("/api/sign-upload", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" }
                            });

                            const { signature, timestamp, apiKey } = await signRes.json();
                            callback({ signature, timestamp, api_key: apiKey });
                        },
                        multiple: false,
                        folder: "signed_upload_demo_uw"
                    },
                    async (error, result) => {
                        if (!error && result.event === "success") {
                            const uploadedImageUrl = result.info.secure_url;
                            console.log("✅ Upload Successful! Fetching image details...");
                            setImageUrl(uploadedImageUrl);
                            fetchImageDetails(uploadedImageUrl);
                        }
                    }
                );
                uploadWidget.open();
            } else {
                console.error("❌ Cloudinary upload widget failed to load.");
            }
        } catch (error) {
            console.error("❌ Error generating upload signature:", error);
        }
    };

    const fetchImageDetails = async (url) => {
        try {
            setLoading(true);
            console.log("🟡 Fetching image details for:", url);

            const response = await fetch("/api/image-details", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ imageUrl: url })
            });

            const data = await response.json();
            console.log("✅ Retrieved API Response:", data);

            setImageDetails(data);
            setExpanded({});
        } catch (error) {
            console.error("❌ Error fetching image details:", error);
        } finally {
            setLoading(false);
        }
    };

    const downloadCSV = () => {
        if (!imageDetails) return;

        const { public_id, tags } = imageDetails;
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "public_id,model,tag,confidence\n"; // ✅ CSV Header

        Object.entries(tags).forEach(([model, modelTags]) => {
            modelTags.forEach(({ name, confidence }) => {
                csvContent += `${public_id},${model},${name},${confidence}\n`;
            });
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${public_id}_tags.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="container-fluid page-container">
            {/* Hero Section with CSV Download Button */}
            <div className="hero-section">
                <h2>AI Image Tagging</h2>
                <p>Automatically tag images using AI-powered object detection models. Try multiple AI tagging options effortlessly!</p>
                {imageDetails && (
                    <button className="download-btn" onClick={downloadCSV}>
                        Download CSV
                    </button>
                )}
            </div>

            {/* Upload Box */}
            <div className="upload-container">
                <div className="upload-box">
                    {/* ✅ Replaced <img> with Next.js <Image> for optimization */}
                    <Image src="/cld-logo.png" alt="Upload" className="upload-icon" width={80} height={50} />

                    <h3>Upload an Image to Tag</h3>
                    <button className="upload-btn" onClick={handleUpload}>Upload Image</button>
                    <p className="drag-text">Or drag your images here</p>
                </div>
            </div>

            {/* Show Uploaded Image & Details */}
            {imageUrl && (
                <div className="image-section">
                    <img src={imageUrl} alt="Uploaded Image" className="uploaded-image" />
                    <h4 className="image-description">
                        Detected Objects & Tags  
                        {imageDetails && <span className="public-id">({imageDetails.public_id})</span>}
                    </h4>

                    {loading && (
                        <div className="loading-container">
                            <div className="spinner"></div>
                            <p>Loading tags...</p>
                        </div>
                    )}

                    {!loading && imageDetails && (
                        <div className="tag-container">
                            {Object.entries(imageDetails.tags).map(([model, tags]) => {
                                const isExpanded = expanded[model] || false;
                                const displayedTags = isExpanded ? tags : tags.slice(0, 20);

                                return (
                                    <div key={model} className="tag-section">
                                        <h5 className="tag-title">{model.replace("_", " ").toUpperCase()}</h5>
                                        <div className="tag-list">
                                            {tags.length > 0 ? (
                                                displayedTags.map((tag, index) => (
                                                    <span key={index} className="badge bg-primary m-1">
                                                        {tag.name}
                                                        <span className="confidence-score">{tag.confidence}</span>
                                                    </span>
                                                ))
                                            ) : (
                                                <p className="no-tags-text">No tags found for this model</p>
                                            )}
                                        </div>

                                        {/* Show More Button */}
                                        {tags.length > 20 && (
                                            <button
                                                className="show-more-btn"
                                                onClick={() => setExpanded(prev => ({
                                                    ...prev,
                                                    [model]: !prev[model]
                                                }))}
                                            >
                                                {isExpanded ? "Show Less" : "Show More"}
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
