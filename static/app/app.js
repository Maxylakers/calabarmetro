import angular from 'angular';
import ngRoute from 'angular-route';
import ngAnimate from 'angular-animate';
import ngAria from 'angular-aria';
import ngMessages from 'angular-messages';
import ngCookies from 'angular-cookies';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/bs.css';
import '../css/style.css';

// Services
import propertyPro from './services/propertyprovider';
import userPro from './services/userprovider';
import feedbackPro from './services/feedbackprovider';
import contactAgentPro from './services/contactagentprovider';

// Controllers
import propertyAppCtrl from './controllers/propertyappcontroller';
import navbarCtrl from './controllers/navbarcontroller';
import homeCtrl from './controllers/homecontroller';
import aboutCtrl from './controllers/aboutcontroller';
import ourPeopleCtrl from './controllers/ourpeoplecontroller';
import eventsCtrl from './controllers/eventscontroller';
import termsCtrl from './controllers/termscontroller';
import privacyPolicyCtrl from './controllers/privacypolicy';
import allFeedbackCtrl from './controllers/allfeedbackcontroller';
import addFeedbackCtrl from './controllers/addfeedbackcontroller';
import viewFeedbackCtrl from './controllers/viewfeedbackcontroller';
import loginCtrl from './controllers/logincontroller';
import logoutCtrl from './controllers/logoutcontroller';
import signupCtrl from './controllers/signup';
import renterCtrl from './controllers/renter';
import handlerCtrl from './controllers/handler';
import propertyListCtrl from './controllers/propertylistcontroller';
import userPropertiesCtrl from './controllers/user/propertiescontroller';
import addPropertyCtrl from './controllers/addpropertycontroller';
import viewPropertyCtrl from './controllers/viewpropertycontroller';
import headCtrl from './controllers/headcontroller';
import contactAgentCtrl from './controllers/contactagent';
import allContactAgentsCtrl from './controllers/allcontactagents';
import viewContactAgentRequest from './controllers/viewcontactagentrequest';
import allUsersCtrl from './controllers/alluserscontroller';
import favouritePropertyCtrl from './controllers/favouritepropertycontroller';
import searchCtrl from './controllers/searchcontroller';
import activePropertyCtrl from './controllers/activepropertycontroller';
import notFoundCtrl from './controllers/notFoundController';

window.$ = $;
window.jQuery = $;
require('popper.js');
require('bootstrap');

// Tooltip code
$('[data-toggle="tooltip"]').tooltip();

const API_URL = process.env.NODE_ENV === 'production' ? process.env.API_URL : process.env.STAGING_API_URL;
// create the module/app, make sure ng-app points to it.
const propertyApp = angular.module('propertyApp', [
	ngRoute, ngAnimate, ngAria, ngMessages, ngCookies
]);

propertyApp
	.run(($rootScope, $location, $route, $http, userProvider) => {
		let loggedIn = userProvider.isLoggedIn();
		$rootScope.$on(
			'$routeChangeStart',
			(event, next) => {
				window.scroll({ top: 0, left: 0, behavior: 'smooth' });
				$('#propertyApp-navbar-collapse').collapse('hide');
				if (next.controller !== 'logoutController') {
					userProvider.getUserStatus('app')
						.then((status) => {
							loggedIn = status;
							$rootScope.$emit('user', userProvider.user);
							if (next.access && next.access.restricted && !loggedIn) {
								$location.path('/login');
							}
						}).catch(() => { });
				}
			},
		);
		$rootScope.$on('get-user', () => {
			$rootScope.$emit('user', userProvider.user);
		});
	});

