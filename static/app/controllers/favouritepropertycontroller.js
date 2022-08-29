function favouritePropertyController($scope, propertyProvider) {
	$scope.new_property = {};
	$scope.add_property_error = '';

	$scope.page_load_error = null;
	$scope.finished_loading = false;

	$scope.getFavourites = (limit, page) => {
		propertyProvider.getAllFavourites((err, results) => {
			$scope.finished_loading = true;
			if (err) {
				$scope.page_load_error = err.message;
			} else {
				$scope.favourites = results.docs;
				$scope.limit = results.limit;
				$scope.total = results.total;
				$scope.page = results.page;
				$scope.pages = results.pages;
				$scope.all = [];
				for (let i = 0; i < $scope.pages;) {
					$scope.all.push(i);
					i += 1;
				}
				window.scroll({ top: 0, left: 0, behavior: 'smooth' });
			}
		}, { page, limit });
	};

	$scope.getFavourites();
}

export default favouritePropertyController;
