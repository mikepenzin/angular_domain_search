var scrapper = {};

var request             = require('request'),
    cheerio             = require('cheerio'),
    cheerioTableparser  = require('cheerio-tableparser'),
    domainDB             = require('../models/domainDB');
    

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
        return isNaN(Number(string.replace(/\,/g, ""))) ? 0 : Number(string.replace(/\,/g, ""));
    }
}

function addItemToDB(dataObject){
    domainDB.create(dataObject, function (err) {
        if(err) { console.log(err) }
        console.log('Domain object: ' + dataObject.domain + ' was added to DB!');
    });
}


scrapper.dbFullCleanup = function(){
    
    domainDB.remove({}, function(err){
        if(err) { console.log(err); }
        console.log("All data were removed from DB!");
    }); 
    
};

scrapper.dbCleanup = function(){
    
    domainDB.remove({domain:{'$regex' : "no Domains found", '$options' : 'i'}}, function(err){
        if(err) { console.log(err); }
        console.log("Removed all irrelevant data from DB!");
    }); 
    
};

scrapper.godaddy = function(){
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
                                        var dataObject = {};
                                        dataObject.domain = data[0][i];
                                        dataObject.bl = convertToNumber(data[1][i]);
                                        dataObject.dp = convertToNumber(data[2][i]);
                                        dataObject.aby = data[3][i];
                                        dataObject.acr = convertToNumber(data[4][i]);
                                        dataObject.similarWeb = convertToNumber(data[5][i]);
                                        dataObject.dmoz = data[6][i];
                                        dataObject.c = data[7][i];
                                        dataObject.n = data[8][i];
                                        dataObject.o = data[9][i];
                                        dataObject.d = data[10][i];
                                        dataObject.tldRequests = data[11][i];
                                        dataObject.rdt = data[12][i];
                                        dataObject.traffic = convertToNumber(data[13][i]);
                                        dataObject.valuation = convertToNumber(data[14][i]);
                                        dataObject.price = convertToNumber(data[15][i]);
                                        dataObject.bids = convertToNumber(data[16][i]);
                                        dataObject.endDate =  Date.now() + (10*60*60*1000);
                                        dataObject.seller = 'GoDaddy';
                                        
                                        addItemToDB(dataObject);
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

scrapper.namecom = function(){
    
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
                                    var dataObject = {};
                                    dataObject.domain = data[0][i];
                                    dataObject.bl = convertToNumber(data[1][i]);
                                    dataObject.dp = convertToNumber(data[2][i]);
                                    dataObject.aby = data[3][i];
                                    dataObject.acr = convertToNumber(data[4][i]);
                                    dataObject.similarWeb = convertToNumber(data[5][i]);
                                    dataObject.dmoz = data[6][i];
                                    dataObject.c = data[7][i];
                                    dataObject.n = data[8][i];
                                    dataObject.o = data[9][i];
                                    dataObject.d = data[10][i];
                                    dataObject.tldRequests = data[11][i];
                                    dataObject.rdt = data[12][i];
                                    dataObject.endDate = new Date(data[13][i]);
                                    dataObject.seller = 'Name.com';
                                    
                                    addItemToDB(dataObject);
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

scrapper.dynadot = function(){
    
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
                                        var dataObject = {};
                                        dataObject.domain = data[0][i];
                                        dataObject.bl = convertToNumber(data[1][i]);
                                        dataObject.dp = convertToNumber(data[2][i]);
                                        dataObject.aby = data[3][i];
                                        dataObject.acr = convertToNumber(data[4][i]);
                                        dataObject.similarWeb = convertToNumber(data[5][i]);
                                        dataObject.dmoz = data[6][i];
                                        dataObject.c = data[7][i];
                                        dataObject.n = data[8][i];
                                        dataObject.o = data[9][i];
                                        dataObject.d = data[10][i];
                                        dataObject.tldRequests = data[11][i];
                                        dataObject.rdt = data[12][i];
                                        dataObject.price = convertToNumber(data[13][i]);
                                        dataObject.bids = convertToNumber(data[14][i]);
                                        dataObject.endDate =  Date.now() + (10*60*60*1000);
                                        dataObject.seller = 'Dynadot';
                                        
                                        addItemToDB(dataObject);
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

scrapper.namejet = function(){
    
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
                                        var dataObject = {};
                                        dataObject.domain = data[0][i];
                                        dataObject.bl = convertToNumber(data[1][i]);
                                        dataObject.dp = convertToNumber(data[2][i]);
                                        dataObject.aby = data[3][i];
                                        dataObject.acr = convertToNumber(data[4][i]);
                                        dataObject.similarWeb = convertToNumber(data[5][i]);
                                        dataObject.dmoz = data[6][i];
                                        dataObject.c = data[7][i];
                                        dataObject.n = data[8][i];
                                        dataObject.o = data[9][i];
                                        dataObject.d = data[10][i];
                                        dataObject.tldRequests = data[11][i];
                                        dataObject.rdt = data[12][i];
                                        dataObject.price = convertToNumber(data[13][i]);
                                        dataObject.endDate = new Date(data[14][i]);
                                        dataObject.seller = 'NameJet';
                                        
                                        addItemToDB(dataObject);
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


module.exports = scrapper;