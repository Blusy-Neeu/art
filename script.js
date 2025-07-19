document.addEventListener("DOMContentLoaded", () => {
    const imageGrid = document.getElementById("image-grid");
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightbox-image");
    const closeButton = document.querySelector(".close-button");
    const prevButton = document.querySelector(".prev");
    const nextButton = document.querySelector(".next");
    const loadingIndicator = document.querySelector(".loading-indicator");

    let images = [];
    let currentIndex = 0;

    // Fetch the number of images from config.csv
    fetch('config.csv')
        .then(response => response.text())
        .then(text => {
            const imageCount = parseInt(text.trim(), 10);
            if (!isNaN(imageCount)) {
                for (let i = 1; i <= imageCount; i++) {
                    images.push(`${String(i).padStart(4, '0')}.png`);
                }
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
        lightbox.style.display = "flex";
        updateLightboxImage();
    }

    function updateLightboxImage() {
        // Show loading indicator and hide the image
        loadingIndicator.style.display = "block";
        lightboxImage.style.display = "none";
        
        // Hide navigation arrows while loading
        prevButton.style.display = "none";
        nextButton.style.display = "none";

        const imageName = images[currentIndex];
        const highResImagePath = `images/full/${imageName}`;

        // Create a new image object to load the image in the background
        const img = new Image();
        img.src = highResImagePath;

        img.onload = () => {
            // Once loaded, update the lightbox image source
            lightboxImage.src = highResImagePath;
            
            // Hide loading indicator and show the image
            loadingIndicator.style.display = "none";
            lightboxImage.style.display = "block";
            
            // Show navigation arrows again
            prevButton.style.display = "block";
            nextButton.style.display = "block";
        };
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
    prevButton.addEventListener("click", showNextImage);
    nextButton.addEventListener("click", showPrevImage);

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
        if (lightbox.style.display === "flex") {
            if (e.key === "ArrowRight") showNextImage();
            if (e.key === "ArrowLeft") showPrevImage();
            if (e.key === "Escape") closeLightbox();
        }
    });
});