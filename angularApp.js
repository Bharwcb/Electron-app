angular.module('fileListApp', []).controller('fileListController', function($scope) {
	$scope.files = ['seed file 1', 'seed file 2', 'seed file 3'];
	$scope.addFile = function(file) {
		console.log("ANGULAR CONTROLLER CHANGED");
		$scope.files.push(file);
	}
});
