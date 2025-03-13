"use client";

import { useState, useEffect } from "react";

export default function Home() {
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        // Dynamically load Cloudinary script
        const script = document.createElement("script");
        script.src = "https://upload-widget.cloudinary.com/global/all.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const handleUpload = () => {
        if (window.cloudinary) {
            const uploadWidget = window.cloudinary.createUploadWidget(
                {
                    cloudName: "markg16", // Replace with your Cloudinary cloud name
                    uploadPreset: "Auto-tagging-all", // Replace with your upload preset
                    multiple: false,
                },
                (error, result) => {
                    if (!error && result.event === "success") {
                        setImageUrl(result.info.secure_url);
                    }
                }
            );

            uploadWidget.open();
        } else {
            console.error("Cloudinary upload widget failed to load.");
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
                </div>
            )}
        </div>
    );
}
