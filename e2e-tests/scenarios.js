'use strict';

// Angular E2E Testing Guide:
// https://docs.angularjs.org/guide/e2e-testing

describe('FinalorderCat Application', function() {

  it('should redirect `index.html` to `index.html#!/finalorders', function() {
    browser.get('index.html');
    expect(browser.getLocationAbsUrl()).toBe('/finalorders');
  });

  describe('View: Finalorder list', function() {

    beforeEach(function() {
      browser.get('index.html#!/finalorders');
    });

    it('should filter the finalorder list as a user types into the search box', function() {
      var finalorderList = element.all(by.repeater('finalorder in $ctrl.finalorders'));
      var query = element(by.model('$ctrl.query'));

      expect(finalorderList.count()).toBe(20);

      query.sendKeys('nexus');
      expect(finalorderList.count()).toBe(1);

      query.clear();
      query.sendKeys('motorola');
      expect(finalorderList.count()).toBe(8);
    });

    it('should be possible to control finalorder order via the drop-down menu', function() {
      var queryField = element(by.model('$ctrl.query'));
      var orderSelect = element(by.model('$ctrl.orderProp'));
      var nameOption = orderSelect.element(by.css('option[value="name"]'));
      var finalorderNameColumn = element.all(by.repeater('finalorder in $ctrl.finalorders').column('finalorder.name'));

      function getNames() {
        return finalorderNameColumn.map(function(elem) {
          return elem.getText();
        });
      }

      queryField.sendKeys('tablet');   // Let's narrow the dataset to make the assertions shorter

      expect(getNames()).toEqual([
        'Motorola XOOM\u2122 with Wi-Fi',
        'MOTOROLA XOOM\u2122'
      ]);

      nameOption.click();

      expect(getNames()).toEqual([
        'MOTOROLA XOOM\u2122',
        'Motorola XOOM\u2122 with Wi-Fi'
      ]);
    });

    it('should render finalorder specific links', function() {
      var query = element(by.model('$ctrl.query'));
      query.sendKeys('nexus');

      element.all(by.css('.finalorders li a')).first().click();
      expect(browser.getLocationAbsUrl()).toBe('/finalorders/nexus-s');
    });

  });

  describe('View: Finalorder detail', function() {

    beforeEach(function() {
      browser.get('index.html#!/finalorders/nexus-s');
    });

    it('should display the `nexus-s` page', function() {
      expect(element(by.binding('$ctrl.finalorder.name')).getText()).toBe('Nexus S');
    });

    it('should display the first finalorder image as the main finalorder image', function() {
      var mainImage = element(by.css('img.finalorder.selected'));

      expect(mainImage.getAttribute('src')).toMatch(/img\/finalorders\/nexus-s.0.jpg/);
    });

    it('should swap the main image when clicking on a thumbnail image', function() {
      var mainImage = element(by.css('img.finalorder.selected'));
      var thumbnails = element.all(by.css('.finalorder-thumbs img'));

      thumbnails.get(2).click();
      expect(mainImage.getAttribute('src')).toMatch(/img\/finalorders\/nexus-s.2.jpg/);

      thumbnails.get(0).click();
      expect(mainImage.getAttribute('src')).toMatch(/img\/finalorders\/nexus-s.0.jpg/);
    });

  });

});
