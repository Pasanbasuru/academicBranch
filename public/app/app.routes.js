angular.module('appRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider){

	$routeProvider

		.when('/',{
			templateUrl: 'app/views/pages/home.html'
		})

		.when('/homeold', {
 
			templateUrl: 'app/views/pages/home.html',
			controller: 'MainController',
			controllerAs:'main'
		})
		.when('/login',{
			templateUrl: 'app/views/pages/login.html'
		})
		.when('/signup',{
			templateUrl: 'app/views/pages/signup.html'
		})
		.when('/allStories',{
			templateUrl: 'app/views/pages/allStories.html',
			controller: 'AllStoriesController',
			controllerAs: 'story',
			resolve: {
				stories: function(Story){
					return Story.allStories();
				}

			}
		})
		.when('/admin',{
			templateUrl: 'app/views/pages/admin.html'
		})
		.when('/restrictDate',{
			templateUrl: 'app/views/pages/restrictDate.html'
		})
		.when('/auser',{
			templateUrl: 'app/views/pages/acceptedRequestUser.html'
		})
		.when('/ruser',{
			templateUrl: 'app/views/pages/rejectedRequestUser.html'
		})
		.when('/puser',{
			templateUrl: 'app/views/pages/pendingRequestUser.html'
		})
		.when('/allAccept',{
			templateUrl: 'app/views/pages/acceptedRequestAll.html'
		})
		.when('/allReject',{
			templateUrl: 'app/views/pages/rejectedRequestAll.html'
		})
		.when('/request',{
			templateUrl: 'app/views/pages/leave.html',
			controller: 'liveController'
		})
		.when('/profile',{

			templateUrl: 'app/views/pages/profile.html',
			controller: 'AllLeavesController',
			controllerAs: 'leave',
			resolve: {
				leaves: function(Leave){
					return Leave.allLeaves();
				}
			}
		})
		.when('/admin',{

			templateUrl: 'app/views/pages/admin.html',
			controller: 'PendingRequestController',
			controllerAs: 'admin',
			resolve: {
				leaves: function(Admin){
					return Admin.pendingLeaves();
				}
			}
		})
		
		.when('/history',{
			templateUrl: 'app/views/pages/employeeHistory.html'
		})
		.when('/sb',{
			templateUrl: 'app/views/pages/seabird.html'
		})
		.when('/iLoveYou',{
			templateUrl: 'app/views/pages/iLoveYou.html'
		})
		.when('/shopping',{
			templateUrl: 'app/views/pages/shopping.html'
		})
		.when('/error',{
			templateUrl: 'app/views/pages/error.html'
		})
		.otherwise({
	        redirectTo: '/error'
	      });

		


	$locationProvider.html5Mode(true); 
}) 
