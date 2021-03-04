angular.module('mainCtrl', [])



.controller('MainController', function($rootScope, $location, Auth){

	var vm = this;
	$rootScope.success = false;
	$rootScope.successMessage = '';
	vm.loggedIn = Auth.isLoggedIn();

	$rootScope.$on('$routeChangeStart', function(){

		vm.loggedIn = true;

		Auth.getUser()
			.then(function(data){
				vm.user = data.data;
			});
	});

	$rootScope.export = function(){
        html2canvas(document.getElementById('exportthis'), {
            onrendered: function (canvas) {
                var data = canvas.toDataURL();
                var docDefinition = {
                    content: [{
                        image: data,
                        width: 500,
                    }]
                };
                pdfMake.createPdf(docDefinition).download("test.pdf");
            }
        });
    };

	$rootScope.closeMsg = function(){
        $rootScope.success = false;
    };

	vm.doLogin = function(){

		 vm.processing = true;

		 vm.error = '';
		 vm.successMessage='';

		 Auth.login(vm.loginData.username, vm.loginData.password)
		 	.success(function(data){
		 		vm.processing = false;

		 		Auth.getUser()
		 			.then(function(data){
		 				vm.user = data.data;
		 			});
		 		
		 		if(data.success){
		 			if(data.user.type=="admin"){
			 			$location.path('/');	
		 			}else if(data.user.type=="employee"){
		 				$location.path('/');
		 			}	
		 			
		 		}
		 		else{
					$location.path('/');	
		 			$rootScope.successMessage = "Incorrect Credentials";
		 			$rootScope.success = true;
		 			vm.error = data.message;
		 		}
		 		
		 	});

	}

	vm.doLogout = function(){

		Auth.logout();
		$location.path('/login');
	}
});
