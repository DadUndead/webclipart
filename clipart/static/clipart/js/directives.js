'use strict';

angular.module('clipart.directives', [])

  //Директива для слайдера

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

  //Директива для редактора включающая загрузку шаблона

  .directive('editor', ['$rootScope', function($rootScope) {
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

        //Вытаскиваем из события область перетаскиваемого объекта и извлекаем из ней путь к изображению
        $rootScope.$on('drop', function(event, position) {
          fabric.Image.fromURL(event.targetScope.image.src, function(img) {

            img.setLeft(position.left - canvas.getWidth()/2);
            img.setTop(position.top - canvas.getHeight()/2);

            canvas.add(img);
          });
        });
      }
    }
  }])

  //Директива для галлерей с возможностю перетаскивать изображения

  .directive('gallery', ['$http', '$log', function($http, $log) {
    return {
      restrict: 'E',
      templateUrl: '/static/clipart/partials/gallery.html',
      replace: true,
      link: function(scope, element, attrs) {
        //Загружаем список категорий
        $http.get('/clipart/categories').success(function(data) {
          scope.categories = data;
        });

        //Калбэк для клика по чекбоксам категорий
        scope.categoriesChanged = function(categories) {
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
              scope.images = data;
            });
          } else {
            scope.images = [];
          }
        };

        //Таскалка
      }
    }
  }])

  //Директива для перетаскивания объектов dom

  .directive('ngDraggable', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.draggable({
          helper: 'clone',
          appendTo: "body",
          revert:'invalid',
          containment: '#wrapper',
          zIndex: 100
        });

        element.on('drop', function(event, position) {
          scope.$emit('drop', position);
        });

        scope.$on('$destroy', function() {
          element.draggable( "destroy" );
        });
      }
    }
  })

  //Директива для бросания объектов

  .directive('ngDroppable', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.droppable({
          accept: '.image-wrapper',
          drop: function(event, ui) {
            var dr = ui.draggable;
            dr.trigger('drop', ui.position);
          }
        });

        scope.$on('$destroy', function() {
          element.droppable( "destroy" );
        });

      }
    }
  });
