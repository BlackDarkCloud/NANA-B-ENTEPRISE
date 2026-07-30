import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nana B Enterprises",
    short_name: "Nana B",
    description: "Quality home appliances, wholesale and retail, with delivery across Ghana.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f8fb",
    theme_color: "#0b2d69",
    icons: [
      {
        src: "/assets/nana-b-logo.jpg",
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
  };
}
