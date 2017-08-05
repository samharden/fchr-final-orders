'use strict';

// Register `finalorderDetail` component, along with its associated controller and template
angular.
  module('finalorderDetail').
  component('finalorderDetail', {
    templateUrl: 'finalorder-detail/finalorder-detail.template.html',
    controller: ['$routeParams', 'Finalorder',
      function FinalorderDetailController($routeParams, Finalorder) {
        var self = this;
        self.finalorder = Finalorder.get({finalorderId: $routeParams.finalorderId}, function(finalorder) {
          self.setImage(finalorder.images[0]);
        });

        self.setImage = function setImage(imageUrl) {
          self.mainImageUrl = imageUrl;
        };
      }
    ]
  });
