import type { MetadataRoute } from "next";

export default async function robots() : Promise<MetadataRoute.Robots>{
    const baseUrl = "https://laundry-hub.vercel.app/";

    return {
        rules: {
            userAgent: "*",
            allow: ["/", "/auth"],
            disallow: []
        },
        sitemap: `${baseUrl}/sitemap.xml`
    }
}