angular.module('fileListApp', [])
.controller('fileListController', function($scope) {
	$scope.files = ['seed file 1', 'seed file 2'];
	$scope.addFile = function(file) {
		console.log("type of file: ", typeof file);
		console.log("about to add in controller: ", file);
		$scope.files.push(file)
	};
  $scope.foo = window.foo;
})




/*
angular.module('fileListApp', [])
.service('fileService', function() {
  this.files = ['seed file 1', 'seed file 2'];
  this.addFile = function(file){
    this.files.push(file);
  }
})
.controller('fileListController', function($scope, fileService) {
  $scope.files = fileService.files;
  $scope.addFile = function(file) {
  	console.log("about to add in controller: ", file);
    fileService.addFile(file);
  };
    // ipcRenderer.on('newReportNames', function(reportName) {
    // 	console.log('new message', reportName);
    // 	$scope.$apply(function() {
				// // takes title that i emitted
				// $scope.addFile(reportName);
    // 	});
    // });
});
*/