propertyApp
	.config(($routeProvider, $locationProvider, $httpProvider) => {
		$routeProvider
			.when('/', {
				controller: 'homeController',
				templateUrl: '/static/app/partials/home.html',
				access: { restricted: false },
			})
			.when('/about', {
				controller: 'aboutController',
				templateUrl: '/static/app/partials/about.html',
				access: { restricted: false },
			})
			.when('/our-people', {
				controller: 'ourPeopleController',
				templateUrl: '/static/app/partials/our-people.html',
				access: { restricted: false },
			})
			.when('/events', {
				controller: 'eventsController',
				templateUrl: '/static/app/partials/events.html',
				access: { restricted: false },
			})
			.when('/terms', {
				controller: 'termsController',
				templateUrl: '/static/app/partials/terms.html',
				access: { restricted: false },
			})
			.when('/privacy-policy', {
				controller: 'privacyPolicyController',
				templateUrl: '/static/app/partials/privacy-policy.html',
				access: { restricted: false },
			})
			.when('/contact-us', {
				controller: 'addFeedbackController',
				templateUrl: '/static/app/partials/add-feedback.html',
				access: { restricted: false },
			})
			.when('/my-account/head/feedbacks', {
				controller: 'allFeedbackController',
				templateUrl: '/static/app/partials/users/all-feedback.html',
				access: { restricted: true },
			})
			.when('/my-account/head/feedbacks/:_id', {
				controller: 'viewFeedbackController',
				templateUrl: '/static/app/partials/view-feedback.html',
				access: { restricted: true },
			})
			.when('/login', {
				controller: 'loginController',
				templateUrl: '/static/app/partials/users/log-in.html',
				access: { restricted: false },
			})
			.when('/reset-password', {
				controller: 'loginController',
				templateUrl: '/static/app/partials/users/reset-password.html',
				access: { restricted: false },
			})
			.when('/change-password/:token/:_id', {
				controller: 'loginController',
				templateUrl: '/static/app/partials/users/change-password.html',
				access: { restricted: false },
			})
			.when('/logout', {
				controller: 'logoutController',
				template: '',
				access: { restricted: false },
			})
			.when('/signup', {
				controller: 'signupController',
				templateUrl: '/static/app/partials/users/sign-up.html',
				access: { restricted: false },
			})
			.when('/verify-email/:_id', {
				controller: 'signupController',
				templateUrl: '/static/app/partials/users/verify-email.html',
				access: { restricted: false },
			})
			.when('/my-account/', {
				controller: 'renterController',
				templateUrl: '/static/app/partials/renters-page.html',
				access: { restricted: true },
			})
			.when('/my-account/', {
				controller: 'handlerController',
				templateUrl: '/static/app/partials/handlers-page.html',
				access: { restricted: true },
			})
			.when('/properties', {
				controller: 'propertyListController',
				templateUrl: '/static/app/partials/property-list.html',
				access: { restricted: false },
			})
			.when('/my-account/properties', {
				controller: 'userPropertiesController',
				templateUrl: '/static/app/partials/users/properties.html',
				access: { restricted: true },
			})
			.when('/properties/new', {
				controller: 'addPropertyController',
				templateUrl: '/static/app/partials/add-property.html',
				access: { restricted: true },
			})
			.when('/properties/:_id', {
				controller: 'viewPropertyController',
				templateUrl: '/static/app/partials/view-property.html',
				access: { restricted: false },
			})
			.when('/contact-agent/new', {
				controller: 'contactAgentController',
				templateUrl: '/static/app/partials/contact-agent.html',
				access: { restricted: false },
			})
			.when('/my-account/head/contact-requests', {
				controller: 'allContactAgentsController',
				templateUrl: '/static/app/partials/users/all-contact-agent.html',
				access: { restricted: true },
			})
			.when('/my-account/head/contact-requests/:_id', {
				controller: 'viewContactAgentRequest',
				templateUrl: '/static/app/partials/view-contact-request.html',
				access: { restricted: true },
			})
			.when('/my-account/head/users', {
				controller: 'allUsersController',
				templateUrl: '/static/app/partials/users/all-users.html',
				access: { restricted: true },
			})
			.when('/my-account/head', {
				controller: 'headController',
				templateUrl: '/static/app/partials/users/head.html',
				access: { restricted: true },
			})
			.when('/my-account/favourites', {
				controller: 'favouritePropertyController',
				templateUrl: '/static/app/partials/favourite.html',
				access: { restricted: true },
			})
			.when('/search', {
				controller: 'searchController',
				templateUrl: '/static/app/partials/search.html',
				access: { restricted: false },
			})
			.when('/active', {
				controller: 'activePropertyController',
				templateUrl: '/static/app/partials/active.html',
				access: { restricted: false },
			})
			.when('/not-found', {
				controller: 'notFoundController',
				templateUrl: '/static/app/partials/404.html',
				access: { restricted: false },
			})
			.when('/home', { redirectTo: '/', access: { restricted: false } })
			.otherwise({
				controller: 'notFoundController',
				templateUrl: '/static/app/partials/404.html',
				access: { restricted: false }
			});

		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false,
		});
		// eslint-disable-next-line no-param-reassign
		$httpProvider.defaults.withCredentials = true;
		$httpProvider.interceptors.push(() => ({
			request: (config) => {
				if (config.url.indexOf('/api/') === 0) {
					config.url = API_URL + config.url; // eslint-disable-line
				}
				return config;
			}
		}));
	});

