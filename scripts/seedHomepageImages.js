// Script to seed homepage and carousel images into the database
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const FormData = require("form-data");

const IMAGES = [
  // Homepage carousel
  {
    filename: "hero.jpg",
    part: "Homepage Hero 1",
    title: "Homepage Hero 1",
    alt: "Homepage Hero 1",
  },
  {
    filename: "gallery.jpg",
    part: "Homepage Hero 2",
    title: "Homepage Hero 2",
    alt: "Homepage Hero 2",
  },
  {
    filename: "team.jpg",
    part: "Homepage Hero 3",
    title: "Homepage Hero 3",
    alt: "Homepage Hero 3",
  },
  // Team carousel
  {
    filename: "team.jpg",
    part: "Team Photo 1",
    title: "Team Photo 1",
    alt: "Team Photo 1",
  },
  {
    filename: "team.jpg",
    part: "Team Photo 2",
    title: "Team Photo 2",
    alt: "Team Photo 2",
  },
  {
    filename: "team.jpg",
    part: "Team Photo 3",
    title: "Team Photo 3",
    alt: "Team Photo 3",
  },
  // Gallery carousel
  {
    filename: "gallery.jpg",
    part: "Gallery Photo 1",
    title: "Gallery Photo 1",
    alt: "Gallery Photo 1",
  },
  {
    filename: "gallery.jpg",
    part: "Gallery Photo 2",
    title: "Gallery Photo 2",
    alt: "Gallery Photo 2",
  },
  {
    filename: "gallery.jpg",
    part: "Gallery Photo 3",
    title: "Gallery Photo 3",
    alt: "Gallery Photo 3",
  },
  // Board of Advisors carousel
  {
    filename: "hero.jpg",
    part: "Board of Advisors 1",
    title: "Board of Advisors 1",
    alt: "Board of Advisors 1",
  },
  {
    filename: "hero.jpg",
    part: "Board of Advisors 2",
    title: "Board of Advisors 2",
    alt: "Board of Advisors 2",
  },
  {
    filename: "hero.jpg",
    part: "Board of Advisors 3",
    title: "Board of Advisors 3",
    alt: "Board of Advisors 3",
  },
  // Events carousel
  {
    filename: "gallery.jpg",
    part: "Events Section 1",
    title: "Events Section 1",
    alt: "Events Section 1",
  },
  {
    filename: "gallery.jpg",
    part: "Events Section 2",
    title: "Events Section 2",
    alt: "Events Section 2",
  },
  {
    filename: "gallery.jpg",
    part: "Events Section 3",
    title: "Events Section 3",
    alt: "Events Section 3",
  },
];

const IMAGES_DIR = path.join(__dirname, "../../public/images");
const API_URL = "http://localhost:8080/api/admin/images";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";

async function uploadImage({ filename, part, title, alt }) {
  const filePath = path.join(IMAGES_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }
  const form = new FormData();
  form.append("title", title);
  form.append("alt", alt);
  form.append("part", part);
  form.append("file", fs.createReadStream(filePath));
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ADMIN_TOKEN}`,
    },
    body: form,
  });
  if (!res.ok) {
    console.error(`Failed to upload ${filename}:`, await res.text());
  } else {
    console.log(`Uploaded ${filename} as ${part}`);
  }
}

async function main() {
  for (const img of IMAGES) {
    await uploadImage(img);
  }
  console.log("Seeding complete.");
}

main();
