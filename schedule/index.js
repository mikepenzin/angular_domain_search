var cronJob = {};

var request             = require('request'),
    cheerio             = require('cheerio'),
    cheerioTableparser  = require('cheerio-tableparser'),
    ScrapDB             = require('../models/scrapDB');

cronJob.dbCleanup = function(){
    
    ScrapDB.remove({}, function(err){
        if(err) { console.log(err); }
        console.log("All data were removed from DB!");
    }); 
    
};

cronJob.godaddy = function(){
    
    for(var y = 0; y <= 500; y += 25) {
        (function(y){
            setTimeout(function(){
                var url = "https://www.expireddomains.net/godaddy-expired-domains/?start=" + y;
                
                (function(url){
                    console.log("current URL: " + url);
                    request(url, function(error, response, html){
                        var $ = cheerio.load(html);
                        $('ul').remove();
                        $('li').remove();
                        $('img').remove();
                        $('a').removeAttr('style').removeAttr('class');
                        $('a').each(function() {
                            var updated_link = $(this).attr('href').replace('/goto', 'https://www.expireddomains.net/goto');
                            $(this).attr('href', updated_link);
                        });
                        cheerioTableparser($);
                        var data = $("tbody").parsetable(true, true, true);
                        data.pop();
                        console.log('Current parsed table: ' + data.length);
                        if (data[0].length != null) {
                            (function(data){
                                console.log('Current parsed table content: ' + data.length);
                                    console.log('Current parsed table first element: ' + data[0][0]);
                                    for(var i = 0; i < data[0].length; i++) {
                                        var objectJson = {};
                                        objectJson.domain = data[0][i];
                                        objectJson.bl = data[1][i];
                                        objectJson.dp = data[2][i];
                                        objectJson.aby = data[3][i];
                                        objectJson.acr = data[4][i];
                                        objectJson.similarWeb = data[5][i];
                                        objectJson.stc = data[6][i];
                                        objectJson.dmoz = data[7][i];
                                        objectJson.c = data[8][i];
                                        objectJson.n = data[9][i];
                                        objectJson.o = data[10][i];
                                        objectJson.d = data[11][i];
                                        objectJson.tldRequests = data[12][i];
                                        objectJson.rdt = data[13][i];
                                        objectJson.traffic = data[14][i];
                                        objectJson.valuation = data[15][i];
                                        objectJson.price = data[16][i];
                                        objectJson.bids = data[17][i];
                                        objectJson.endDate = data[18][i];
                                        objectJson.seller = 'GoDaddy';
                                        
                                        (function(objectJson){
                                            ScrapDB.create(objectJson, function (err) {
                                                if(err) { console.log(err) }
                                                console.log('Domain object: ' + objectJson.domain + ' was added to DB!');
                                            });
                                        })(objectJson);
                                    }
                            })(data);
                        } else {
                            console.log(y, data, data.length);
                        }
                    });
                    
                })(url);
            }, y * 200);
        })(y);
        
    }    
};

