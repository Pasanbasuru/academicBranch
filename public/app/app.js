angular.module('myapp', ['appRoutes','ngMessages','mainCtrl','authService','userCtrl','userService','storyService','storyCtrl','reverseDirective','leaveCtrl','leaveService','adminCtrl','adminService'])

.config(function($httpProvider){
	$httpProvider.interceptors.push('AuthInterceptor');
});