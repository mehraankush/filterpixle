const API_KEY = '44294631-995e47378af068a76503e2329';
const API_URL = `https://pixabay.com/api/?key=${API_KEY}&per_page=20`;
let currentPage = 1;
const gallery = document.getElementById('gallery');
const loading = document.getElementById('loading');
const columnsSelect = document.getElementById('columns');
let currentFocusIndex = -1;
let colums = 3

// Fetch images from Api
async function fetchImages() {
    loading.classList.remove('hidden');
    const response = await fetch(`${API_URL}&page=${currentPage}`);
    const data = await response.json();
    console.log(data)
    displayImages(data.hits);
    loading.classList.add('hidden');
    currentPage++;
}

// Display images in My gallery
function displayImages(images) {
    images.forEach(image => {
        const container = document.createElement('div');
        container.className = 'image-container';

        const img = document.createElement('img');
        img.src = image.webformatURL;
        img.alt = "wait.. 🥰";
        img.dataset.tags = image.tags;

        const tags = document.createElement('div');
        tags.className = 'tags';
        tags.classList.add('.tags')
        tags.innerText = image.tags;

        container.appendChild(img);
        container.appendChild(tags);
        gallery.appendChild(container);
    });
}

// Update gallery layout based on dropdown selection
function updateGalleryColumns() {
    columns = columnsSelect.value;
    gallery.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    adjustImageWidth(columns);
}

columnsSelect.addEventListener('change', updateGalleryColumns);

function adjustImageWidth(numColumns) {
    const images = document.querySelectorAll('#gallery img');
    const galleryWidth = gallery.clientWidth;
    const imageWidth = (galleryWidth - (numColumns - 1) * 10) / numColumns; // Subtracting gaps
    console.log(imageWidth)
    images.forEach(image => {
        image.style.width = `${imageWidth}px`;
        image.style.height = `${imageWidth}px`;
    });
}

// Infinite scrolling and lazy loading
function lazyLoad() {
    const images = gallery.getElementsByTagName('img');
    const lastImage = images[images.length - 1];
    if (lastImage && lastImage.getBoundingClientRect().bottom <= window.innerHeight) {
        fetchImages();
    }
    adjustImageWidth(columns)
}
// Infinite scrolling
function infiniteScroll() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        fetchImages();
    }
}

// Highlight focused image
function updateFocus() {
    const images = gallery.getElementsByTagName('img');
    if (currentFocusIndex >= 0 && currentFocusIndex < images.length) {
        images[currentFocusIndex].classList.add('focused');
        images[currentFocusIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Remove highlight from all images
function clearFocus() {
    const images = gallery.getElementsByTagName('img');
    for (let img of images) {
        img.classList.remove('focused');
    }
}

function filterImagesByTags(input) {
    console.log(input, "input")
    const images = gallery.getElementsByTagName('img');
    const searchValue = input.trim().toLowerCase();
    for (let img of images) {
        const tags = img.dataset.tags.toLowerCase();
        if (tags.includes(searchValue)) {
            img.style.display = 'block';
        } else {
            img.style.display = 'none';
        }
    }
}

// Handle input in the search field
document.getElementById('search').addEventListener('input', function (event) {
    const searchValue = event.target.value;
    filterImagesByTags(searchValue);
});

// Handle arrow key navigation
function handleKeyNavigation(event) {
    const images = gallery.getElementsByTagName('img');
    if (images.length === 0) return;

    switch (event.key) {
        case 'ArrowDown':
            clearFocus();
            currentFocusIndex = Math.min(currentFocusIndex + 3, images.length - 1);
            updateFocus();
            break;
        case 'ArrowUp':
            clearFocus();
            currentFocusIndex = Math.max(currentFocusIndex - 3, 0);
            updateFocus();
            break;
        case 'ArrowRight':
            clearFocus();
            currentFocusIndex = Math.min(currentFocusIndex + 1, images.length - 1);
            updateFocus();
            break;
        case 'ArrowLeft':
            clearFocus();
            currentFocusIndex = Math.max(currentFocusIndex - 1, 0);
            updateFocus();
            break;
    }
}

// Initial image fetch and gallery setup
fetchImages();
updateGalleryColumns();
window.addEventListener('scroll', lazyLoad);
window.addEventListener('scroll', infiniteScroll);
window.addEventListener('keydown', handleKeyNavigation);