propertyApp
	.service('propertyProvider', [
		'$http', propertyPro,
	])
	.service('userProvider', [
		'$http', userPro,
	])
	.service('feedbackProvider', [
		'$http', feedbackPro,
	])
	.service('contactAgentProvider', [
		'$http', contactAgentPro,
	]);

propertyApp
	.controller('propertyAppController', [
		'$scope', '$window', '$location', 'userProvider', propertyAppCtrl,
	])
	.controller('navbarController', [
		'$rootScope', '$scope', '$location', 'userProvider', navbarCtrl,
	])
	.controller('homeController', [
		'$scope', '$location', 'propertyProvider', homeCtrl,
	])
	.controller('aboutController', [
		aboutCtrl,
	])
	.controller('ourPeopleController', [
		ourPeopleCtrl,
	])
	.controller('eventsController', [
		eventsCtrl,
	])
	.controller('termsController', [
		termsCtrl,
	])
	.controller('privacyPolicyController', [
		privacyPolicyCtrl,
	])
	.controller('allFeedbackController', [
		'$scope', 'feedbackProvider', allFeedbackCtrl,
	])
	.controller('addFeedbackController', [
		'$scope', '$location', 'feedbackProvider', addFeedbackCtrl,
	])
	.controller('viewFeedbackController', [
		'$window', '$scope', '$http', '$location', '$routeParams',
		'userProvider', 'feedbackProvider', viewFeedbackCtrl,
	])
	.controller('loginController', [
		'$scope', '$location', '$routeParams', '$timeout', 'userProvider', loginCtrl,
	])
	.controller('logoutController', [
		'$scope', '$location', 'userProvider', logoutCtrl,
	])
	.controller('signupController', [
		'$scope', '$routeParams', 'userProvider', signupCtrl,
	])
	.controller('renterController', [
		'$scope', 'propertyProvider', renterCtrl,
	])
	.controller('handlerController', [
		'$scope', 'propertyProvider', handlerCtrl,
	])
	.controller('propertyListController', [
		'$scope', '$location', 'propertyProvider', 'userProvider', propertyListCtrl,
	])
	.controller('userPropertiesController', [
		'$scope', 'propertyProvider', 'userProvider', userPropertiesCtrl,
	])
	.controller('addPropertyController', [
		'$scope', '$location', 'propertyProvider', addPropertyCtrl,
	])
	.controller('viewPropertyController', [
		'$window', '$scope', '$http', '$location', '$routeParams',
		'userProvider', 'propertyProvider', viewPropertyCtrl,
	])
	.controller('headController', [
		'$scope', headCtrl,
	])
	.controller('contactAgentController', [
		'$scope', '$location', 'contactAgentProvider', contactAgentCtrl,
	])
	.controller('allContactAgentsController', [
		'$scope', 'contactAgentProvider', allContactAgentsCtrl,
	])
	.controller('viewContactAgentRequest', [
		'$window', '$scope', '$http', '$location', '$routeParams',
		'userProvider', 'contactAgentProvider', viewContactAgentRequest,
	])
	.controller('allUsersController', [
		'$window', '$scope', 'userProvider', allUsersCtrl,
	])
	.controller('favouritePropertyController', [
		'$scope', 'propertyProvider', favouritePropertyCtrl,
	])
	.controller('searchController', [
		'$scope', searchCtrl,
	])
	.controller('activePropertyController', [
		'$scope', 'propertyProvider', activePropertyCtrl,
	])
	.controller('notFoundController', [
		'$scope', '$location', notFoundCtrl,
	]);
