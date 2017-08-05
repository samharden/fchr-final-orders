'use strict';

describe('finalorderDetail', function() {

  // Load the module that contains the `finalorderDetail` component before each test
  beforeEach(module('finalorderDetail'));

  // Test the controller
  describe('FinalorderDetailController', function() {
    var $httpBackend, ctrl;
    var xyzFinalorderData = {
      name: 'finalorder xyz',
      images: ['image/url1.png', 'image/url2.png']
    };

    beforeEach(inject(function($componentController, _$httpBackend_, $routeParams) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('finalorders/xyz.json').respond(xyzFinalorderData);

      $routeParams.finalorderId = 'xyz';

      ctrl = $componentController('finalorderDetail');
    }));

    it('should fetch the finalorder details', function() {
      jasmine.addCustomEqualityTester(angular.equals);

      expect(ctrl.finalorder).toEqual({});

      $httpBackend.flush();
      expect(ctrl.finalorder).toEqual(xyzFinalorderData);
    });

  });

});
