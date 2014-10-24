require('jquery');
require('bootstrap');
var angular = require('angular');
require('uirouter');
require('uibootstrap');
require('./app/services');
require('./app/directives');

var app = angular.module('myapp', ['ui.router', 'ui.bootstrap', 'myapp.services', 'myapp.directives']);

// Compile templates
app.run(['$templateCache',
  function ( $templateCache ) {
    var name,
        template,
        templates = require('templates'),
        _results = [];
    for (name in templates) {
      if (templates.hasOwnProperty(name)) {
        template = templates[name];
        _results.push($templateCache.put("" + name + ".html", template));
      }
    }
    return _results;
  }
]);

// Configure routing
app.config(['$stateProvider', '$urlRouterProvider',
  function ( $stateProvider, $urlRouterProvider ) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'home.html',
      controller: 'HomeCtrl'
    })
    .state ('home.devices', {
      url: 'devices',
      templateUrl: 'devices.html',
      controller: 'DevicesCtrl'
    })
    .state ('home.about', {
      url: 'about',
      templateUrl: 'about.html'
    });
  }
]);

app.controller("HomeCtrl", ['$rootScope', '$scope','$timeout', '$state',
  function ( $rootScope, $scope, $timeout, $state ) {
    $scope.showLogin = false;
    $scope.devices = [];
    $scope.token = null;

    $scope.toggleLogin = function() {
      $scope.showLogin = !$scope.showLogin;
    };

    $rootScope.$on('loginSuccess', function ( e, token ) {
      $timeout(function () {
        $scope.token = token;
        $scope.toggleLogin();
        $state.go('home.devices');
      }, 10);
    });
  }
]);

app.controller("DevicesCtrl", ['$scope', '$state',
  function ( $scope, $state ) {
    if ($scope.token !== null) {
      var getTemp = function ( device ) {
        if (device && device.connected) {
          device.getVariable('temp', function ( err, data ) {
            if (err) {
              console.log('An error occurred:', err);
            }
            else {
              $scope.$apply(function () {
                $scope.temp = Math.round(+data.result).toString();
              });
            }
          });
        }
      };

      $scope.temp = '-';
      $scope.devices = [];
      $scope.selectDevice = function ( device ) {
        getTemp(device);
      };

      window.spark.listDevices()
      .then(
        function ( devices ) {
          // add fake device
          devices.push({
            connected: false,
            name: "metal-beard"
          });
          devices.push({
            connected: true,
            name: "21EC2020-3AEA-4069-A2DD-08002B30309D"
          });
          //
          $scope.$apply(function () {
            $scope.devices = devices;
          });
        },
        function ( error ) {
          console.log('getDevices error', error);
          $scope.$apply(function () {
            $scope.devices = null;
          });
        }
      );
    }
    else {
      $state.go('home');
    }
  }
]);

app.controller('FormCtrl', ['$rootScope', '$scope',
  function ( $rootScope, $scope ) {
    $scope.isSubmitting = false;
    $scope.isInvalid = false;
    $scope.data = {
      email:    'gtb104@yahoo.com',
      password: ''
    };

    $scope.submit = function () {
      $scope.isSubmitting = true;
      $scope.isInvalid = false;
      window.spark.login({
        username: $scope.data.email,
        password: $scope.data.password}
      ).then(
        function ( token ) {
          $scope.$apply(function () {
            $scope.isSubmitting = false;
            $scope.isInvalid = false;
            $rootScope.$broadcast('loginSuccess', token);
          });
        },
        function () {
          $scope.$apply(function () {
            $scope.isSubmitting = false;
            $scope.isInvalid = true;
          });
        }
      );
    };
  }
]);
