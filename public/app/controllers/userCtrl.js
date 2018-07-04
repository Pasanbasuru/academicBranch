angular.module('userCtrl',['userService'])

.controller('userController', function(User){

	var vm = this;

	User.all()
		.success(function(data){
			vm.users = data;
		})

})

.controller('UserCreateController', function(User, $location, $window){

	var vm = this;



	vm.signupUser = function(){
		vm.message = '';
		console.log(vm.userData);
		User.create(vm.userData)
			.then(function(response){
				vm.userData = {};
				vm.message = response.data.message;

				$window.localStorage.setItem('token', response.data.token);
				$location.path('/');
			})
	}


})

.controller('RegisterController', function($scope, $http){

    $scope.success = false;
    $scope.danger = false;
    $scope.userData = {};
    $scope.successMessage ='';
    
    
   
    $scope.register = function(date){
       
        $http({
            method:"POST",
            url:"/api/signup",
            data:$scope.userData,
        }).success(function(data){
            $scope.signupForm.$setPristine();
            $scope.successMessage = data.message;
            console.log($scope.successMessage);
            $scope.success = false;
            $scope.danger = false;
            $scope.userData = {};
            if(data.message=='User has been created!'){
                $scope.successMessage = 'Successfully Created A User';
                $scope.success = true ;
            }else{
                $scope.successMessage = "Cannot Create a User !!!";
                $scope.danger = true;
            }
            // console.log($scope.successMessage);
            // console.log($scope.success);
        });
        
    };

    


})

.controller('HistoryController', function($scope, $http){

    $scope.success = false;
    $scope.rdates = '';
    $scope.tday = new Date();
    $scope.today = $scope.tday.toISOString();

    $scope.getTemplate = function(data){
    	
       return 'display';

    };

    $scope.fetchData = function(){
        $http.get('/api/all_emp_leaves').success(function(data){
            $scope.namesData = data;
        });
    };
    $scope.getEmployee = function(empID){

        $http({
            method:"POST",
            url:"/api/emp_leaves",
            data:{'empID':empID}
        }).success(function(data){
           
           $scope.namesData = data;
            console.log(data);
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

    
    $scope.closeMsg = function(){
        $scope.success = false;
    };

    

})

.controller('HomeEmployeeController',function($scope, $http){

    $scope.formData = {};
    $scope.addData = {};
    $scope.success = false;
    $scope.pendingLeaves ='';
    $scope.acceptedLeaves ='';
    $scope.rejectedLeaves ='';
    $scope.total = '';
    $scope.remaining = '';
    $scope.userTotal = '';
    $scope.userRemain = '';

    $scope.pendingData = function(){
        $http.get('/api/getPendingRequestsEmployee').success(function(data){
            $scope.pendingLeaves = data;
        });
    };

    $scope.acceptedData = function(){
        $http.get('/api/getacceptedRequestsEmployee').success(function(data){
            $scope.acceptedLeaves = data;
        });
    };

    $scope.rejectedData = function(){
        $http.get('/api/getRejectedRequestsEmployee').success(function(data){
            $scope.rejectedLeaves = data;
        });
    };
    $scope.totalLeaves = function(){
        $http.get('/api/getTotalLeaves').success(function(data){
            $scope.total = data.tleaves;
            $scope.remaining = data.rleaves;

        });
    }; 

    $scope.userTLeaves = function(empID){

        $http({
            method:"POST",
            url:"/api/user_t_leaves",
            data:{'empID':empID}
        }).success(function(data){
           
           $scope.userTotal = data;
            
        });
    };
    $scope.userRLeaves = function(empID){

        $http({
            method:"POST",
            url:"/api/user_r_leaves",
            data:{'empID':empID}
        }).success(function(data){
           
           $scope.userRemain = data;
            
        });
    };

})
.controller('EmployeeRequestController',function($scope, $http){

	$scope.getTemplate = function(data){
    	
        return 'display';
    };


    $scope.pendingData = function(){
        $http.get('/api/getPendingRequestsUser').success(function(data){
            $scope.namesData = data;
        });
    };

    $scope.acceptedData = function(){
        $http.get('/api/getAcceptedRequestsUser').success(function(data){
            $scope.namesData = data;
        });
    };

    $scope.rejectedData = function(){
        $http.get('/api/getRejectedRequestsUser').success(function(data){
            $scope.namesData = data;
        });
    };

})
.controller('signup', function ($scope, $http) {
	 
	 // Check username
	 
	 $scope.checkUsername = function(username){
	 
	  $http({
	   method: 'POST',
	   url: "/api/checkUsername",
	   data: {'username': username}
	  }).then(function successCallback(response) {
	   $scope.unamestatus = response.data.message;
	  });
	 }

	 // Set class
	 $scope.addClass = function(unamestatus){
	  if(unamestatus == 'Available'){
	   return 'response exists';
	  }else if(unamestatus == 'Not Available'){
	   return 'response not-exists';
	  }else{
	   return 'hide';
	  }
	 }

});