cronJob.generalDomains = function(){
    
    for(var y = 0; y <= 500; y += 25) {
    (function(y){
        setTimeout(function(){
            var url = "https://www.expireddomains.net/backorder-expired-domains/?start=" + y + "&o=bl&r=d";
            
            (function(url){
                console.log("current URL: " + url);
                request(url, function(error, response, html){
                    var $ = cheerio.load(html);
                    $('ul').remove();
                    $('li').remove();
                    $('img').remove();
                    $('a').removeAttr('style').removeAttr('class');
                    $('a').each(function() {
                        var updated_link = $(this).attr('href').replace('/goto', 'https://www.expireddomains.net/goto');
                        $(this).attr('href', updated_link);
                    });
                    cheerioTableparser($);
                    var data = $("tbody").parsetable(true, true, true);
                    data.pop();
                    console.log('Current parsed table: ' + data.length);
                    if (data[0].length != null) {
                        (function(data){
                            console.log('Current parsed table content: ' + data.length);
                                console.log('Current parsed table first element: ' + data[0][0]);
                                for(var i = 0; i < data[0].length; i++) {
                                    var objectJson = {};
                                    objectJson.domain = data[0][i];
                                    objectJson.bl = data[1][i];
                                    objectJson.dp = data[2][i];
                                    objectJson.aby = data[3][i];
                                    objectJson.acr = data[4][i];
                                    objectJson.similarWeb = data[5][i];
                                    objectJson.stc = data[6][i];
                                    objectJson.dmoz = data[7][i];
                                    objectJson.c = data[8][i];
                                    objectJson.n = data[9][i];
                                    objectJson.o = data[10][i];
                                    objectJson.d = data[11][i];
                                    objectJson.tldRequests = data[12][i];
                                    objectJson.rdt = data[13][i];
                                    objectJson.endDate = data[14][i];
                                    
                                    (function(objectJson){
                                        ScrapDB.create(objectJson, function (err) {
                                          console.log('Domain object: ' + objectJson.domain + ' was added to DB!');
                                        });
                                    })(objectJson);
                                }
                        })(data);
                    } else {
                        console.log(y, data, data.length);
                    }
                });
                
            })(url);
        }, y * 200);
    })(y);
    
}    
    
};

cronJob.namecom = function(){
    
    for(var y = 0; y <= 425; y += 25) {
    (function(y){
        setTimeout(function(){
            var url = "https://www.expireddomains.net/namecom-expired-domains/?start=" + y;
            
            (function(url){
                console.log("current URL: " + url);
                request(url, function(error, response, html){
                    var $ = cheerio.load(html);
                    $('ul').remove();
                    $('li').remove();
                    $('img').remove();
                    $('a').removeAttr('style').removeAttr('class');
                    $('a').each(function() {
                        var updated_link = $(this).attr('href').replace('/goto', 'https://www.expireddomains.net/goto');
                        $(this).attr('href', updated_link);
                    });
                    cheerioTableparser($);
                    var data = $("tbody").parsetable(true, true, true);
                    data.pop();
                    console.log('Current parsed table: ' + data.length);
                    if (data[0].length != null) {
                        (function(data){
                            console.log('Current parsed table content: ' + data.length);
                                console.log('Current parsed table first element: ' + data[0][0]);
                                for(var i = 0; i < data[0].length; i++) {
                                    var objectJson = {};
                                    objectJson.domain = data[0][i];
                                    objectJson.bl = data[1][i];
                                    objectJson.dp = data[2][i];
                                    objectJson.aby = data[3][i];
                                    objectJson.acr = data[4][i];
                                    objectJson.similarWeb = data[5][i];
                                    objectJson.stc = data[6][i];
                                    objectJson.dmoz = data[7][i];
                                    objectJson.c = data[8][i];
                                    objectJson.n = data[9][i];
                                    objectJson.o = data[10][i];
                                    objectJson.d = data[11][i];
                                    objectJson.tldRequests = data[12][i];
                                    objectJson.rdt = data[13][i];
                                    objectJson.endDate = data[14][i];
                                    objectJson.seller = 'Name.com';
                                    
                                    (function(objectJson){
                                        ScrapDB.create(objectJson, function (err) {
                                          console.log('Domain object: ' + objectJson.domain + ' was added to DB!');
                                        });
                                    })(objectJson);
                                }
                        })(data);
                    } else {
                        console.log(y, data, data.length);
                    }
                });
                
            })(url);
        }, y * 200);
    })(y);
    
}    
    
};

