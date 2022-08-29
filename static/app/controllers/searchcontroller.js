function searchController($scope) {
	$scope.searchEngine = (
		searchByType,
		searchByLocation,
		searchByPrice
	) => !!(searchByType || searchByLocation || searchByPrice);

	$scope.sortOrder = (order) => {
		$scope.sort = order;
	};
}

export default searchController;
