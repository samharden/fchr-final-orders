'use strict';

describe('finalorderList', function() {

  // Load the module that contains the `finalorderList` component before each test
  beforeEach(module('finalorderList'));

  // Test the controller
  describe('FinalorderListController', function() {
    var $httpBackend, ctrl;

    beforeEach(inject(function($componentController, _$httpBackend_) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('finalorders/finalorders.json')
                  .respond([{name: 'Nexus S'}, {name: 'Motorola DROID'}]);

      ctrl = $componentController('finalorderList');
    }));

    it('should create a `finalorders` property with 2 finalorders fetched with `$http`', function() {
      jasmine.addCustomEqualityTester(angular.equals);

      expect(ctrl.finalorders).toEqual([]);

      $httpBackend.flush();
      expect(ctrl.finalorders).toEqual([{name: 'Nexus S'}, {name: 'Motorola DROID'}]);
    });

    it('should set a default value for the `orderProp` property', function() {
      expect(ctrl.orderProp).toBe('age');
    });

  });

});
