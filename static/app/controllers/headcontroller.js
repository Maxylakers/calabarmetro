function headController($scope) {
	$scope.firstName = localStorage.getItem('firstName');
}

export default headController;
