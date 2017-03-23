var myApp = angular.module('mainApp', ['angularSpinner']);

myApp.controller('mainController', mainController);

myApp.config(['usSpinnerConfigProvider', function(usSpinnerConfigProvider) {
  usSpinnerConfigProvider.setDefaults({
    color: '#970332',
    radius:16, 
    width:4, 
    length: 12
  });
}])

function mainController($scope) {
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

