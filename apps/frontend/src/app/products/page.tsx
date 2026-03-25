
import { ProductsPageClient } from "@/components/core/products-page-client"
import { SetupTooltip } from "@/components/core/setup/setup-tooltip"


export default function ProductsPage() {
  // Server-side check for Shopify configuration
  const isShopifyConfigured = !!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN

  return (
    <>
      <ProductsPageClient />
      {/* Show setup tooltip only when Shopify is not configured */}
      {!isShopifyConfigured && <SetupTooltip />}
    </>
  )
}
