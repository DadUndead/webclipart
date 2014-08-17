'use strict';

angular.module('clipart.controllers', [])
  .controller('MenuController', ['$scope', function($scope) {

    $scope.fireCommand = function(event, args) {
      $scope.$emit(event, args);
    }

  }]);