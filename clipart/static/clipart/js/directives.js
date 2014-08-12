'use strict';

angular.module('clipart.directives', [])
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
  })
  .directive('editor', ['$window', function($window) {
    return {
      restrict: 'E',
      templateUrl: '/static/clipart/partials/editor.html',
      replace: true,
      link: function(scope, element, attrs) {
        //Перемещение скрулов при ресайзе окна
        var canvas = new fabric.Canvas(element.find('canvas')[0]);

        var onWinResize = function() {
          //element.scrollTop((1000 - element.height())/2).scrollLeft((2000 - element.width())/2);
          //TODO - учесть что конвас должен иметь минимальный размер 800 на 800 px
          canvas.setHeight(element.height());
          canvas.setWidth(element.width());
        };
        onWinResize();
        angular.element($window).bind('resize', onWinResize);

        // создаём прямоугольник
        var rect = new fabric.Rect({
          left: 100,
          top: 100,
          fill: 'red',
          width: 50,
          height: 50
        });

        // добавляем прямоугольник, чтобы он отобразился
        canvas.add(rect);
      }
    }
  }]);
