import { Mail, Phone, MapPin } from "lucide-react"
import { getStoreName } from "@/lib/store-name"

export function Footer() {
  // Get dynamic store name for footer branding
  const storeName = getStoreName()

  return (
    <footer className="bg-white border-t border-gray-200 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            {/* Dynamic store name in footer */}
            <h3 className="text-2xl font-bold mb-6 text-black">{storeName}</h3>
            <p className="text-gray-600 mb-6">
              Your destination for innovative products that shape tomorrow. Quality, style, and innovation in every
              purchase.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 text-black">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-black transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-black transition-colors">
                  Products
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-black transition-colors">
                  Categories
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-black transition-colors">
                  Sale
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-black transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 text-black">Customer Service</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-black transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-black transition-colors">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-black transition-colors">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-black transition-colors">
                  Size Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-black transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 text-black">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-black" />
                <span className="text-gray-600">123 Future Street, Tech City, TC 12345</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-black" />
                <span className="text-gray-600">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-black" />
                <span className="text-gray-600">hello@{storeName.toLowerCase().replace(/\s+/g, "")}.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 text-center">
          {/* Dynamic copyright with store name */}
          <p className="text-gray-600">© 2024 {storeName}. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  )
}
