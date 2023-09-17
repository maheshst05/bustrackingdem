// const mongoose = require('mongoose');

// const busSchema = new mongoose.Schema({
//   busName: String,
//   driverName:String,
//   driverId: String,
//   route: String,
//   time: String,
//   sourceRoute: {
//     latitude: Number,
//     longitude: Number,
//     latitudeDelta: Number,
//     longitudeDelta: Number,
//   },
//   destinationRoute: {
//     latitude: Number,
//     longitude: Number,
//     latitudeDelta: Number,
//     longitudeDelta: Number,
//   },
//   currentRouteLocation:{
    
//       latitude: Number,
//       longitude: Number,
//       latitudeDelta: Number,
//       longitudeDelta: Number,
    
//   },
//   stops:[{
//     latitude: Number,
//       longitude: Number
//   }],

//   status: String,
//   heading:Number,
//   polyline: [{
//     latitude: Number,
//     longitude: Number
//   }]
// }, { timestamps: true });

// const Bus = mongoose.model('Bus', busSchema);





const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busName:String,
	busNo:String
})
const Bus = mongoose.model('Bus', busSchema);
module.exports = Bus;


// {
//   "_id": {
//     "$oid": "64f062764b52cdbb4a91b62f"
//   },
//   "busName": "Bus 123",
//   "driverId": "64f063e5c83f8af2a1456b84",
//   "route": "ShivajiNagar to Nigadi",
//   "time": "08:00 AM to 11:00 AM",
//   "sourceRoute": {
//     "latitude": 18.5314,
//     "longitude": 73.8446,
//     "latitudeDelta": 0.05,
//     "longitudeDelta": 0.05
//   },
//   "destinationRoute": {
//     "latitude": 18.6492,
//     "longitude": 73.7707,
//     "latitudeDelta": 0.05,
//     "longitudeDelta": 0.05
//   },
//   "status": "STOP",
//   "createdAt": {
//     "$date": "2023-08-31T09:50:46.337Z"
//   },
//   "updatedAt": {
//     "$date": "2023-09-11T10:00:27.254Z"
//   },
//   "__v": 0,
//   "currentRouteLocation": {
//     "latitude": 18.5898119,
//     "longitude": 73.9544325,
//     "latitudeDelta": 0.04,
//     "longitudeDelta": 0.02063037249283668
//   },
//   "driverName": "Mahesh Thombare",
//   "stops": [
//     {
//       "latitude": 18.544112,
//       "longitude": 73.826977,
//       "_id": {
//         "$oid": "64fb1c81c3d0b19e4d0fc942"
//       }
//     },
//     {
//       "latitude": 18.583167,
//       "longitude": 73.795906,
//       "_id": {
//         "$oid": "64fb1c81c3d0b19e4d0fc943"
//       }
//     },
//     {
//       "latitude": 18.603179,
//       "longitude": 73.777023,
//       "_id": {
//         "$oid": "64fb1c81c3d0b19e4d0fc944"
//       }
//     }
//   ],
//   "heading": -4
// }