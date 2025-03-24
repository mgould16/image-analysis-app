"use client";

import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  const [imageUrl, setImageUrl] = useState(null);
  const [imageDetails, setImageDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [confidence, setConfidence] = useState(0.3);

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
      const optimizedUrl = url.replace("/upload/", "/upload/w_1000,f_auto/");

      const response = await fetch("/api/image-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: optimizedUrl, confidence })
      });

      const data = await response.json();
      setImageDetails(data);
      setExpanded({});
    } catch (error) {
      console.error("❌ Error fetching image details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid page-container text-center">
      <h2 className="mb-3">AI Image Tagging</h2>
      <p className="mb-4">Automatically tag images using AI-powered object detection models. Try multiple AI tagging options effortlessly!</p>

      <div className="upload-container mb-4">
        <div className="upload-box">
          <img src="/cld-logo.png" alt="Upload" className="upload-icon" />
          <h3>Upload an Image to Tag</h3>
          <button className="upload-btn" onClick={handleUpload}>Upload Image</button>
          <p className="drag-text">Or drag your images here</p>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="confidence" className="form-label">
          Confidence Threshold: <strong>{confidence}</strong>
        </label>
        <input
          id="confidence"
          type="range"
          min="0.1"
          max="1"
          step="0.1"
          value={confidence}
          onChange={(e) => setConfidence(parseFloat(e.target.value))}
        />
      </div>

      {imageUrl && (
        <div className="image-section">
          <div className="uploaded-image-wrapper">
            <img src={imageUrl} alt="Uploaded Image" className="uploaded-image" />
          </div>

          <h4 className="image-description">Detected Objects & Tags ({imageDetails?.public_id})</h4>

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

                    {tags.length > 20 && (
                      <button
                        className="show-more-btn"
                        onClick={() =>
                          setExpanded(prev => ({
                            ...prev,
                            [model]: !prev[model]
                          }))
                        }
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
