var monk = require('monk');
var config = require('../config/config');
var db = monk(config.connection_string);


var checkIn = function (dataPassed) {
  this.data = ({});
  this.data.properties = {};

  this.data.geometry = dataPassed.geometry;
  this.data.properties['name'] = dataPassed.properties['name'];
  this.data.properties['addressStreet'] = dataPassed.properties['addressStreet'];
  this.data.properties['addressCity'] = dataPassed.properties['addressCity'];
  this.data.properties['addressZipCode'] = dataPassed.properties['addressZipCode'];
  this.data.properties['addressState'] = dataPassed.properties['addressState'];
  this.data.properties['closeTime'] = dataPassed.properties['closeTime'];
  this.data.properties['bikesAvailable'] = dataPassed.properties['bikesAvailable'];
  this.data.properties['docksAvailable'] = dataPassed.properties['docksAvailable'];
  this.data.properties['kioskPublicStatus'] = dataPassed.properties['kioskPublicStatus'];
  this.data.properties['kioskId'] = dataPassed.properties['kioskId'];
  this.data.properties['openTime'] = dataPassed.properties['openTime'];
  this.data.properties['publicText'] = dataPassed.properties['publicText'];
  this.data.properties['timeZone'] = dataPassed.properties['timeZone'];
  this.data.properties['timeStamp'] = dataPassed.properties['timeStamp'];
  this.data.properties['totalDocks'] = dataPassed.properties['totalDocks'];
}

checkIn.prototype.setGeometry = function(geometry) {
  this.data.geometry = geometry;
}

checkIn.prototype.setAddressStreet = function(item) {
  this.data.properties.addressStreet = item;
}

checkIn.prototype.setAddressCity = function(item) {
  this.data.properties.properties.addressCity = item;
}

checkIn.prototype.setAddressState = function(item) {
  this.data.properties.addressState = item;
}

checkIn.prototype.setAddressZipCode = function(item) {
  this.data.properties.addressAddressZipCode = item;
}

checkIn.prototype.setBikesAvailable = function(item) {
  this.data.properties.bikesAvailable = item;
}

checkIn.prototype.setCloseTime = function(item) {
  this.data.properties.closeTime = item;
}

checkIn.prototype.setDocksAvailble = function(item) {
  this.data.properties.docksAvailable = item;
}

checkIn.prototype.setKioskId = function(item) {
  this.data.properties.kioskId = item;
}

checkIn.prototype.setKioskPublicStatus = function(item) {
  this.data.properties.kioskPublicStatus = item;
}

checkIn.prototype.setName = function(item) {
  this.data.properties.name = item;
}

checkIn.prototype.setTimeStamp = function(item) {
  this.data.properties.timeStamp = item;
}

checkIn.prototype.setTotalDocks = function(item) {
  this.data.properties.totalDocks = item;
}

checkIn.prototype.getData = function(arguments) {
  return this.data;
}

checkIn.prototype.insert = function(data) {
    var collection = db.get('features');
    collection.insert(data, function(err, doc){
      if (err) {
        console.info("Error occured during inserting the data : " + err);
      }
    });
}

module.exports = checkIn;
