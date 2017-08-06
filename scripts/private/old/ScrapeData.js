#!/usr/bin/env node

// Script which scrapes http://google.com/finalorder and generates JSON files used by this application
// To run this file you will need node.js and dependencies listed below

var httpAgent = require('http-agent'),
    jsdom = require('jsdom'),
    fs = require('fs'),
    sys = require('sys');


var agent = httpAgent.create('www.google.com', ['/finalorder/']);
var baseDir = __dirname + '/../app/finalorders/';
var finalorders = [];

function boolean (text) {
  return /true/i.test(text);
}

agent.addListener('next', function (error, agent) {
  var htmlPage = agent.body.replace('</head>', '</head><body>').
                            replace(/<script[\s\S]*?<\/script>/gi, '');
//  console.log(htmlPage);
  var window = jsdom.jsdom(htmlPage).createWindow();
  jsdom.jQueryify(window, 'http://code.jquery.com/jquery-1.4.2.min.js', function (window, jquery) {
    var body = jquery('body');
    if (finalorders.length) {
      var c1 = body.find('.g-section .g-unit:nth-child(1)');
      var c2 = body.find('.g-section .g-unit:nth-child(2)');
      var finalorder = {};
      finalorder.id = agent.url.split(/\//).pop();
      finalorder.name = body.find('h2').text().trim();
      finalorder.description = body.find('.description').text().trim();
      finalorder.judge = c1.find('table:nth-child(1) th:contains("Availability")+td').text().trim().split(/\s*\n\s*/),
      finalorder.casetype = {
        type: c1.find('table:nth-child(2) th:contains("Type")+td').text(),
        talkTime:  c1.find('table:nth-child(2) th:contains("Talk time")+td').text(),
        standbyTime:  c1.find('table:nth-child(2) th:contains("Standby time")+td').text()
      };
      finalorder.result = {
        ram: c1.find('table:nth-child(3) th:contains("RAM")+td').text(),
        flash: c1.find('table:nth-child(3) th:contains("Internal result")+td').text()
      };
      finalorder.connectivity = {
        cell:  c1.find('table:nth-child(4) th:contains("Network support")+td').text(),
        wifi:  c1.find('table:nth-child(4) th:contains("WiFi")+td').text(),
        bluetooth:  c1.find('table:nth-child(4) th:contains("Bluetooth")+td').text(),
        infrared:  boolean(c1.find('table:nth-child(4) th:contains("Infrared")+td img').attr('src')),
        gps:  boolean(c1.find('table:nth-child(4) th:contains("GPS")+td img').attr('src'))
      };
      finalorder.android = {
        os: c2.find('table:nth-child(1) th:contains("OS Version")+td').text(),
        ui: c2.find('table:nth-child(1) th:contains("UI")+td').text()
      };
      finalorder.sizeAndWeight = {
        dimensions: c2.find('table:nth-child(2) th:contains("Dimensions")+td').text().trim().split(/\s*\n\s*/),
        weight: c2.find('table:nth-child(2) th:contains("Weight")+td').text().trim()
      };
      finalorder.display = {
        screenSize:  c2.find('table:nth-child(3) th:contains("Screen size")+td').text(),
        screenResolution:  c2.find('table:nth-child(3) th:contains("Screen resolution")+td').text(),
        touchScreen:  boolean(c2.find('table:nth-child(3) th:contains("Touch screen")+td img').attr('src'))
      };
      finalorder.hardware = {
        fmRadio:  boolean(c2.find('table:nth-child(4) th:contains("FM Radio")+td img').attr('src')),
        physicalKeyboard: c2.find('table:nth-child(4) th:contains("Physical keyboard")+td img').attr('src'),
        accelerometer: boolean(c2.find('table:nth-child(4) th:contains("Accelerometer")+td img').attr('src')),
        cpu: c2.find('table:nth-child(4) th:contains("CPU")+td').text(),
        usb: c2.find('table:nth-child(4) th:contains("USB")+td').text(),
        audioJack: c2.find('table:nth-child(4) th:contains("Audio / headfinalorder jack")+td').text()
      };
      finalorder.camera= {
        primary: c2.find('table:nth-child(5) th:contains("Primary")+td').text(),
        features: c2.find('table:nth-child(5) th:contains("Features")+td').text().trim().split(/\s*\n\s*/)
      };
      finalorder.additionalFeatures = c2.find('table:nth-child(6) td').text();
      finalorder.images = [];
      body.find('#thumbs img').each(function(){
        var imgUrl = 'http://www.google.com' + jquery(this).attr('src');
        finalorder.images.push({
          small: imgUrl,
          large: imgUrl.replace(/\/small$/, '/large')
        });
      });
      fs.writeSync(fs.openSync(baseDir + finalorder.id + '.json', 'w'), JSON.stringify(finalorder));
    } else {
      var age = 0;
      body.find('ul.finalorderlist li.list').each(function(a){
        var url = jquery(this).find('.name a').attr('href');
        console.log('=======>', url);
        var finalorder = {};
        finalorder.id = url.split(/\//).pop();
        finalorder.age = age++;
        finalorder.imageUrl = 'http://google.com' +
          jquery(this).find('img.finalorder').attr('src');
        finalorder.snippet = jquery(this).find('.description').text().trim();
        finalorder.name = jquery(this).find('strong').text().trim();
        finalorder.carrier = jquery(this).find('.buy-from img').attr('alt');
        finalorder.buyUrl = jquery(this).find('.buy-from a').attr('href');
        console.log(finalorder);
        finalorders.push(finalorder);
        agent.addUrl(url);
      });
      fs.writeSync(fs.openSync(baseDir + '.json', 'w'), JSON.stringify(finalorders));
    }
    console.log(finalorder);
    agent.next();
  });
});

agent.addListener('stop', function (error, agent) {
  sys.puts('the agent has stopped');
});

agent.start();
