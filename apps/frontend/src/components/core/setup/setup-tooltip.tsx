"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Store, ExternalLink, ArrowRight, Settings, Copy, Check } from "lucide-react"
import { useState } from "react"
import { parseShopifyDomain } from "@/lib/parse-shopify-domain"

export function SetupTooltip() {
  const [isOpen, setIsOpen] = useState(true)
  const [currentStep, setCurrentStep] = useState<"welcome" | "has-store" | "get-url" | "create-store" | "instructions">(
    "welcome",
  )
  const [storeUrl, setStoreUrl] = useState("")
  const [parsedDomain, setParsedDomain] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Handle input change and parse domain in real-time
  const handleStoreUrlChange = (value: string) => {
    setStoreUrl(value)
    const parsed = parseShopifyDomain(value)
    setParsedDomain(parsed)
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button onClick={() => setIsOpen(true)} className="bg-black text-white hover:bg-black/90 shadow-lg" size="lg">
          <Settings className="w-4 h-4 mr-2" />
          Setup Store
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <Card className="shadow-2xl border-2 border-black">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5" />
              <CardTitle className="text-lg">Setup Your Store</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {currentStep === "welcome" && (
            <>
              <p className="text-sm text-gray-600">
                Connect your Shopify store to see real products instead of placeholders.
              </p>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => setCurrentStep("has-store")}
                  className="bg-black text-white hover:bg-black/90 text-sm"
                  size="sm"
                >
                  I have a Shopify store
                  <ArrowRight className="ml-2 w-3 h-3" />
                </Button>
                <Button
                  onClick={() => setCurrentStep("create-store")}
                  variant="outline"
                  className="border-gray-300 bg-transparent text-sm"
                  size="sm"
                >
                  Create new store
                  <ExternalLink className="ml-2 w-3 h-3" />
                </Button>
              </div>
            </>
          )}

          {currentStep === "has-store" && (
            <>
              <p className="text-sm text-gray-600 font-medium">Enter your Shopify store information:</p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs font-medium text-blue-800 mb-2">You can paste any of these formats:</p>
                <div className="text-xs text-blue-700 space-y-1">
                  <p>
                    • Store domain: <code className="bg-white px-1 rounded">your-store.myshopify.com</code>
                  </p>
                  <p>
                    • Full URL: <code className="bg-white px-1 rounded">https://your-store.myshopify.com</code>
                  </p>
                  <p>
                    • Admin URL:{" "}
                    <code className="bg-white px-1 rounded">https://admin.shopify.com/store/your-store</code>
                  </p>
                  <p>
                    • Store ID: <code className="bg-white px-1 rounded">your-store</code>
                  </p>
                </div>
              </div>

              <input
                type="text"
                placeholder="Paste your store URL or ID here..."
                value={storeUrl}
                onChange={(e) => handleStoreUrlChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs text-yellow-800">
                  <strong>Don't worry about the format!</strong> Our system will automatically detect and convert any of
                  these formats to work correctly.
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setCurrentStep("welcome")}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 bg-transparent"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setCurrentStep("instructions")}
                  disabled={!storeUrl.trim()}
                  className="bg-black text-white hover:bg-black/90 flex-1"
                  size="sm"
                >
                  Next: Setup Instructions
                </Button>
              </div>
            </>
          )}

          {currentStep === "instructions" && (
            <>
              <p className="text-sm font-medium text-black">Add Environment Variable:</p>

              <div className="bg-gray-50 rounded-lg p-3 space-y-3">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-700">Variable Name:</p>
                  <div className="flex items-center gap-2 bg-white rounded border p-2">
                    <code className="text-xs flex-1">NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => copyToClipboard("NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN")}
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-700">Variable Value:</p>
                  <div className="flex items-center gap-2 bg-white rounded border p-2">
                    <code className="text-xs flex-1">{storeUrl}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => copyToClipboard(storeUrl || "")}
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs font-medium text-blue-800 mb-2">Where to add it:</p>
                <div className="text-xs text-blue-700 space-y-1">
                  <p>
                    • Click the <strong>Settings</strong> button (⚙️) in the top right
                  </p>
                  <p>
                    • Go to <strong>Environment Variables</strong>
                  </p>
                  <p>
                    • Click <strong>Add Variable</strong>
                  </p>
                  <p>• Paste the name and value above</p>
                  <p>
                    • Click <strong>Save</strong>
                  </p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-xs text-green-800">
                  <strong>Note:</strong> You can paste any format (admin URL, store URL, or just the store ID) - our
                  system will automatically handle the conversion!
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setCurrentStep("has-store")}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 bg-transparent"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setIsOpen(false)}
                  className="bg-black text-white hover:bg-black/90 flex-1"
                  size="sm"
                >
                  Done
                </Button>
              </div>
            </>
          )}

          {currentStep === "create-store" && (
            <>
              <p className="text-sm text-gray-600">Create a new Shopify store with a 3-day free trial.</p>
              <div className="bg-gray-50 rounded-lg p-3">
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• 3-day free trial</li>
                  <li>• Then $1/month for 3 months</li>
                  <li>• World-class checkout</li>
                  <li>• Complete order management</li>
                </ul>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs text-yellow-800">
                  <strong>After creating your store:</strong> Come back here and click "I have a Shopify store" to get
                  setup instructions.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setCurrentStep("welcome")}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 bg-transparent"
                >
                  Back
                </Button>
                <Button asChild className="bg-black text-white hover:bg-black/90 flex-1" size="sm">
                  <a href="https://shopify.com/free-trial" target="_blank" rel="noopener noreferrer">
                    Create Store
                    <ExternalLink className="ml-2 w-3 h-3" />
                  </a>
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
