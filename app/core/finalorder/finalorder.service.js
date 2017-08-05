'use strict';

angular.
  module('core.finalorder').
  factory('Finalorder', ['$resource',
    function($resource) {
      return $resource('finalorders/:finalorderId.json', {}, {
        query: {
          method: 'GET',
          params: {finalorderId: 'finalorders'},
          isArray: true
        }
      });
    }
  ]);
