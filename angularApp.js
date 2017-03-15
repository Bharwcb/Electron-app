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