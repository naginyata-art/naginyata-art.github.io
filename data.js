// ===== Naginyata site content =====
// Edit this file to update profile, links and artworks.
// Artwork images: put files in /images and set image: "images/xxx.jpg"
// "alt" is the text shown when hovering an artwork (falls back to title).
// sample:true shows a small SAMPLE badge. Remove it when a real artwork replaces the sample.

window.SITE = {
  name: "Naginyata",
  role: "Illustrator / Artist",
  introSub: "Digital Art · Traditional",
  slogan: "Show my artwork",
  smallText: "Digital and traditional illustration by Naginyata.",
  avatar: "images/avatar-sample.svg", // replace with the real icon, e.g. "images/profile.jpg"

  // Sample text. The real profile will replace it.
  about: [
    "Hi, I'm Naginyata, an illustrator and artist working in both digital and traditional media.",
    "I love drawing quiet, natural scenes and characters. Commissions and collaborations are welcome. (Sample text: the real profile goes here.)"
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
    { title: "Moon and Ridges", alt: "Moon and Ridges (sample)", category: "Digital Art", image: "images/sample-01.svg", sample: true },
    { title: "Waves", alt: "Waves (sample)", category: "Digital Art", image: "images/sample-02.svg", sample: true },
    { title: "Circles", alt: "Circles (sample)", category: "Traditional", image: "images/sample-03.svg", sample: true },
    { title: "Diagonal", alt: "Diagonal (sample)", category: "Digital Art", image: "images/sample-04.svg", sample: true },
    { title: "Mountains", alt: "Mountains (sample)", category: "Traditional", image: "images/sample-05.svg", sample: true },
    { title: "Dots", alt: "Dots (sample)", category: "Digital Art", image: "images/sample-06.svg", sample: true }
  ],

  // Contact form endpoint (leave "" until set up).
  // While empty, the form falls back to opening the visitor's mail app
  // addressed to contactEmail.
  contactEndpoint: "",
  contactEmail: "naginyata.draws@gmail.com"
};
