'use strict';


angular.module('clipart', [])
  .controller('GalleryController', ['$scope', '$http', '$log', function($scope, $http, $log) {

    //Загружаем список категорий
    $http.get('/clipart/categories').success(function(data) {
      $scope.categories = data;
    });

    //Калбэк для клика по чекбоксам категорий
    $scope.categoriesChanged = function(categories) {
      var selectedCatIds = [];
      categories.forEach(function(cat) {
        if (cat.checked) {
          selectedCatIds.push(cat.id);
        }
      });
      $log.info(selectedCatIds);
      if (selectedCatIds.length) {
        //Грузим список картинок с данными категориями
        $http({
          url: '/clipart/images',
          method: "GET",
          params: { categories: selectedCatIds.join(',') }
        }).success(function(data) {
          $log.info(data);
          $scope.images = data;
        });
      } else {
        $scope.images = [];
      }
    }
  }])

  .directive('ngSlider', function() {
    return {
      restrict: 'A',
      require : 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        element.slider({
            min: parseFloat(attrs.min) || 0,
            max: parseFloat(attrs.max) || 10,
            slide: function(event, ui) {
              scope.$apply(function() {
                ngModel.$setViewValue(ui.value);
              });
            }
          });

        scope.$watch(attrs.ngModel, function(value) {
          element.slider('value', value)
        });

        ngModel.$render = function() {
          element.slider('value', ngModel.$viewValue)
        };
      }
    }
  });