var angular = require('angular'),
    _module = angular.module('myapp.directives', []);

_module.directive('login', [
  function() {
    return {
      restrict: 'E',
      templateUrl: 'login.html'
    };
  }
]);

_module.directive('fa', [
  function() {
    return {
      restrict: 'E',
      transclude: true,
      scope: true,
      template: '<i class="fa" ng-class="clazz"></i>',
      link: function( scope, element, attrs ) {
        var _ref;
        scope.clazz = (_ref = attrs.ico) !== null ? _ref : 'fa-question';
      }
    };
  }
]);