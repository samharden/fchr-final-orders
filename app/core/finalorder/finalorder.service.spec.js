'use strict';

describe('Finalorder', function() {
  var $httpBackend;
  var Finalorder;
  var finalordersData = [
    {name: 'Finalorder X'},
    {name: 'Finalorder Y'},
    {name: 'Finalorder Z'}
  ];

  // Add a custom equality tester before each test
  beforeEach(function() {
    jasmine.addCustomEqualityTester(angular.equals);
  });

  // Load the module that contains the `Finalorder` service before each test
  beforeEach(module('core.finalorder'));

  // Instantiate the service and "train" `$httpBackend` before each test
  beforeEach(inject(function(_$httpBackend_, _Finalorder_) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('finalorders/finalorders.json').respond(finalordersData);

    Finalorder = _Finalorder_;
  }));

  // Verify that there are no outstanding expectations or requests after each test
  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should fetch the finalorders data from `/finalorders/finalorders.json`', function() {
    var finalorders = Finalorder.query();

    expect(finalorders).toEqual([]);

    $httpBackend.flush();
    expect(finalorders).toEqual(finalordersData);
  });

});
