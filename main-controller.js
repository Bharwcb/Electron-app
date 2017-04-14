var myApp = angular.module('mainApp', ['angularSpinner']);

myApp.controller('mainController', ['$scope', 'usSpinnerService', function($scope, usSpinnerService) {

  // ~~~ display CSV titles in sidebar
  $scope.displayFilesInSidebar = function() {

    console.log("DIRNAME: ", __dirname);
    const generate_csv = require('./generate_csv.js');
    revenueCSVDisplaySidebar = generate_csv.revenueCSVDisplaySidebar();
    constituentCSVDisplaySidebar = generate_csv.constituentCSVDisplaySidebar();
    console.log("var constituentCSVDisplaySidebar = ", constituentCSVDisplaySidebar);
    console.log("var revenueCSVDisplaySidebar = ", revenueCSVDisplaySidebar);

    $scope.constituentCSVDisplaySidebar = constituentCSVDisplaySidebar;
    $scope.revenueCSVDisplaySidebar = revenueCSVDisplaySidebar;
  };
  $scope.files = [];

  // add any number of files to display in downloads 
  $scope.addFile = function(...toDisplay) {
    for (var file of toDisplay) {
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