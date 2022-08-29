import '../../css/slide.css';

function homeController($scope, $location, propertyProvider) {
	$scope.page_load_error = null;
	$scope.finished_loading = false;
	$scope.search = {
		type: '', city: '', location: '', price: ''
	};

	let slideIndex = 0;

	// eslint-disable-next-line consistent-return
	function showSlides() {
		if ($location.path() !== '/') {
			return false;
		}
		let i;
		const slides = document.getElementsByClassName('mySlides');
		const dots = document.getElementsByClassName('dot');
		for (i = 0; i < slides.length;) {
			slides[i].style.display = 'none';
			i += 1;
		}
		slideIndex += 1;
		if (slideIndex > slides.length) {
			slideIndex = 1;
		}
		for (i = 0; i < dots.length;) {
			dots[i].className = dots[i].className.replace(' active', '');
			i += 1;
		}
		slides[slideIndex - 1].style.display = 'block';
		dots[slideIndex - 1].className += ' active';
		setTimeout(showSlides, 3000); // Change image every 3 seconds
	}

	showSlides();

	propertyProvider.getAllFeatured((err, featured) => {
		if (err) {
			$scope.page_load_error = err.message;
		} else {
			$scope.featured = featured;
		}
		$scope.finished_loading = true;
	});

	$scope.searchProperties = () => {
		const q = $scope.search;
		Object.keys(q).map(k => q[k] && $location.search(k, q[k]));
		$location.path('/properties');
	};
}

export default homeController;
