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
                                { href: "/platform", label: "Platform" },
                                { href: "/products/image", label: "Image" },
                                { href: "/products/video", label: "Video" },
                                { href: "/products/digital_asset_management", label: "DAM" },
                                { href: "/demos", label: "Demos" },
                                { href: "/pricing", label: "Pricing" },
                                { href: "/faq", label: "FAQ" }
                            ]} />

                            <FooterNav title="Solutions" links={[
                                { href: "/solutions/ecommerce", label: "E-commerce" },
                                { href: "/solutions/retail", label: "Retail" },
                                { href: "/solutions/industries/media_entertainment", label: "Media & Entertainment" },
                                { href: "/solutions/industries/travel_hospitality", label: "Travel & Hospitality" },
                                { href: "/solutions/industries/cloudinary-for-nonprofits", label: "Non-Profits" },
                                { href: "/customers", label: "Our Customers" },
                                { href: "/resources", label: "Resource Library" }
                            ]} />

                            <FooterNav title="Developers" links={[
                                { href: "/image-api", label: "Image API" },
                                { href: "/video_api", label: "Video API" },
                                { href: "https://cloudinary.com/developers", label: "Getting Started" },
                                { href: "/documentation", label: "Documentation" },
                                { href: "/documentation/cloudinary_sdks", label: "SDKs" },
                                { href: "/addons", label: "Add-Ons" },
                                { href: "/podcasts", label: "Podcasts" }
                            ]} />

                            <FooterNav title="Company" links={[
                                { href: "/about", label: "About Us" },
                                { href: "/customers", label: "Customers" },
                                { href: "/partners", label: "Partners" },
                                { href: "/events", label: "Events" },
                                { href: "/careers", label: "Careers" },
                                { href: "/newsroom", label: "Newsroom" },
                                { href: "https://cloudinary.com/blog/", label: "Blog" },
                                { href: "/trust", label: "Trust" }
                            ]} />

                            <FooterNav title="Contact Us" links={[
                                { href: "https://support.cloudinary.com/hc/en-us", label: "Technical Support" },
                                { href: "/contact", label: "Contact Sales" },
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
                                <li><Link href="/https://cloudinary.com/tou">Terms of Use</Link></li>
                                <li><Link href="/https://cloudinary.com/privacy">Privacy Policy</Link></li>
                                <li><Link href="/https://cloudinary.com/dmca">DMCA Notice</Link></li>
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

