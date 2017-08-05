'use strict';

// Register `finalorderList` component, along with its associated controller and template
angular.
  module('finalorderList').
  component('finalorderList', {
    templateUrl: 'finalorder-list/finalorder-list.template.html',
    controller: ['Finalorder',
      function FinalorderListController(Finalorder) {
        this.finalorders = Finalorder.query();
        this.orderProp = 'age';
      }
    ]
  });
