import { parseShopifyDomain } from "./shopify/parse-shopify-domain"

export function getStoreName(): string {
  const rawDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
  const domain = rawDomain ? parseShopifyDomain(rawDomain) : null

  if (!domain) {
    return "Shopify Template"
  }

  const storeName = domain
    .replace(".myshopify.com", "")
    .replace(/[-_]/g, " ")
    .split(" ")
    .map((word: string) =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ")

  return storeName || "Shopify Template"
}