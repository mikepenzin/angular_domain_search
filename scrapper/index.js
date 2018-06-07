var cronJob = {};

var scrapper = require('./scrapper');
   
cronJob.cronjob = function(){
    
    scrapper.dbFullCleanup();

    setTimeout(function(){ 
      scrapper.godaddy();
    }, 1 * 60 * 1000);    
    
    setTimeout(function(){ 
      scrapper.dynadot();
    }, 2 * 60 * 1000); 
    
    setTimeout(function(){ 
      scrapper.namecom();
    }, 3 * 60 * 1000); 
    
    setTimeout(function(){ 
      scrapper.namejet();
    }, 4 * 60 * 1000); 
    
    setTimeout(function(){ 
      scrapper.dbCleanup();
    }, 5 * 60 * 1000); 
};

module.exports = cronJob;