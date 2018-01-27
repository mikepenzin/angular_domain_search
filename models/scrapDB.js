var mongoose = require('mongoose');
    
var scrapDBSchema = new mongoose.Schema({
    domain: String,
    bl: String,
    dp: String,
    aby: String,    
    acr: String,
    similarWeb: String,
    stc: String,
    dmoz: String,
    c: String,
    n: String,
    o: String,
    d: String,
    tldRequests: String,
    rdt: String,
    traffic: String,
    valuation: String,
    price: String,
    bids: String,
    endDate: String,
    seller: String
});

scrapDBSchema.index({'$**': 'text'});

module.exports = mongoose.model("ScrapDB", scrapDBSchema);