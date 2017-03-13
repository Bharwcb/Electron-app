angular.module('fileListApp', []).controller('fileListController', function($scope) {
	$scope.files = ['seed file 1', 'seed file 2', 'seed file 3'];
	$scope.addFile = function(file) {
		console.log("GET HERE?");
		$scope.files.push(file);
	}
});
