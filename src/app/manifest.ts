import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CatanMapGen",
    short_name: "CatanMapGen",
    description:
      "Catan Map Generator for 4 and 6 players. With customizations to make sure no 2 resources of same type or no 2 same numbers touch. Make it more interesting with a surprise mode, where you don't know the resources or numbers until you place the initial settlements and roads.",
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    theme_color: "#dbeafe",
    background_color: "#dbeafe",
    display: "standalone",
  };
}
