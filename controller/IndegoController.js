var checkInModel = require('../model/checkIn');

var indegoController = function(data) {
  var self = this;
  var checkInModel  = new checkIn({});

  self.setCheckInModel = function (data) {
      checkInModel.setName(data.properties['name']);
      checkInModel.setGeometry(data.geometry);
      checkInModel.setAddressStreet(data.properties['addressStreet']);
      checkInModel.setAddressCity(data.properties['addressCity']);
      checkInModel.setAddressState(data.properties['addressState']);
      checkInMOdel.setAddressZipCode(data.properties['addressZipCode']);
      checkInModel.setBikesAvailable(data.properties['bikesAvailable']);
      checkInModel.setCloseTime(data.properties['closeTime']);
      checkInModel.setDocksAvailble(data.properties['docksAvailable']);
      checkInModel.setKioskId(data.properties['kioskId']);
      checkInModel.setKioskPublicStatus(data.properties['kioskPublicStatus']);
      checkInModel.setTimeStamp(data.properties['timeStamp']);
      checkInModel.setTotalDocks(data.properties['totalDocks']);
    }

  self.getCheckInObject = function () {
    return checkInModel;
  }
}

module.exports = indegoController;
