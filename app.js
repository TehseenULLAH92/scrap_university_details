var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

const url = 'https://www.topuniversities.com/universities/massachusetts-institute-technology-mit';

  request(url, function(error, response, html){
    if(!error){
      var $ = cheerio.load(html);

      var title, location, globalranktitle, overviewtitle,overviewsummery, uni_highlights,
      uni_ranking_student_wise,uni_ranking_staff_wise,campuses_location_title,campuses_location_address,
      campuses_location_address_pincode;
      var json = {
        title : "",location: "",  globalranktitle : "", overviewtitle : "",
        overviewsummery : "", uni_highlights: "", uni_ranking_student_wise:"",uni_ranking_staff_wise:"",
        campuses_location_title:"",campuses_location_address:"",campuses_location_address_pincode:""
      };

      $('.title_info').filter(function(){
        var data = $(this);
        title = data.children().first().text().trim();
        json.title = title;
        location = data.children('.location').last().text().replace(/View map/g,"").trim();
        json.location = location;
      })
      $('.uni_stats').filter(function(){
        var data = $(this);
        globalranktitle = data.children().first().text()
        .replace(/(\n)/gm," ").trim();
        json.globalranktitle = globalranktitle;
      })
      $('.leftside').filter(function(){
        var data = $(this);
        overviewtitle = data.children('.title').first().text().trim();
        json.overviewtitle = overviewtitle;
      })
      var parag = [];
      $('.overview-content').find('div > p').each(function (index, element) {
        parag.push($(element).last().text());
        json.overviewsummery = parag;
      });
      $('.uni_highlights').filter(function(){
        var data = $(this);
        uni_highlights = data.children('.title').first().text().trim();
        json.uni_highlights = uni_highlights;
      })
      $('.rank').filter(function(){
        var data = $(this);
        uni_ranking_student_wise = data.children('.student').first().text().trim();
        json.uni_ranking_student_wise = uni_ranking_student_wise;
      })
      $('.rank').filter(function(){
        var data = $(this);
        uni_ranking_staff_wise = data.children('.faculty').first().text().trim();
        json.uni_ranking_staff_wise = uni_ranking_staff_wise;
      })
      $('.campuses').filter(function(){
        var data = $(this);
        campuses_location_title = data.children('.title').first().text().trim();
        json.campuses_location_title = campuses_location_title;
      })
      $('.view-footer').filter(function(){
        var data = $(this);
        campuses_location_address = data.children().last().append(" ").text()
        .replace(/(\r\n|\n|\r)/gm,"").replace(/View map/g,"").trim();
        json.campuses_location_address = campuses_location_address;
      })
      $('.field-campus-address').filter(function(){
        var data = $(this);
        campuses_location_address_pincode = data.children().first().text()
               .replace(/(\r\n|\n|\r)/gm,"")
               .trim();
        json.campuses_location_address_pincode = campuses_location_address_pincode;
      })
    }
    fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
      console.log('File successfully Added! - Please Check OutPut.Json File For Result...');
    })
  })


app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;
