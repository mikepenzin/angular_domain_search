var cronJob = {};

var request             = require('request'),
    cheerio             = require('cheerio'),
    cheerioTableparser  = require('cheerio-tableparser'),
    ScrapDB             = require('../models/scrapDB');
    

function convertToNumber(string) {
    
    var newString = '';
    
    if( string.indexOf('USD') != -1){
        string = string.split('USD');
        return Number(string[0].replace(/\,/g, ""));
    }
    
    if (string.indexOf('M') != -1) {
        string = string.split('M');
        newString = string[0].replace(/\s/g, '');
        if (newString.indexOf('.') != -1) {
            var numberAfterDot = newString.split('.');
            switch (numberAfterDot[1].length) {
                case 1:
                    return Number(newString.replace(/\./g, "") + "00000");
                    break;
                case 2:
                    return Number(newString.replace(/\./g, "") + "0000");
                    break;
                case 3:
                    return Number(newString.replace(/\./g, "") + "000");
                    break;
            }
            
        } else {
            return string = Number(newString.replace(/\./g, "") + "000000");
        }
    } else if (string.indexOf('K') != -1) {
        string = string.split('K');
        newString = string[0].replace(/\s/g, '');
        if (newString.indexOf('.') != -1) {
            var numberAfterDot = newString.split('.');
            switch (numberAfterDot[1].length) {
                case 1:
                    return Number(newString.replace(/\./g, "") + "00");
                    break;
                case 2:
                    return Number(newString.replace(/\./g, "") + "0");
                    break;
            }
        } else {
            return string = Number(newString.replace(/\./g, "") + "000");
        }
    } else {
        return Number(string.replace(/\,/g, ""));
    }
}


cronJob.dbFullCleanup = function(){
    
    ScrapDB.remove({}, function(err){
        if(err) { console.log(err); }
        console.log("All data were removed from DB!");
    }); 
    
};

cronJob.dbCleanup = function(){
    
    ScrapDB.remove({domain:{'$regex' : "no Domains found", '$options' : 'i'}}, function(err){
        if(err) { console.log(err); }
        console.log("Removed all irrelevant data from DB!");
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
                                        objectJson.bl = convertToNumber(data[1][i]);
                                        objectJson.dp = convertToNumber(data[2][i]);
                                        objectJson.aby = data[3][i];
                                        objectJson.acr = convertToNumber(data[4][i]);
                                        objectJson.similarWeb = convertToNumber(data[5][i]);
                                        objectJson.stc = data[6][i];
                                        objectJson.dmoz = data[7][i];
                                        objectJson.c = data[8][i];
                                        objectJson.n = data[9][i];
                                        objectJson.o = data[10][i];
                                        objectJson.d = data[11][i];
                                        objectJson.tldRequests = data[12][i];
                                        objectJson.rdt = data[13][i];
                                        objectJson.traffic = convertToNumber(data[14][i]);
                                        objectJson.valuation = convertToNumber(data[15][i]);
                                        objectJson.price = convertToNumber(data[16][i]);
                                        objectJson.bids = convertToNumber(data[17][i]);
                                        objectJson.endDate =  Date.now() + (10*60*60*1000);
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
                                    objectJson.bl = convertToNumber(data[1][i]);
                                    objectJson.dp = convertToNumber(data[2][i]);
                                    objectJson.aby = data[3][i];
                                    objectJson.acr = convertToNumber(data[4][i]);
                                    objectJson.similarWeb = convertToNumber(data[5][i]);
                                    objectJson.stc = data[6][i];
                                    objectJson.dmoz = data[7][i];
                                    objectJson.c = data[8][i];
                                    objectJson.n = data[9][i];
                                    objectJson.o = data[10][i];
                                    objectJson.d = data[11][i];
                                    objectJson.tldRequests = data[12][i];
                                    objectJson.rdt = data[13][i];
                                    objectJson.endDate = new Date(data[14][i]);
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
                                        objectJson.bl = convertToNumber(data[1][i]);
                                        objectJson.dp = convertToNumber(data[2][i]);
                                        objectJson.aby = data[3][i];
                                        objectJson.acr = convertToNumber(data[4][i]);
                                        objectJson.similarWeb = convertToNumber(data[5][i]);
                                        objectJson.stc = data[6][i];
                                        objectJson.dmoz = data[7][i];
                                        objectJson.c = data[8][i];
                                        objectJson.n = data[9][i];
                                        objectJson.o = data[10][i];
                                        objectJson.d = data[11][i];
                                        objectJson.tldRequests = data[12][i];
                                        objectJson.rdt = data[13][i];
                                        objectJson.price = convertToNumber(data[14][i]);
                                        objectJson.bids = convertToNumber(data[15][i]);
                                        objectJson.endDate =  Date.now() + (10*60*60*1000);
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
                                        objectJson.bl = convertToNumber(data[1][i]);
                                        objectJson.dp = convertToNumber(data[2][i]);
                                        objectJson.aby = data[3][i];
                                        objectJson.acr = convertToNumber(data[4][i]);
                                        objectJson.similarWeb = convertToNumber(data[5][i]);
                                        objectJson.stc = data[6][i];
                                        objectJson.dmoz = data[7][i];
                                        objectJson.c = data[8][i];
                                        objectJson.n = data[9][i];
                                        objectJson.o = data[10][i];
                                        objectJson.d = data[11][i];
                                        objectJson.tldRequests = data[12][i];
                                        objectJson.rdt = data[13][i];
                                        objectJson.price = convertToNumber(data[14][i]);
                                        objectJson.endDate = new Date(data[15][i]);
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