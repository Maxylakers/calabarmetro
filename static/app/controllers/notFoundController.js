import '../../css/slide.css';

function notFoundController($scope, $location) {
	$scope.finished_loading = false;
	$scope.search = {
		type: '', city: '', location: '', price: ''
	};

	$scope.searchProperties = () => {
		const q = $scope.search;
		Object.keys(q).map(k => q[k] && $location.search(k, q[k]));
		$location.path('/properties');
	};
}

export default notFoundController;
