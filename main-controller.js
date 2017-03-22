var test = angular.module('mainApp', []);

test.controller('mainController', filelistController);

function filelistController($scope) {
  $scope.constituentCSVDisplaySidebar = window.constituentCSVDisplaySidebar;
  $scope.revenueCSVDisplaySidebar = window.revenueCSVDisplaySidebar;
  $scope.displayFilesInSidebar = function() {
    $scope.constituentCSVDisplaySidebar = window.constituentCSVDisplaySidebar;
    $scope.revenueCSVDisplaySidebar = window.revenueCSVDisplaySidebar;
  };
	$scope.files = [];
  // add any number of files in template
	$scope.addFile = function(...toDisplay) {
    for (var file of toDisplay) {
      $scope.files.push(file)
    }
	};
}