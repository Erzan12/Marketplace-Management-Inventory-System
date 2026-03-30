"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ExternalLink, Store, ShoppingCart, ArrowRight } from "lucide-react"
import { useState } from "react"

type WizardStep = "welcome" | "has-store" | "get-url" | "create-store" | "verify"

export function SetupWizard() {
  const [currentStep, setCurrentStep] = useState<WizardStep>("welcome")
  const [hasStore, setHasStore] = useState<boolean | null>(null)
  const [storeUrl, setStoreUrl] = useState("")
  const [wantsCart, setWantsCart] = useState<boolean | null>(null)

  const handleStoreChoice = (hasExistingStore: boolean) => {
    setHasStore(hasExistingStore)
    if (hasExistingStore) {
      setCurrentStep("get-url")
    } else {
      setCurrentStep("create-store")
    }
  }

  const handleStoreUrlSubmit = () => {
    if (storeUrl.trim()) {
      // Here you would typically validate the store URL and set the environment variable
      // For now, we'll just show a success message
      setCurrentStep("verify")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center ${currentStep !== "welcome" ? "text-black" : "text-gray-400"}`}>
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                  currentStep !== "welcome" ? "bg-black text-white border-black" : "border-gray-300"
                }`}
              >
                {currentStep !== "welcome" ? <CheckCircle className="w-4 h-4" /> : "1"}
              </div>
              <span className="ml-2 font-medium">Welcome</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div
              className={`flex items-center ${["get-url", "create-store", "verify"].includes(currentStep) ? "text-black" : "text-gray-400"}`}
            >
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                  ["get-url", "create-store", "verify"].includes(currentStep)
                    ? "bg-black text-white border-black"
                    : "border-gray-300"
                }`}
              >
                {["verify"].includes(currentStep) ? <CheckCircle className="w-4 h-4" /> : "2"}
              </div>
              <span className="ml-2 font-medium">Setup Store</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className={`flex items-center ${currentStep === "verify" ? "text-black" : "text-gray-400"}`}>
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                  currentStep === "verify" ? "bg-black text-white border-black" : "border-gray-300"
                }`}
              >
                3
              </div>
              <span className="ml-2 font-medium">Complete</span>
            </div>
          </div>
        </div>

        {/* Welcome Step */}
        {currentStep === "welcome" && (
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="bg-black rounded-full p-4">
                  <Store className="w-12 h-12 text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-black mb-2">Welcome to ShopFuture</CardTitle>
              <p className="text-xl text-gray-600">Let's set up your e-commerce store</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-6">
                  To get started, we need to connect your Shopify store. Shopify will handle your products, orders, and
                  checkout while we create a beautiful storefront.
                </p>

                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-black mb-3">Why Shopify?</h3>
                  <ul className="text-sm text-gray-600 space-y-2 text-left max-w-md mx-auto">
                    <li>• World's best converting checkout</li>
                    <li>• Complete order management</li>
                    <li>• Built-in CRM and analytics</li>
                    <li>• Starting at $39/month</li>
                    <li>• 3-day free trial available</li>
                  </ul>
                </div>

                <h3 className="text-lg font-semibold text-black mb-4">Do you already have a Shopify store?</h3>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => handleStoreChoice(true)}
                    className="bg-black text-white hover:bg-black/90 px-8 py-6 text-lg"
                  >
                    Yes, I have a store
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button
                    onClick={() => handleStoreChoice(false)}
                    variant="outline"
                    className="border-black text-black hover:bg-black hover:text-white px-8 py-6 text-lg bg-transparent"
                  >
                    No, I need to create one
                    <ExternalLink className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Get Store URL Step */}
        {currentStep === "get-url" && (
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-black">Connect Your Shopify Store</CardTitle>
              <p className="text-gray-600">We need your store's domain to connect everything</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-black mb-3">How to find your store domain:</h3>
                <ol className="text-sm text-gray-600 space-y-2">
                  <li>
                    1. Log into your Shopify Admin at{" "}
                    <a
                      href="https://admin.shopify.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black underline"
                    >
                      admin.shopify.com
                    </a>
                  </li>
                  <li>
                    2. Look at the URL after logging in:{" "}
                    <code className="bg-white px-2 py-1 rounded">admin.shopify.com/store/YOUR-STORE-ID</code>
                  </li>
                  <li>3. Or go to Settings → Domains</li>
                  <li>
                    4. Copy your full store URL (e.g.,{" "}
                    <code className="bg-white px-2 py-1 rounded">your-store.myshopify.com</code>)
                  </li>
                </ol>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-black mb-2 block">Your Shopify Store Domain</span>
                  <Input
                    type="text"
                    placeholder="your-store.myshopify.com"
                    value={storeUrl}
                    onChange={(e) => setStoreUrl(e.target.value)}
                    className="text-lg py-3"
                  />
                </label>

                <div className="space-y-4">
                  <h3 className="font-semibold text-black">Shopping Cart Preference</h3>
                  <p className="text-sm text-gray-600">How would you like customers to shop?</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant={wantsCart === true ? "default" : "outline"}
                      onClick={() => setWantsCart(true)}
                      className={wantsCart === true ? "bg-black text-white" : "border-gray-300 bg-transparent"}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      variant={wantsCart === false ? "default" : "outline"}
                      onClick={() => setWantsCart(false)}
                      className={wantsCart === false ? "bg-black text-white" : "border-gray-300 bg-transparent"}
                    >
                      Direct to Checkout
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleStoreUrlSubmit}
                  disabled={!storeUrl.trim() || wantsCart === null}
                  className="w-full bg-black text-white hover:bg-black/90 py-3 text-lg"
                >
                  Connect Store
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Create Store Step */}
        {currentStep === "create-store" && (
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-black">Create Your Shopify Store</CardTitle>
              <p className="text-gray-600">Let's get you set up with a new Shopify store</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-black mb-3">Why Shopify is perfect for your store:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <h4 className="font-medium text-black">Business Features</h4>
                    <ul className="space-y-1 mt-2">
                      <li>• World-class checkout conversion</li>
                      <li>• Complete order management</li>
                      <li>• Built-in payment processing</li>
                      <li>• Inventory management</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-black">Pricing</h4>
                    <ul className="space-y-1 mt-2">
                      <li>• 3-day free trial</li>
                      <li>• Then $1/month for 3 months</li>
                      <li>• Regular price: $39/month</li>
                      <li>• No setup fees</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-center space-y-4">
                <Button asChild className="bg-black text-white hover:bg-black/90 px-8 py-6 text-lg">
                  <a href="https://shopify.com/free-trial" target="_blank" rel="noopener noreferrer">
                    Create Shopify Store
                    <ExternalLink className="ml-2 w-5 h-5" />
                  </a>
                </Button>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>After creating your store:</strong> Come back here and click "I have a store" to continue
                    the setup process.
                  </p>
                </div>

                <Button
                  onClick={() => setCurrentStep("welcome")}
                  variant="outline"
                  className="border-gray-300 bg-transparent"
                >
                  ← Back to Start
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Verify Step */}
        {currentStep === "verify" && (
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 rounded-full p-4">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-black">Almost Ready!</CardTitle>
              <p className="text-gray-600">Your store connection is being set up</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-black mb-3">Next Steps:</h3>
                <ol className="text-sm text-gray-600 space-y-2">
                  <li>
                    1. <strong>Add Products:</strong> Go to your Shopify admin and add some products
                  </li>
                  <li>
                    2. <strong>Set Environment Variable:</strong> Add{" "}
                    <code className="bg-white px-2 py-1 rounded">NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN={storeUrl}</code> to
                    your project
                  </li>
                  <li>
                    3. <strong>Restart:</strong> Restart your development server to see your products
                  </li>
                </ol>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-black mb-3">Store Configuration:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Store Domain:</span>
                    <Badge variant="secondary" className="bg-gray-100 text-black">
                      {storeUrl}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cart Mode:</span>
                    <Badge variant="secondary" className="bg-gray-100 text-black">
                      {wantsCart ? "Shopping Cart" : "Direct Checkout"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Button asChild className="bg-black text-white hover:bg-black/90 px-8 py-3">
                  <a href={`https://${storeUrl}/admin/products`} target="_blank" rel="noopener noreferrer">
                    Add Products to Store
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
