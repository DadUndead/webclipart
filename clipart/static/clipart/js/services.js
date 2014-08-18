'use strict';

angular.module('clipart.services', [])
  .factory('Database', ['$http', '$q', function($http, $q) {
    return {

      getCategories: function() {
        return $http.get('/clipart/categories');
      },

      getImages: function(ids) {
        return $http({
          url: '/clipart/images',
          method: "GET",
          params: { categories: ids.join(',') }
        });
      }

    }
  }]);
