"use client";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  const [imageUrl, setImageUrl] = useState(null);
  const [imageDetails, setImageDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [confidence, setConfidence] = useState(0.3);
  const [selectedModels, setSelectedModels] = useState([
    "google_tagging",
    "aws_rek_tagging",
    "imagga_tagging",
  ]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://upload-widget.cloudinary.com/global/all.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleModelChange = (model) => {
    setSelectedModels((prev) =>
      prev.includes(model)
        ? prev.filter((m) => m !== model)
        : [...prev, model]
    );
  };

  const handleUpload = async () => {
    try {
      const signResponse = await fetch("/api/sign-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const { cloudName } = await signResponse.json();

      if (window.cloudinary) {
        const uploadWidget = window.cloudinary.createUploadWidget(
          {
            cloudName,
            uploadSignature: async (callback) => {
              const signRes = await fetch("/api/sign-upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
              });

              const { signature, timestamp, apiKey } = await signRes.json();
              callback({ signature, timestamp, api_key: apiKey });
            },
            multiple: false,
            folder: "signed_upload_demo_uw",
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
      setLoading(true);
      const optimizedUrl = url.replace("/upload/", "/upload/w_1000,f_auto/");
      const response = await fetch("/api/image-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: optimizedUrl, confidence, models: selectedModels }),
      });

      const data = await response.json();

      // Filter out unselected models
      const filteredTags = Object.fromEntries(
        Object.entries(data.tags).filter(([model]) => selectedModels.includes(model))
      );

      setImageDetails({ ...data, tags: filteredTags });
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
      <p className="mb-4">
        Automatically tag images using AI-powered object detection models. Try multiple AI tagging options effortlessly!
      </p>

      <div className="d-flex justify-content-center mb-4 gap-4 flex-wrap">
        <div className="upload-box">
          <img src="/cld-logo.png" alt="Upload" className="upload-icon" />
          <h3>Upload an Image to Tag</h3>
          <button className="upload-btn" onClick={handleUpload}>
            Upload Image
          </button>
          <p className="drag-text">Or drag your images here</p>
        </div>

        <div className="config-panel text-start">
          <label htmlFor="confidence" className="form-label">
            Confidence Threshold: <strong>{confidence}</strong>
          </label>
          <div className="mb-3 mt-1">
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

          <div className="model-selection">
            <label className="form-label fw-bold">Select AI Models:</label>
            {[
              "google_tagging",
              "aws_rek_tagging",
              "imagga_tagging",
              "cld-fashion",
              "coco",
              "lvis",
              "unidet",
            ].map((model) => (
              <div className="form-check" key={model}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={selectedModels.includes(model)}
                  onChange={() => handleModelChange(model)}
                  id={`check-${model}`}
                />
                <label className="form-check-label" htmlFor={`check-${model}`}>
                  {model.replace(/_/g, " ").toUpperCase()}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {imageUrl && (
        <div className="result-container">
          <div className="image-and-tags">
            <div className="image-container">
              <img src={imageUrl} alt="Uploaded" className="uploaded-image" />
            </div>

            <div className="tags-container">
              {loading ? (
                <div className="loading-container">
                  <div className="spinner"></div>
                  <p>Loading tags...</p>
                </div>
              ) : (
                imageDetails &&
                Object.entries(imageDetails.tags).map(([model, tags]) => {
                  const isExpanded = expanded[model] || false;
                  const displayedTags = isExpanded ? tags : tags.slice(0, 10);

                  return (
                    <div key={model} className="tag-section">
                      <h5 className="tag-title">{model.replace(/_/g, " ").toUpperCase()}</h5>
                      <p className="tag-list">
                        {tags.length > 0 ? (
                          displayedTags.map((tag, index) => (
                            <span key={index}>
                              {tag.name} ({parseFloat(tag.confidence).toFixed(2)}%)
                              {index < displayedTags.length - 1 ? ", " : ""}
                            </span>
                          ))
                        ) : (
                          <span className="no-tags-text">No tags found.</span>
                        )}
                      </p>
                      {tags.length > 10 && (
                        <button className="show-more-btn" onClick={() => setExpanded(prev => ({ ...prev, [model]: !prev[model] }))}>
                          {isExpanded ? "Show Less" : "Show More"}
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
