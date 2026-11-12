/*
	Phantom by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Touch?
		if (browser.mobile)
			$body.addClass('is-touch');

	// Project sketch carousel.
		$('.sketch-carousel').each(function() {
			var $carousel = $(this),
				$image = $carousel.find('.sketch-carousel-image'),
				$status = $carousel.find('.sketch-carousel-status'),
				sketchSet = $carousel.data('sketch-set') || 'bubble',
				sketchPrefix = sketchSet === 'cadplus' ? 'cad_conceptplus' : sketchSet + '_concept',
				sketchName = sketchSet === 'cadplus' ? 'CAD concept plus' : 'Bubble concept',
				images = [1, 2, 3, 4].map(function(number) {
					return {
						src: 'images/' + sketchPrefix + number + '.png',
						alt: sketchName + ' sketch ' + number
					};
				}),
				currentIndex = 0;

			function showImage(index) {
				currentIndex = (index + images.length) % images.length;
				$image.attr('src', images[currentIndex].src);
				$image.attr('alt', images[currentIndex].alt);
				$status.text((currentIndex + 1) + ' / ' + images.length);
			}

			$carousel.find('.sketch-carousel-prev').on('click', function() {
				showImage(currentIndex - 1);
			});

			$carousel.find('.sketch-carousel-next').on('click', function() {
				showImage(currentIndex + 1);
			});
		});

})(jQuery);