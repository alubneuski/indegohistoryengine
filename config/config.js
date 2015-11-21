var config = {};

config.intervalTime = 120000;
config.indegoRESTUrl = "https://api.phila.gov/bike-share-stations/v1";
//config.connection_string = 'admin:HpnMp5mHMNlA@127.0.0.1:27017/indegohistoryengine';
config.connection_string = '127.0.0.1:27017/nodetest1';
// if OPENSHIFT env variables are present, use the available connection info:
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  config.connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}
module.exports = config;
