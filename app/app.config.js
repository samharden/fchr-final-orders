'use strict';

angular.
  module('finalordercatApp').
  config(['$locationProvider' ,'$routeProvider',
    function config($locationProvider, $routeProvider) {
      // $locationProvider.hashPrefix('!');

      $routeProvider.
        when('/finalorders', {
          template: '<finalorder-list></finalorder-list>'
        }).
        when('/finalorders/:finalorderId', {
          template: '<finalorder-detail></finalorder-detail>'
        }).
        otherwise('/finalorders');
    }
  ]);
