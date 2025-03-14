"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
    const [imageUrl, setImageUrl] = useState(null);
    const [imageDetails, setImageDetails] = useState(null);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://upload-widget.cloudinary.com/global/all.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const handleUpload = async () => {
        try {
            // Request a signed upload from the server
            const signResponse = await fetch("/api/sign-upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });

            const { signature, timestamp, apiKey, cloudName } = await signResponse.json();

            if (!signature) {
                console.error("❌ Failed to get a valid signature.");
                return;
            }

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
            const response = await fetch("/api/image-details", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ imageUrl: url })
            });

            const data = await response.json();
            console.log("✅ Retrieved Image Details:", data);
            setImageDetails(data);
        } catch (error) {
            console.error("❌ Error fetching image details:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Upload an Image</h1>
            <button
                onClick={handleUpload}
                className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600"
            >
                Upload Image
            </button>

            {imageUrl && (
                <div className="mt-6 flex flex-col items-center">
                    <img src={imageUrl} alt="Uploaded" className="max-w-md rounded-lg shadow-lg" />

                    {imageDetails && (
                        <div className="mt-6 p-6 bg-white rounded-lg shadow-lg w-full max-w-5xl">
                            <h3 className="text-xl font-bold mb-4 text-center">Image Details</h3>
                            <p className="text-center"><strong>Public ID:</strong> {imageDetails.public_id}</p>

                            {imageDetails.tags && (
                                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {Object.entries(imageDetails.tags).map(([model, tags]) => (
                                        <div key={model} className="bg-white rounded-lg shadow-md p-4 border">
                                            <h4 className="font-semibold text-lg uppercase text-gray-700 mb-2 text-center">
                                                {model.replace("_", " ")}
                                            </h4>
                                            <div className="flex flex-wrap gap-2 justify-center">
                                                {tags.length > 0 ? (
                                                    tags.map((tag, index) => (
                                                        <div key={index} className="bg-blue-500 text-white px-3 py-2 rounded-md text-sm flex justify-between items-center">
                                                            <span>{tag.name}</span>
                                                            <span className="ml-2 bg-white text-blue-500 px-2 py-1 rounded-md text-xs">
                                                                {tag.confidence}%
                                                            </span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-500">No tags found.</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
