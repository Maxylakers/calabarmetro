import { formatNaira } from '../utils';

function propertyAppController($scope, $window, $location, userProvider) {
	$scope.user = userProvider.user;
	$scope.loading = true;
	$scope.propertyTypes = [
		'Shop',
		'Land',
		'Office Space',
		'Single Room',
		'1 Room Self-contain',
		'1 Bedroom Flat',
		'2 Bedroom Flat',
		'3 Bedroom Flat',
		'4 Bedroom Flat',
		'Apartment',
		'Duplex'
	];
	$scope.propertyLocations = {
		Calabar: [
			'Atimbo',
			'Marian',
			'Etta Agbor',
			'Goldie',
			'State Housing',
			'Federal Housing',
			'Ekorinim',
			'Satelite Town',
			'8 Miles',
			'Parliamentary',
			'Anantigha',
			'Main Avenue',
			'Lemna',
			'Aka Ifa',
			'Diamond'
		],
		Portharcourt: [
			'Trans Amadi',
			'Bori',
			'Mile 1',
			'Mile 2',
			'Mile 3',
			'Mile 4',
			'Eagle island',
			'Ikwerre',
			'Magbuoba',
			'New GRA',
			'Old GRA',
			'Rumukwueshi',
			'Rumuokwuta',
			'Rumuola',
			'Peter Odili',
			'Ada-George',
			'Agip',
			'Rumuokoro',
			'Igwuruta',
			'Elelewon',
			'Woji',
			'Onne',
			'Elekohia',
			'Choba',
			'NTA',
			'Rumuoparali',
			'Location',
			'Olu Obasanjo'
		]
	};
	$scope.priceRanges = [
		{ value: '0-29999', text: 'Less than ₦30,000' },
		{ value: '30000-50000', text: '₦30,000 to ₦50,000' },
		{ value: '50000-100000', text: '₦50,000 to ₦100,000' },
		{ value: '100000-200000', text: '₦100,000 to ₦200,000' },
		{ value: '200000-500000', text: '₦200,000 to ₦500,000' },
		{ value: '500000-1000000', text: '₦500,000 to ₦1 Million' },
		{ value: '1000000-5000000', text: '₦1 Million to ₦5 Million' },
		{ value: '5000000-10000000', text: '₦5 Million to ₦10 Million' },
		{ value: '10000000-20000000', text: '₦10 Million to ₦20 Million' },
		{ value: '20000000-50000000', text: '₦20 Million to ₦50 Million' },
		{ value: '50000000-100000000', text: '₦50 Million to ₦100 Million' },
		{ value: '100000001-1000000000000000000', text: 'Above ₦100 Million' }
	];

	$scope.goBack = (e) => {
		e.preventDefault();
		$window.history.back();
	};

	$scope.goToDashboard = (e) => {
		e.preventDefault();
		$location.path(localStorage.getItem('dashboard_url'));
	};

	userProvider.getUserStatus()
		.then(() => {
			$scope.isLoggedIn = userProvider.isLoggedIn();
			$scope.user = userProvider.user;
		}).finally(() => {
			$scope.loading = false;
		});

	$scope.formatNaira = value => formatNaira(value);
}
export default propertyAppController;
