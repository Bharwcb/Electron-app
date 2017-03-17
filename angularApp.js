angular.module('fileListApp', [])
.controller('fileListController', function($scope) {
  $scope.constituentCSVDisplaySidebar = window.constituentCSVDisplaySidebar;
  $scope.findConstituentCSVDisplaySidebar = function() {
    $scope.constituentCSVDisplaySidebar = window.constituentCSVDisplaySidebar;
  };
	$scope.files = [];
	$scope.addFile = function(file) {
		console.log("type of file: ", typeof file);
		console.log("about to add in controller: ", file);
		$scope.files.push(file)
	};

})