// ===== Naginyata site content =====
// Edit this file to update profile, links and artworks.
// Artwork images: put files in /images and set image: "images/xxx.jpg"
// If image is empty, a placeholder card is shown.
// "alt" is the text shown when hovering an artwork (falls back to title).

window.SITE = {
  name: "Naginyata",
  role: "Illustrator / Artist",
  introSub: "Digital Art · Traditional",
  slogan: "Show my artwork",
  smallText: "Digital and traditional illustration by Naginyata.",
  avatar: "", // e.g. "images/profile.jpg"

  about: [
    "Hello, I'm Naginyata, an illustrator and artist.",
    "This is a small home for my artwork. Profile text will be updated soon."
  ],

  // Shown as the 3 boxes on the About Me screen.
  // Leave url empty ("") to show the link as "coming soon"
  links: [
    { label: "X (Twitter)", handle: "@NagiNyata", url: "https://x.com/NagiNyata" },
    { label: "Instagram", handle: "@naginyata", url: "https://www.instagram.com/naginyata" },
    { label: "Fanbox / Patreon / Ko-fi", handle: "", url: "" }
  ],

  // Tab order on the My Work screen ("All" is added last automatically)
  categories: ["Digital Art", "Traditional"],

  artworks: [
    { title: "Artwork 01", alt: "Artwork 01", category: "Digital Art", image: "" },
    { title: "Artwork 02", alt: "Artwork 02", category: "Digital Art", image: "" },
    { title: "Artwork 03", alt: "Artwork 03", category: "Traditional", image: "" },
    { title: "Artwork 04", alt: "Artwork 04", category: "Digital Art", image: "" },
    { title: "Artwork 05", alt: "Artwork 05", category: "Traditional", image: "" },
    { title: "Artwork 06", alt: "Artwork 06", category: "Digital Art", image: "" }
  ],

  // Contact form endpoint (leave "" until set up).
  // While empty, the form falls back to opening the visitor's mail app
  // addressed to contactEmail.
  contactEndpoint: "",
  contactEmail: "naginyata.draws@gmail.com"
};
