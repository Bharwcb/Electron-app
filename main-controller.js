var myApp = angular.module('mainApp', ['angularSpinner']);

myApp.controller('mainController', ['$scope', 'usSpinnerService', function($scope, usSpinnerService) {

  // ~~~ display CSV titles in sidebar
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
  // ~~~

  // ~~~ spinner when generating report
  $scope.startSpin = function() {
    usSpinnerService.spin('spinner');
  }

}]);


// spinner settings
myApp.config(['usSpinnerConfigProvider', function(usSpinnerConfigProvider) {
  usSpinnerConfigProvider.setDefaults({
    color: '#970332',
    radius:16, 
    width:4, 
    length: 12,
    opacity: 0.05
  });
}])