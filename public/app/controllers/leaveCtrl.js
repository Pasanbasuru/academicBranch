angular.module('leaveCtrl',['leaveService'])

.controller('LeaveCreateController', function(Leave, $location, $window){

	var vm = this;

	vm.leaveSubmit = function(){
		vm.message = '';
		console.log(vm.leaveData);
		Leave.create(vm.leaveData)
			.then(function(response){
				vm.leaveData = {};
				vm.message = response.data.message;
				$location.path('/profile'); //need to set for profile
			})
	}
})

.controller('AllLeavesController', function(leaves, socketio){

	var vm = this;

	vm.leaves = leaves.data;

	socketio.on('leave', function(data){
		vm.leaves.push(data);
	});
})
.controller('liveController', function($scope, $http){

    $scope.formData = {};
    $scope.addData = {};
    $scope.success = false;
    $scope.submit = true;
    $scope.rdates = '';
    $scope.tday = new Date();
    $scope.today = $scope.tday.toISOString();

    $scope.getTemplate = function(data){
    	
        if (data._id == $scope.formData._id)
        {
            return 'edit';
        }
        else
        {
            return 'display';
        }
    };

    $scope.fetchData = function(){
        $http.get('/api/all_leaves').success(function(data){
            $scope.namesData = data;
        });
    };

    $scope.restrictedDates = function(){
        $http.get('/api/getRestrictedDates').success(function(data){
            $scope.rdates = data;
        });
    };

    

    $scope.showEdit = function(data) {
    	//console.log(data);
        $scope.formData = angular.copy(data);
    };

    $scope.editData = function(){
        $http({
            method:"POST",
            url:"/api/editRequest",
            data:$scope.formData
        }).success(function(data){
            $scope.success = true;
            $scope.successMessage = data.message;
            $scope.fetchData();
            $scope.formData = {};
        });
    };

    $scope.checkDate = function(date){

        $http({
            method:"POST",
            url:"/api/checkDate",
            data:{'date':date}
        }).success(function(data){
            $scope.success = false;
            $scope.submit = true;
            $scope.successMessage = data.message;
            if(data.message=='Date is already added'){
            	$scope.successMessage = 'Date is restricted!';
            	$scope.success = true	;
            }
            console.log($scope.successMessage);
            console.log($scope.success);
        });
    };

    $scope.reset = function(){
        $scope.formData = {};
    };

    $scope.closeMsg = function(){
        $scope.success = false;
    };

    $scope.deleteData = function(id){
        if(confirm("Are you sure you want to remove it?"))
        {
            $http({
                method:"POST",
                url:"/api/deleteRequest",
                data:{'id':id}
            }).success(function(data){
                $scope.success = true;
                $scope.successMessage = data.message;
                $scope.fetchData();
            }); 
        }
    };

});