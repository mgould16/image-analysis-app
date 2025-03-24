import "@/styles/not-found.css";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="not-found-page">
            <div className="container text-center">
                {/* Cloudinary 404 Image */}
                <Image
                    src="https://res.cloudinary.com/cloudinary-marketing/image/upload/f_auto,q_auto,w_300/v1645793993/404_2x.jpg"
                    alt="404 Not Found"
                    width={800}
                    height={400}
                    className="not-found-image"
                    priority
                />

                <h1 className="not-found-title">Page Not Found (404)</h1>

                <p className="not-found-text">
                    The page you were looking for doesn&#39;t exist. You may have mistyped the address or the page may have moved.
                </p>

                {/* Go Back Button */}
                <Link href="/" className="not-found-button">
                    Go Back
                </Link>
            </div>
        </div>
    );
}
