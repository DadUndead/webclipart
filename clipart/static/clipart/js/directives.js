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
  .directive('editor', function($window) {
    return {
      restrict: 'E',
      templateUrl: '/static/clipart/partials/editor.html',
      replace: true,
      link: function(scope, element, attrs) {
        //Перемещение скрулов при ресайзе окна
        var canvas = new fabric.Canvas(element.find('canvas')[0], {backgroundColor : "#fff"});

        scope.$watch(attrs.canvasWidth, function(width) {
          width = width || 800
          canvas.setWidth(width);
          element.find('.canvas-wrapper').css({'margin-left': -width / 2});
        });

        scope.$watch(attrs.canvasHeight, function(height) {
          height = height || 600
          canvas.setHeight(height);
          element.find('.canvas-wrapper').css({'margin-top': -height / 2});
        });

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
  });
