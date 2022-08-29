function logoutController($scope, $location, userProvider) {
	$scope.logout = () => {
		// call logout from service
		userProvider.logout((err, data) => {
			localStorage.removeItem('dashboard_url');
			localStorage.removeItem('firstName');
			console.log(data);
			$location.path('/login');
		});
	};

	$scope.logout();
}
export default logoutController;
