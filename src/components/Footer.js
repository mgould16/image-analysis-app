import "@/styles/footer.css"; // ✅ Import the footer styles
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <footer id="footer" className="site-footer">
            <div className="container-fluid">
                <div className="row footer-holder">
                    <div className="col-xs-12">
                        <div className="widgets">
                            {/* Cloudinary Logo */}
                            <div className="col footer-logo">
                                <Link href="/">
                                    <Image
                                        src="https://cloudinary-res.cloudinary.com/image/upload/c_scale,w_160/v1/cloudinary_logo_for_white_bg.svg"
                                        alt="Cloudinary Logo"
                                        width={160}
                                        height={30}
                                    />
                                </Link>
                            </div>

                            {/* Footer Navigation Sections */}
                            <FooterNav title="Products" links={[
                                { href: "https://cloudinary.com/platform", label: "Platform" },
                                { href: "https://cloudinary.com/products/image", label: "Image" },
                                { href: "https://cloudinary.com/products/video", label: "Video" },
                                { href: "https://cloudinary.com/products/digital_asset_management", label: "DAM" },
                                { href: "https://cloudinary.com/demos", label: "Demos" },
                                { href: "https://cloudinary.com/pricing", label: "Pricing" },
                                { href: "https://cloudinary.com/faq", label: "FAQ" }
                            ]} />

                            <FooterNav title="Solutions" links={[
                                { href: "https://cloudinary.com/solutions/ecommerce", label: "E-commerce" },
                                { href: "https://cloudinary.com/solutions/retail", label: "Retail" },
                                { href: "https://cloudinary.com/solutions/industries/media_entertainment", label: "Media & Entertainment" },
                                { href: "https://cloudinary.com/solutions/industries/travel_hospitality", label: "Travel & Hospitality" },
                                { href: "https://cloudinary.com/solutions/industries/cloudinary-for-nonprofits", label: "Non-Profits" },
                                { href: "https://cloudinary.com/customers", label: "Our Customers" },
                                { href: "https://cloudinary.com/resources", label: "Resource Library" }
                            ]} />

                            <FooterNav title="Developers" links={[
                                { href: "https://cloudinary.com/image-api", label: "Image API" },
                                { href: "https://cloudinary.com/video_api", label: "Video API" },
                                { href: "ttps://cloudinary.com/developers", label: "Getting Started" },
                                { href: "https://cloudinary.com/documentation", label: "Documentation" },
                                { href: "https://cloudinary.com/documentation/cloudinary_sdks", label: "SDKs" },
                                { href: "https://cloudinary.com/addons", label: "Add-Ons" },
                                { href: "https://cloudinary.com/podcasts", label: "Podcasts" }
                            ]} />

                            <FooterNav title="Company" links={[
                                { href: "https://cloudinary.com/about", label: "About Us" },
                                { href: "https://cloudinary.com/customers", label: "Customers" },
                                { href: "https://cloudinary.com/partners", label: "Partners" },
                                { href: "https://cloudinary.com/events", label: "Events" },
                                { href: "https://cloudinary.com/careers", label: "Careers" },
                                { href: "https://cloudinary.com/newsroom", label: "Newsroom" },
                                { href: "https://cloudinary.com/blog/", label: "Blog" },
                                { href: "https://cloudinary.com/trust", label: "Trust" }
                            ]} />

                            <FooterNav title="Contact Us" links={[
                                { href: "https://support.cloudinary.com/hc/en-us", label: "Technical Support" },
                                { href: "https://cloudinary.com/contact", label: "Contact Sales" },
                                { href: "https://training.cloudinary.com/", label: "Education & Training" }
                            ]} />

                            {/* Social Media Links */}
                            <SocialLinks />

                            {/* Certification Logos */}
                            <div className="footer-seals">
                                <Image src="https://cloudinary-res.cloudinary.com/image/upload/v1563215041/website/seals/L_ISO_27001_2013_E.png" alt="ISO Certification" width={76} height={76} />
                                <Image src="https://cloudinary-res.cloudinary.com/image/upload/v1563215041/website/seals/GDPR.png" alt="GDPR Certified" width={76} height={76} />
                                <Image src="https://cloudinary-res.cloudinary.com/image/upload/v1563215041/website/seals/21972-312_SOC_NonCPA.png" alt="SOC Certification" width={76} height={76} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Bottom Section */}
            <div className="footer-bot">
                <div className="container-fluid">
                    <div className="row footer-frame">
                        <div className="col-xs-12 col-sm-6">
                            <div className="widget_text footer-nav"></div>
                        </div>
                        <div className="col-xs-12 col-sm-6">
                            <ul className="footer-links">
                                <li><Link href="https://cloudinary.com/tou">Terms of Use</Link></li>
                                <li><Link href="https://cloudinary.com/privacy">Privacy Policy</Link></li>
                                <li><Link href="https://cloudinary.com/dmcas">DMCA Notice</Link></li>
                            </ul>
                            <div className="copyright">
                                <p>&copy; {new Date().getFullYear()} Cloudinary. All rights reserved.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

// Footer Navigation Component
const FooterNav = ({ title, links }) => (
    <div className="col">
        <nav className="widget_text footer-nav">
            <strong className="title">{title}</strong>
            <ul>
                {links.map((link, index) => (
                    <li key={index}><Link href={link.href}>{link.label}</Link></li>
                ))}
            </ul>
        </nav>
    </div>
);

// Social Media Links Component
const SocialLinks = () => (
    <div className="footer-social">
        <ul className="social-networks">
        </ul>
    </div>
);

