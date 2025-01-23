import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = "https://laundry-hub.vercel.app/";

	const urls = ["auth/sign-in", "auth/sign-up"];
	const optimizedUrl = urls.map((val) => {
		return {
			url: `${baseUrl}${val}`,
			lastModified: new Date(),
		};
	});
	return [
		{
			url: baseUrl,
			lastModified: new Date(),
		},
		...optimizedUrl,
	];
}
