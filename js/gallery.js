/* --- Gallery Modal & Zoom & Change Background Logic --- */
let currentZoom = 1;
let activeModalImgSrc = '';

function openGalleryModal(imgSrc, title, desc) {
    activeModalImgSrc = imgSrc;
    const imgElem = document.getElementById('modalImg');
    imgElem.src = imgSrc;
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalDesc').innerText = desc;

    resetZoomImage();
    document.getElementById('galleryModal').classList.remove('hidden');
}

function closeGalleryModal() {
    document.getElementById('galleryModal').classList.add('hidden');
}

function zoomImage(amount) {
    currentZoom += amount;
    if (currentZoom < 0.5) currentZoom = 0.5;
    if (currentZoom > 3) currentZoom = 3;
    document.getElementById('modalImg').style.transform = `scale(${currentZoom})`;
}

function resetZoomImage() {
    currentZoom = 1;
    document.getElementById('modalImg').style.transform = `scale(1)`;
}

// Support Mouse Wheel Zoom
document.getElementById('modalImg').addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
        zoomImage(0.15);
    } else {
        zoomImage(-0.15);
    }
});

function applyBackgroundFromModal() {
    if (!activeModalImgSrc) return;
    const body = document.getElementById('mainBody');
    body.style.backgroundImage = `linear-gradient(to bottom, rgba(12, 19, 16, 0.45), rgba(12, 19, 16, 0.88)), url('${activeModalImgSrc}')`;
    closeGalleryModal();
}