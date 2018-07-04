angular.module('adminService', [])

.factory('Admin', function($http){

	var adminFactory = {};

	adminFactory.pendingLeaves = function(){
		return $http.get('/api/pending_leaves');
	}


	 return adminFactory;
});