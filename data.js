// ===== Naginyata site content =====
// Edit this file to update profile, links and artworks.
// Artwork images: put files in /images and set image: "images/xxx.jpg"
// If image is empty, a placeholder card is shown.

window.SITE = {
  name: "Naginyata",
  role: "Illustrator / Artist",
  tagline: "Show my artwork",
  about: [
    "Hello, I'm Naginyata, an illustrator and artist.",
    "This is a small home for my artwork. Profile text will be updated soon."
  ],
  avatar: "", // e.g. "images/profile.jpg"

  // Leave url empty ("") to show the link as "coming soon"
  links: [
    { label: "X (Twitter)", handle: "@NagiNyata", url: "https://x.com/NagiNyata" },
    { label: "Instagram", handle: "@naginyata", url: "https://www.instagram.com/naginyata" },
    { label: "Fanbox / Patreon / Ko-fi", handle: "", url: "" }
  ],

  categories: ["Illustration", "Sketch", "Character", "Other"],

  artworks: [
    { title: "Artwork 01", category: "Illustration", year: "2026", image: "" },
    { title: "Artwork 02", category: "Illustration", year: "2026", image: "" },
    { title: "Artwork 03", category: "Character", year: "2026", image: "" },
    { title: "Artwork 04", category: "Sketch", year: "2026", image: "" },
    { title: "Artwork 05", category: "Character", year: "2026", image: "" },
    { title: "Artwork 06", category: "Other", year: "2026", image: "" }
  ],

  // Contact form endpoint (leave "" until set up).
  // While empty, the form falls back to opening the visitor's mail app
  // addressed to contactEmail.
  contactEndpoint: "",
  contactEmail: "naginyata.draws@gmail.com"
};
