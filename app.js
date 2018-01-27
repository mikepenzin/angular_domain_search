var express             = require('express'),
    dotenv              = require('dotenv'),
    mongoose            = require('mongoose'),
    schedule            = require('node-schedule'),
    cronJobs            = require('./schedule/index'),
    ScrapDB             = require('./models/scrapDB'),
    path                = require("path"),
    app                 = express();

// Load environment variables from .env file
dotenv.load();

// Configure public folder for static files
app.use(express.static(__dirname + "/public"));

mongoose.Promise = global.Promise;
var DB_URL = process.env.DB_URL;
mongoose.connect(DB_URL);

// ############################################################ //
// ###########  Add / Remove Data Using cron jobs  ############ //
// ############################################################ //

    schedule.scheduleJob({hour: 14, minute: 30}, function(){
        cronJobs.dbCleanup();
    });
    schedule.scheduleJob({hour: 14, minute: 31}, function(){
        cronJobs.godaddy();
    });
    schedule.scheduleJob({hour: 14, minute: 32}, function(){
        cronJobs.dynadot();
    });
    schedule.scheduleJob({hour: 14, minute: 33}, function(){
        cronJobs.namecom();
    });
    
    schedule.scheduleJob({hour: 14, minute: 34}, function(){
        cronJobs.namejet();
    });


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get("/", function(req, res){
    res.sendFile(path.join(__dirname+'/views/index.html'));
});


app.get("/q", function(req, res){

    console.log(req.query);
    var objectJSON = { next: true };
    var page = req.query.page;
    var options = { limit: 50 };
    var maxPage = 0;
    
    var filedToShow = ['domain', 'bl', 'dp', 'aby', 'acr', 'similarWeb', 'stc', 'dmoz', 'c', 'n', 'o', 'd', 'tldRequests', 'rdt', 'traffic', 'valuation', 'price', 'bids', 'endDate'];
    
    ScrapDB.count({}, function(err, c) {
        if (err){ console.log(err); }
        maxPage = Math.ceil(c / options.limit);
    });
    
    if(page > 1) {
        options.skip = Number((page - 1)) * options.limit;
    }
    
    if(req.query.search != null && req.query.search != 'null' && req.query.search.length != 0) {
        
        var regEx = new RegExp('/.*'+ req.query.search +'*/');

        ScrapDB.find({domain:{'$regex' : req.query.search, '$options' : 'i'}}, filedToShow ,options, function(err, foundDomains){
            
            console.log(foundDomains);
            
            if (err){ console.log(err); }
            
            objectJSON.page = page;
            
            ScrapDB.count({$text: {$search: req.query.search}}, function(err, c){
                
                maxPage = Math.ceil(c / options.limit);
                
                if(page <= maxPage){
                    objectJSON.next = true;
                } else {
                    objectJSON.next = false;
                }
                objectJSON.results = foundDomains;
                res.json(objectJSON);
            });
        });
        
    } else {
        ScrapDB.find({}, filedToShow ,options, function(err, foundDomains){
            if (err){ console.log(err); }
            objectJSON.page = page;
            
            if(page <= maxPage){
                objectJSON.next = true;
            } else {
                objectJSON.next = false;
            }
            objectJSON.results = foundDomains;
            res.json(objectJSON);
        });
    }    
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("=========================");
    console.log("Scrap Server has started!");
    console.log("=========================");
});