
    // Slideshow control functions
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('next') || event.target.classList.contains('prev')) {
            plusSlides(event.target.classList.contains('next') ? 1 : -1);
        }
    });

    let slideIndex = 0;

    function plusSlides(n) {
        showSlides(slideIndex += n);
    }

    function showSlides(n) {
        const slides = document.querySelectorAll('.mySlides');
        if (slides.length > 0) {
            if (n >= slides.length) { slideIndex = 0; }
            if (n < 0) { slideIndex = slides.length - 1; }
            slides.forEach((slide, i) => {
                slide.style.display = i === slideIndex ? 'block': 'none';
            });
        }
    }