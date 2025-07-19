document.addEventListener("DOMContentLoaded", () => {
    const imageGrid = document.getElementById("image-grid");
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightbox-image");
    const closeButton = document.querySelector(".close-button");
    const prevButton = document.querySelector(".prev");
    const nextButton = document.querySelector(".next");

    let images = [];
    let currentIndex = 0;

    // Fetch the number of images from config.csv
    fetch('config.csv')
        .then(response => response.text())
        .then(text => {
            const imageCount = parseInt(text.trim(), 10);
            if (!isNaN(imageCount)) {
                // Create an array of image filenames
                for (let i = 1; i <= imageCount; i++) {
                    images.push(`${String(i).padStart(4, '0')}.png`);
                }
                // Randomize the images array
                images.sort(() => Math.random() - 0.5);
                createImageGrid();
            }
        });

    function createImageGrid() {
        images.forEach((imageName, index) => {
            const img = document.createElement("img");
            img.src = `images/thumbs/${imageName}`;
            img.dataset.index = index;
            img.addEventListener("click", () => openLightbox(index));
            imageGrid.appendChild(img);
        });
    }

    function openLightbox(index) {
        currentIndex = index;
        updateLightboxImage();
        lightbox.style.display = "flex";
    }

    function updateLightboxImage() {
        const imageName = images[currentIndex];
        lightboxImage.src = `images/full/${imageName}`;
    }

    const closeLightbox = () => lightbox.style.display = "none";
    const showNextImage = () => {
        currentIndex = (currentIndex + 1) % images.length;
        updateLightboxImage();
    };
    const showPrevImage = () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateLightboxImage();
    };

    closeButton.addEventListener("click", closeLightbox);
    prevButton.addEventListener("click", showPrevImage);
    nextButton.addEventListener("click", showNextImage);

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
        if (lightbox.style.display === "flex") {
            if (e.key === "ArrowRight") showNextImage();
            if (e.key === "ArrowLeft") showPrevImage();
            if (e.key === "Escape") closeLightbox();
        }
    });
});