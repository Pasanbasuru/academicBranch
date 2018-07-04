angular.module('leaveService', [])

.factory('Leave', function($http){

	var leaveFactory = {};

	leaveFactory.create = function(leaveData){
		return $http.post('/api/request',leaveData);
	}

	leaveFactory.allLeaves = function(){
		return $http.get('/api/all_leaves');
	}


	 return leaveFactory;
});