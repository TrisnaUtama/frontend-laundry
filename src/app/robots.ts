import type { MetadataRoute } from "next";

export default async function robots(): Promise<MetadataRoute.Robots> {
	const baseUrl = "https://laundry-hub.vercel.app/";

	return {
		rules: {
			userAgent: "*",
			allow: ["/", "/auth", "/landing-page.png"],
			disallow: [],
		},
		sitemap: `${baseUrl}/sitemap.xml`,
	};
}
