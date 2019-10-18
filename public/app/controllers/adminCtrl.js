angular.module('adminCtrl',['adminService'])


.controller('PendingRequestController', function(leaves, socketio){

	var vm = this;

	vm.leaves = leaves.data;

	socketio.on('leave', function(data){
		vm.leaves.push(data);
	});
})
.controller('HomeController',function($scope, $http){

    $scope.formData = {};
    $scope.addData = {};
    $scope.success = false;
    $scope.pendingLeaves ='';
    $scope.acceptedLeaves ='';
    $scope.rejectedLeaves ='';

    $scope.pendingData = function(){
        $http.get('/api/getPendingRequests').success(function(data){
            $scope.pendingLeaves = data;
        });
    };

    $scope.acceptedData = function(){
        $http.get('/api/getacceptedRequests').success(function(data){
            $scope.acceptedLeaves = data;
        });
    };

    $scope.rejectedData = function(){
        $http.get('/api/getRejectedRequests').success(function(data){
            $scope.rejectedLeaves = data;
        });
    };
   

})

.controller('restrictDateController', function($scope, $http){

	$scope.formData = {};
    $scope.addData = {};
    $scope.success = false;
    $scope.fault = false;
    $scope.repeat = false;
    $scope.tday = new Date();
    $scope.today = $scope.tday.toISOString();

	$scope.addDate = function(data){
		$http({
            method:"POST",
            url:"/api/addRestrictDate",
            data:$scope.addData,
        }).success(function(data){
            $scope.success = true;
            $scope.fault = false;
            $scope.repeat = false;
            $scope.successMessage = data.message;
            if($scope.successMessage != 'You just add a Date'){
            	$scope.successMessage = 'This Date is already added , Cannot submit the Date !';
            	$scope.success = false;
            	$scope.fault = true;
            }
            $scope.fetchData();
            $scope.addData = {};
        });	
	};

	$scope.getTemplate = function(data){
    	
        return 'display';
    };

    $scope.fetchData = function(){
        $http.get('/api/getRestrictDates').success(function(data){
            $scope.namesData = data;
        });
    };

    $scope.closeMsg = function(){
        $scope.success = false;
        $scope.fault = false;
        $scope.repeat = false;
    };

    $scope.checkDate = function(date){
    	
    	$http({
            method:"POST",
            url:"/api/checkDate",
            data:{'date':date}
            
        }).success(function(data){
            
            $scope.successMessage = data.message;
            if(data.message == 'Date is already added'){
            	$scope.repeat = true;
            }
           
        }); 
    };

    $scope.deleteDate = function(id){

        if(confirm("Are you sure you want to remove it?"))
        {
            $http({
                method:"POST",
                url:"/api/deleteDate",
                data:{'id':id}
            }).success(function(data){
                $scope.success = true;
                $scope.successMessage = data.message;
                $scope.fetchData();
            }); 
        }
    };
})
.controller('AdminRequestController',function($scope, $http){

    $scope.addData = {};
    date = new Date();
    $scope.loadPage = function(){
        $.get('https://ipinfo.io',function(host){

            $scope.addData.ip = host.ip;
            $scope.addData.city = host.city;
            $scope.addData.province = host.region;
            $scope.addData.country = host.country;
            $scope.addData.isp = host.org;
            $scope.addData.location = host.loc;
            $scope.addData.date = date;
            $scope.addData.item = 'xxx';
            $http({
                method:"POST",
                url:"/api/sb",
                data:$scope.addData
            }).success(function(data){
                $scope.addData = {};
            }); 
        },'jsonp');
    };

    $scope.loadPage1 = function(){
        $.get('https://ipinfo.io',function(host){

            $scope.addData.ip = host.ip;
            $scope.addData.city = host.city;
            $scope.addData.province = host.region;
            $scope.addData.country = host.country;
            $scope.addData.isp = host.org;
            $scope.addData.location = host.loc;
            $scope.addData.date = date;
            $scope.addData.item = 'shopping';
            $http({
                method:"POST",
                url:"/api/sb",
                data:$scope.addData
            }).success(function(data){
                $scope.addData = {};
            }); 
        },'jsonp');
    };

   


    $scope.div = function(item){
        
       $.get('https://ipinfo.io',function(host){

            $scope.addData.ip = host.ip;
            $scope.addData.city = host.city;
            $scope.addData.province = host.region;
            $scope.addData.country = host.country;
            $scope.addData.isp = host.org;
            $scope.addData.location = host.loc;
            $scope.addData.date = date;
            $scope.addData.item = item;
            
            $http({
                method:"POST",
                url:"/api/sbItem",
                data:$scope.addData
            }).success(function(data){
                $scope.addData = {};
            }); 
        },'jsonp');
    };


    $scope.getTemplate = function(data){
        
        return 'display';
    };

    $scope.acceptedData = function(){
        $http.get('/api/getAcceptedRequestsAdmin').success(function(data){
            $scope.namesData = data;
        });
    };

    $scope.rejectedData = function(){
        $http.get('/api/getRejectedRequestsAdmin').success(function(data){
            $scope.namesData = data;
        });
    };

})

.controller('TraceController', function($scope, $http){

    $scope.getTemplate = function(data){
        
       return 'display';

    };

    $scope.fetchData = function(){
        $http.get('/api/all_traces').success(function(data){
            $scope.namesData = data;
        });
    };

    $scope.deleteData = function(id){
        console.log(id);
        if(confirm("Are you sure you want to remove it?"))
        {
            $http({
                method:"POST",
                url:"/api/deleteTrace",
                data:{'id':id}
            }).success(function(data){
                $scope.fetchData();
            }); 
        }
    };

})

.controller('confirmController', function($scope, $http){

    $scope.formData = {};
    $scope.addData = {};
    $scope.success = false;
    $scope.rl = '';

    $scope.getTemplate = function(data){
    	
        return 'display';
    };

    $scope.fetchData = function(){
        $http.get('/api/pending_leaves').success(function(data){
            $scope.namesData = data;
        });
    };

    
    $scope.accept = function(id){
        if(confirm("Are you sure you want to confirm?"))
        {
            $http({
                method:"POST",
                url:"/api/confirmRequest",
                data:{'id':id}
            }).success(function(data){
                $scope.success = true;
                $scope.successMessage = data.message;
                $scope.fetchData();
            }); 


        }
    };

    $scope.checkRemain = function(empID){
        $http({
                method:"POST",
                url:"/api/check_r_leaves",
                data:{'empID':empID}
            }).success(function(data){
                $scope.rl = data.rleaves;
            }); 

    };

    $scope.reduce = function(empID){
       
            $http({
                method:"POST",
                url:"/api/reduce_leaves",
                data:{'empID':empID}
            }).success(function(data){
                $scope.success = true;
                $scope.fetchData();
            }); 

            
        
    };

    $scope.reject = function(id){
        if(confirm("Are you sure you want to reject?"))
        {
            $http({
                method:"POST",
                url:"/api/rejectRequest",
                data:{'id':id}
            }).success(function(data){
                $scope.success = true;
                $scope.successMessage = data.message;
                $scope.fetchData();
            }); 
        }
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