cronJob.dynadot = function(){
    
    for(var y = 0; y <= 500; y += 25) {
        (function(y){
            setTimeout(function(){
                var url = "https://www.expireddomains.net/dynadot-expired-domains/?start=" + y;
                
                (function(url){
                    console.log("current URL: " + url);
                    request(url, function(error, response, html){
                        var $ = cheerio.load(html);
                        $('ul').remove();
                        $('li').remove();
                        $('img').remove();
                        $('a').removeAttr('style').removeAttr('class');
                        $('a').each(function() {
                            var updated_link = $(this).attr('href').replace('/goto', 'https://www.expireddomains.net/goto');
                            $(this).attr('href', updated_link);
                        });
                        cheerioTableparser($);
                        var data = $("tbody").parsetable(true, true, true);
                        data.pop();
                        console.log('Current parsed table: ' + data.length);
                        if (data[0].length != null) {
                            (function(data){
                                console.log('Current parsed table content: ' + data.length);
                                    console.log('Current parsed table first element: ' + data[0][0]);
                                    for(var i = 0; i < data[0].length; i++) {
                                        var objectJson = {};
                                        objectJson.domain = data[0][i];
                                        objectJson.bl = data[1][i];
                                        objectJson.dp = data[2][i];
                                        objectJson.aby = data[3][i];
                                        objectJson.acr = data[4][i];
                                        objectJson.similarWeb = data[5][i];
                                        objectJson.stc = data[6][i];
                                        objectJson.dmoz = data[7][i];
                                        objectJson.c = data[8][i];
                                        objectJson.n = data[9][i];
                                        objectJson.o = data[10][i];
                                        objectJson.d = data[11][i];
                                        objectJson.tldRequests = data[12][i];
                                        objectJson.rdt = data[13][i];
                                        objectJson.price = data[14][i];
                                        objectJson.bids = data[15][i];
                                        objectJson.endDate = data[16][i];
                                        objectJson.seller = 'Dynadot';
                                        
                                        (function(objectJson){
                                            ScrapDB.create(objectJson, function (err) {
                                                if(err) { console.log(err) }
                                                console.log('Domain object: ' + objectJson.domain + ' was added to DB!');
                                            });
                                        })(objectJson);
                                    }
                            })(data);
                        } else {
                            console.log(y, data, data.length);
                        }
                    });
                    
                })(url);
            }, y * 200);
        })(y);
        
    }    
};

cronJob.namejet = function(){
    
    for(var y = 0; y <= 500; y += 25) {
        (function(y){
            setTimeout(function(){
                var url = "https://www.expireddomains.net/namejet-prerelease-domains/?start=" + y;
                
                (function(url){
                    console.log("current URL: " + url);
                    request(url, function(error, response, html){
                        var $ = cheerio.load(html);
                        $('ul').remove();
                        $('li').remove();
                        $('img').remove();
                        $('a').removeAttr('style').removeAttr('class');
                        $('a').each(function() {
                            var updated_link = $(this).attr('href').replace('/goto', 'https://www.expireddomains.net/goto');
                            $(this).attr('href', updated_link);
                        });
                        cheerioTableparser($);
                        var data = $("tbody").parsetable(true, true, true);
                        data.pop();
                        console.log('Current parsed table: ' + data.length);
                        if (data[0].length != null) {
                            (function(data){
                                console.log('Current parsed table content: ' + data.length);
                                    console.log('Current parsed table first element: ' + data[0][0]);
                                    for(var i = 0; i < data[0].length; i++) {
                                        var objectJson = {};
                                        objectJson.domain = data[0][i];
                                        objectJson.bl = data[1][i];
                                        objectJson.dp = data[2][i];
                                        objectJson.aby = data[3][i];
                                        objectJson.acr = data[4][i];
                                        objectJson.similarWeb = data[5][i];
                                        objectJson.stc = data[6][i];
                                        objectJson.dmoz = data[7][i];
                                        objectJson.c = data[8][i];
                                        objectJson.n = data[9][i];
                                        objectJson.o = data[10][i];
                                        objectJson.d = data[11][i];
                                        objectJson.tldRequests = data[12][i];
                                        objectJson.rdt = data[13][i];
                                        objectJson.price = data[14][i];
                                        objectJson.endDate = data[15][i];
                                        objectJson.seller = 'NameJet';
                                        
                                        (function(objectJson){
                                            ScrapDB.create(objectJson, function (err) {
                                                if(err) { console.log(err) }
                                                console.log('Domain object: ' + objectJson.domain + ' was added to DB!');
                                            });
                                        })(objectJson);
                                    }
                            })(data);
                        } else {
                            console.log(y, data, data.length);
                        }
                    });
                    
                })(url);
            }, y * 200);
        })(y);
        
    }    
};

module.exports = cronJob;