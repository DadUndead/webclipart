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

        if (!document.createElement('canvas').getContext) {
          element.append('<div style="position: absolute; top: 30px; width: 100%; height: 120px; text-align: center;">' +
                            '<h1>Ваш браузер не поддерживается</h1>' +
                         '</div>');
          return;
        }

        //Перемещение скрулов при ресайзе окна
        var canvas = new fabric.Canvas(element.find('canvas')[0], {backgroundColor : "#fff"});

        scope.$watch(attrs.canvasWidth, function(width) {
          width = width || 800;
          canvas.setWidth(width);
          element.find('.canvas-wrapper').css({'margin-left': -width / 2});
        });

        scope.$watch(attrs.canvasHeight, function(height) {
          height = height || 600;
          canvas.setHeight(height);
          element.find('.canvas-wrapper').css({'margin-top': -height / 2});
        });

        //Вытаскиваем из события область перетаскиваемого объекта и извлекаем из ней путь к изображению
        $rootScope.$on('drop', function(event, position) {
          fabric.Image.fromURL(event.targetScope.image.src, function(img) {

            var offset = fabric.util.getElementOffset(canvas.lowerCanvasEl);
            img.setLeft(position.left - offset.left);
            img.setTop(position.top - offset.top);
            img.borderColor = '#FF0080';
            img.cornerColor = '#FF0080';

            canvas.add(img);
          });
        });

        function active(cb) {
          if (canvas.getActiveGroup()) {
            canvas.getActiveGroup().forEachObject(function(o) { cb(o); });
          } else if (canvas.getActiveObject()) {
            cb(canvas.getActiveObject());
          }
        }

        //Команды
        $rootScope.$on('command:front', function() {
          active(function(o) { canvas.bringToFront(o); });
        });

        $rootScope.$on('command:back', function() {
          active(function(o) { canvas.sendToBack(o) });
        });

        $rootScope.$on('command:clear', function() {
          canvas.clear().renderAll();
        });

        $('html').keyup(function(e) {
          if (e.keyCode == 46) {
            if (canvas.getActiveGroup()) {
              canvas.getActiveGroup().forEachObject(function(o) { canvas.remove(o); });
              canvas.discardActiveGroup().renderAll();
            } else {
              canvas.remove(canvas.getActiveObject());
            }
          }
        });

        //инициация события нажатия
        function fireClick(obj){
          var fireOnThis = obj;
          if( document.createEvent ) {
            var evObj = document.createEvent('MouseEvents');
            evObj.initEvent( 'click', true, false );
            fireOnThis.dispatchEvent( evObj );

          } else if( document.createEventObject ) {
            var evObj = document.createEventObject();
            fireOnThis.fireEvent( 'onclick', evObj );
          }
        }

        $rootScope.$on('command:save', function(event, format) {
          canvas.deactivateAllWithDispatch().renderAll();

          var dataUrl = canvas.toDataURL(format);
          var a = $('<a>').attr({ href:dataUrl, download:'webclipart.' + format })[0];
          fireClick(a);
        });
      }
    }
  }])

  //Директива для галлерей с возможностю перетаскивать изображения

  .directive('gallery', ['$http', '$log', 'Database', function($http, $log, Database) {
    return {
      restrict: 'E',
      templateUrl: '/static/clipart/partials/gallery.html',
      replace: true,
      link: function(scope, element, attrs) {
        //Загружаем список категорий
        Database.getCategories().success(function(data) {
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
            Database.getImages(selectedCatIds).success(function(data) {
              $log.info(data);
              scope.images = data;
            });
          } else {
            scope.images = [];
          }
        };
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
          cursor: 'move',
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
          drop: function(event, ui) {
            var dr = ui.draggable;
            dr.trigger('drop', ui.position);
          }
        });

        scope.$watch(attrs.accept, function(newValue) {
          element.droppable( "option", "accept", newValue );
        });

        scope.$on('$destroy', function() {
          element.droppable( "destroy" );
        });

      }
    }
  });
