var myApp = angular.module('mainApp', ['angularSpinner']);

myApp.controller('mainController', ['$scope', 'usSpinnerService', function($scope, usSpinnerService) {

  // ~~~ display CSV titles in sidebar
  $scope.constituentCSVDisplaySidebar = window.constituentCSVDisplaySidebar;
  $scope.revenueCSVDisplaySidebar = window.revenueCSVDisplaySidebar;
  $scope.displayFilesInSidebar = function() {
    console.log("get to displayFilesInSidebar()?")
    console.log("inside displayFilesInSidebar(), var constituentCSVDisplaySidebar: ", constituentCSVDisplaySidebar);
    console.log("inside displayFilesInSidebar(), var revenueCSVDisplaySidebar: ", revenueCSVDisplaySidebar);
    $scope.constituentCSVDisplaySidebar = window.constituentCSVDisplaySidebar;
    $scope.revenueCSVDisplaySidebar = window.revenueCSVDisplaySidebar;
  };
  $scope.files = [];
  // add any number of files in template
  $scope.addFile = function(...toDisplay) {
    console.log("get to addFile()? this may be it.. '...toDisplay'");
    for (var file of toDisplay) {
      console.log("inside addFile(), var file: ", file);
      $scope.files.push(file)
    }
  };
  // ~~~

  // ~~~ spinner when generating report
  $scope.startSpin = function() {
    document.getElementById('main').style.pointerEvents = 'none';
    usSpinnerService.spin('spinner');
  };

  $scope.stopSpin = function() {
    document.getElementById('main').style.pointerEvents = 'auto';
    usSpinnerService.stop('spinner');
  };

}]);


// spinner settings
myApp.config(['usSpinnerConfigProvider', function(usSpinnerConfigProvider) {
  usSpinnerConfigProvider.setDefaults({
    color: '#970332',
    radius:16, 
    width: 4, 
    length: 8,
    opacity: 0.05,
    scale: 2.50,
    speed: 0.8,
    trail: 100
  });
}])