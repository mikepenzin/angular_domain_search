var mongoose = require('mongoose');
    
var domainDBSchema = new mongoose.Schema({
    domain: String,
    bl: Number,
    dp: Number,
    aby: String,    
    acr: Number,
    similarWeb: Number,
    stc: String,
    dmoz: String,
    c: String,
    n: String,
    o: String,
    d: String,
    tldRequests: String,
    rdt: String,
    traffic: Number,
    valuation: Number,
    price: Number,
    bids: Number,
    endDate: Date,
    seller: String
});

domainDBSchema.index({'$**': 'text'});

module.exports = mongoose.model("DomainDB", domainDBSchema);