"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // ✅ Using Bootstrap for styling

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
        <div className="container text-center mt-5">
            <h1 className="mb-4">Upload an Image</h1>
            <button onClick={handleUpload} className="btn btn-primary mb-4">
                Upload Image
            </button>

            {imageUrl && (
                <div className="mt-3">
                    <img src={imageUrl} alt="Uploaded" className="img-fluid rounded shadow-lg mb-3" />

                    {imageDetails && (
                        <div className="mt-4 p-4 bg-light rounded shadow-lg">
                            <h3 className="mb-3">Image Details</h3>
                            <p><strong>Public ID:</strong> {imageDetails.public_id}</p>

                            {imageDetails.tags && (
                                <div className="mt-4">
                                    <h3 className="mb-3">AI-Generated Tags</h3>

                                    <div className="row">
                                        {Object.entries(imageDetails.tags).map(([model, tags]) => (
                                            <div key={model} className="col-md-4 mb-4">
                                                <div className="card shadow-sm">
                                                    <div className="card-body">
                                                        <h5 className="card-title text-center">{model.replace("_", " ").toUpperCase()}</h5>
                                                        <div className="d-flex flex-wrap justify-content-center">
                                                            {tags.length > 0 ? (
                                                                tags.map((tag, index) => (
                                                                    <span key={index} className="badge bg-primary m-1">
                                                                        {tag.name} <span className="badge bg-light text-dark">{tag.confidence}%</span>
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                <p className="text-muted">No tags found.</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
