
/* =====================================
   ARCHIVE — CONFIGURATION
===================================== */

const archiveArea = document.getElementById("archiveArea");
const photoLayer = document.getElementById("photoLayer");

const imageViewer = document.getElementById("imageViewer");
const viewerImage = document.getElementById("viewerImage");
const viewerClose = document.getElementById("viewerClose");

let topZIndex = 10;
let activePhoto = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let moved = false;
let startX = 0;
let startY = 0;

/* =====================================
   RANDOM HELPERS
===================================== */

function random(min, max) {
  return Math.random() * (max - min) + min;
}

/* =====================================
   LOAD IMAGES
===================================== */

async function loadArchive() {
  try {
    const response = await fetch("./images.json");

    if (!response.ok) {
      throw new Error("Impossible de charger images.json");
    }

    const images = await response.json();

    if (!Array.isArray(images)) {
      throw new Error("images.json doit contenir une liste");
    }

    photoLayer.innerHTML = "";

    images.forEach((image, index) => {
      createPhoto(image, index, images.length);
    });

  } catch (error) {
    console.error("Erreur archive :", error);
  }
}

/* =====================================
   CREATE FLOATING PHOTO
===================================== */

function createPhoto(image, index, total) {
  const photo = document.createElement("div");
  const img = document.createElement("img");

  photo.className = "photo";

  img.src = image;
  img.alt = "Archive 3D " + (index + 1);
  img.draggable = false;
  img.loading = "lazy";

  // Taille aléatoire
  const isMobile = window.innerWidth < 600;

  const width = isMobile
    ? random(30, 45)
    : random(15, 29);

  photo.style.width = width + "vw";

  // Position aléatoire
  const maxX = Math.max(0, 100 - width);
  const x = random(2, maxX);
  const y = random(5, 95);

  photo.style.left = x + "%";
  photo.style.top = y + "%";

  // Rotation initiale
  const rotation = random(-12, 12);
  photo.style.transform = `rotate(${rotation}deg)`;

  // Profondeur
  photo.style.zIndex = index + 1;

  // Wiggle et flottement indépendants
  photo.style.animationDuration = random(4, 9) + "s";
  photo.style.animationDelay = random(-8, 0) + "s";

  img.style.animationDuration = random(2.5, 5) + "s";
  img.style.animationDelay = random(-5, 0) + "s";

  // Apparition progressive
  photo.style.opacity = "0";
  photo.style.transition =
    "opacity 0.8s ease, filter 0.4s ease";

  img.addEventListener("load", () => {
    photo.style.opacity = "1";
  });

  img.addEventListener("error", () => {
    console.warn("Image introuvable :", image);
    photo.remove();
  });

  photo.appendChild(img);
  photoLayer.appendChild(photo);

  // Interaction
  photo.addEventListener("pointerdown", startDrag);
  photo.addEventListener("pointerup", endDrag);
  photo.addEventListener("click", openViewer);

  return photo;
}

/* =====================================
   DRAG — MOUSE & TOUCH
===================================== */

function startDrag(event) {
  if (event.button !== undefined && event.button !== 0) return;

  activePhoto = event.currentTarget;

  const rect = activePhoto.getBoundingClientRect();

  dragOffsetX = event.clientX - rect.left;
  dragOffsetY = event.clientY - rect.top;

  startX = event.clientX;
  startY = event.clientY;
  moved = false;

  topZIndex++;
  activePhoto.style.zIndex = topZIndex;

  activePhoto.style.animationPlayState = "paused";

  activePhoto.setPointerCapture(event.pointerId);
}

function dragPhoto(event) {
  if (!activePhoto) return;

  const distance = Math.hypot(
    event.clientX - startX,
    event.clientY - startY
  );

  if (distance > 5) {
    moved = true;
  }

  if (!moved) return;

  const layerRect = photoLayer.getBoundingClientRect();

  const x =
    event.clientX - layerRect.left - dragOffsetX;

  const y =
    event.clientY - layerRect.top - dragOffsetY;

  activePhoto.style.left =
    (x / layerRect.width) * 100 + "%";

  activePhoto.style.top =
    (y / layerRect.height) * 100 + "%";
}

function endDrag() {
  if (!activePhoto) return;

  activePhoto.style.animationPlayState = "running";

  activePhoto = null;
}

document.addEventListener("pointermove", dragPhoto);

document.addEventListener("pointerup", endDrag);

/* =====================================
   IMAGE VIEWER
===================================== */

function openViewer(event) {
  if (moved) {
    moved = false;
    return;
  }

  const img = event.currentTarget.querySelector("img");

  if (!img) return;

  viewerImage.src = img.src;

  imageViewer.classList.add("active");

  document.body.style.overflow = "hidden";
}

function closeViewer() {
  imageViewer.classList.remove("active");

  document.body.style.overflow = "";
}

viewerClose.addEventListener("click", closeViewer);

imageViewer.addEventListener("click", (event) => {
  if (event.target === imageViewer) {
    closeViewer();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeViewer();
  }
});

/* =====================================
   INIT
===================================== */

loadArchive();
