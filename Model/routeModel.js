const mongoose = require('mongoose');
const routeSchema = new mongoose.Schema({
  route: String,
  sourceRoute: {
    latitude: Number,
    longitude: Number,
    latitudeDelta: Number,
    longitudeDelta: Number,
  },
  destinationRoute: {
    latitude: Number,
    longitude: Number,
    latitudeDelta: Number,
    longitudeDelta: Number,
  },
});


const Route = mongoose.model('Route', routeSchema);

module.exports = Route;