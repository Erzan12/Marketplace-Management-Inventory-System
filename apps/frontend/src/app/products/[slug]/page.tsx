
import { ProductPageClient } from "@/components/core/product-page-client"
import { SetupTooltip } from "@/components/core/setup/setup-tooltip"


export default function ProductPage() {
  // Server-side check for Shopify configuration
  const isShopifyConfigured = !!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN

  return (
    <>
      <ProductPageClient />
      {/* Show setup tooltip only when Shopify is not configured */}
      {!isShopifyConfigured && <SetupTooltip />}
    </>
  )
}
