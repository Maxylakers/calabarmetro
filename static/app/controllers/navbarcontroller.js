/* eslint-disable consistent-return,no-param-reassign */
import $ from 'jquery';

function navbarController($rootScope, $scope, $location, userProvider) {
	$scope.isLoggedIn = userProvider.isLoggedIn();
	$scope.user = userProvider.user;
	$rootScope.$on(
		'$routeChangeSuccess',
		() => {
			$scope.activeMenu();
		},
	);
	$rootScope.$on(
		'user',
		(event, user) => {
			$scope.isLoggedIn = userProvider.isLoggedIn();
			$scope.user = user;
		},
	);

	$scope.menus = [
		{
			name: 'Home', url: '/', restricted: false, active: false, position: 1,
		},
		{
			name: 'Properties', url: '/properties', restricted: false, active: false, position: 1,
		},
		{
			name: 'Contact an Agent',
			url: '/contact-agent/new',
			restricted: false,
			active: false,
			position: 1,
		},
		{
			name: 'Admin',
			url: '/admin',
			restricted: true,
			active: false,
			position: 3,
			visibility: '0',
		},
		{
			name: 'Properties',
			url: '/properties',
			restricted: true,
			active: false,
			position: 3,
			visibility: '2',
		},
		{
			name: 'Sign up',
			icon: 'glyphicon-user',
			url: '/signup',
			restricted: false,
			active: false,
			position: 2,
		},
		{
			name: 'Login',
			url: '/login',
			icon: 'glyphicon-log-in',
			restricted: false,
			active: false,
			position: 2,
		},
		{
			name: 'Logout',
			url: '/logout',
			icon: 'glyphicon-log-out',
			restricted: true,
			position: 2,
		},
	];

	$scope.activeMenu = () => {
		const current = $location.path();
		// eslint-disable-next-line array-callback-return
		$scope.menus.some((menu) => {
			menu.active = false;
			if (menu.url.slice(2) === current) {
				menu.active = true;
			} else {
				return false;
			}
		});
	};

	$scope.selectMenu = (index) => {
		$('#propertyApp-navbar-collapse').collapse('hide');
		$scope.menus.some((menu) => {
			if (menu.active) {
				menu.active = false;
				return true;
			}
			return false;
		});
		$scope.menus[index].active = true;
	};
}

export default navbarController;
