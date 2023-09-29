const express = require("express");
const AdminRouter = express.Router();
const User = require("../Model/userModel");
const Bus = require("../Model/busModel");
const Route = require("../Model/routeModel");
const BusRoute = require("../Model/busRoute");

//drivers

// Get all drivers
AdminRouter.get("/api/get/drivers", async (req, res) => {
  try {
    const drivers = await User.find({ profileType: "Driver" }).select(
      "name id licenceNo dob phoneNo email"
    );

    return res.status(200).json({ drivers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

//update driver
const bcrypt = require("bcrypt");

AdminRouter.put("/api/update/driver/:id", async (req, res) => {
  const id = req.params.id;
  try {
    // Check if the request body contains a password field
    if (req.body.password) {
      // Hash the new password
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    // Update the user document
    const driver = await User.findByIdAndUpdate(
      { _id: id },
      req.body,
      { new: true } // This option returns the updated document
    );

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    return res.status(200).json({ message: "Driver Updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

//delete driver
AdminRouter.delete("/api/delete/driver/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const isAssigned = await BusRoute.exists({ "driver_details._id": id });

    if (isAssigned) {
      return res.status(400).json({
        error:
          "You cannot delete this Driver because it is currently assigned to a bus with a route.",
      });
    }
    const driver = await User.findByIdAndDelete({ _id: id });
    return res.status(200).json({ message: "Driver deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

//Bus
// Add a new bus
AdminRouter.post("/api/add/bus", async (req, res) => {
  const { busName } = req.body;
  try {
    const busNameCheck = await Bus.findOne({ busName });
    if (busNameCheck) {
      return res
        .status(400)
        .json({ msg: "Route is already Presemt", status: false });
    }

    const newBus = new Bus(req.body);
    await newBus.save();

    return res
      .status(200)
      .json({ message: "Bus added successfully", bus: newBus });
  } catch (error) {
    console.error(error);
    //return res.status(400).json( "Route is already Presemt" );
  }
});


//update bus by id
AdminRouter.put("/api/update/bus/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const updatedBus = await Bus.findByIdAndUpdate({ _id: id }, req.body);
    return res
      .status(200)
      .json({ message: "Bus Updated successfully", bus: updatedBus });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});
//delete bus by id
// AdminRouter.delete("/api/delete/bus/:id", async (req, res) => {
//   const id = req.params.id;
//   try {
//     const deletedBus = await Bus.findByIdAndDelete({ _id: id });
//     return res.status(200).json({ message: "Bus Deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ msg: "Internal server error" });
//   }
// });

AdminRouter.delete("/api/delete/bus/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const isAssigned = await BusRoute.exists({ "bus_details._id": id });

    if (isAssigned) {
      return res.status(400).json({
        error:
          "You cannot delete this bus because it is currently assigned to a bus with a route.",
      });
    }

    const deletedBus = await Bus.findByIdAndDelete(id);

    if (!deletedBus) {
      return res.status(404).json({
        error: "Bus not found.",
      });
    }

    return res.status(200).json({ message: "Bus Deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

//get buses
AdminRouter.get("/api/get/buses", async (req, res) => {
  try {
    const Buses = await Bus.find();

    return res.status(200).json({ Buses });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

//Route

//add routes
AdminRouter.post("/api/add/route", async (req, res) => {
  try {
    const newRoute = new Route(req.body);
    await newRoute.save();

    return res
      .status(200)
      .json({ message: "New Route added successfully", Route: newRoute });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});
//update route
AdminRouter.put("/api/update/route/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const updatedRoute = await Route.findByIdAndUpdate({ _id: id }, req.body);
    return res.status(200).json({ message: "Route Updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

//delete route
AdminRouter.delete("/api/delete/route/:id", async (req, res) => {
  const id = req.params.id;
  try {
    // const isAssigned = await BusRoute.exists({ "route_details._id": id });

    // if (isAssigned) {
    //   return res.status(400).json({
    //     error: "You cannot delete this route because it is currently assigned to a bus with a route.",
    //   });
    // }
    const deletedRoute = await Route.findByIdAndDelete({ _id: id });
    return res.status(200).json({ message: " Route Deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});
//get routes
AdminRouter.get("/api/get/routes", async (req, res) => {
  try {
    const routes = await Route.find();
    return res.status(200).json({ routes });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

//busRoute
//post busRoutes
AdminRouter.post("/api/post/busroute", async (req, res) => {
  try {
    const newBusRoute = new BusRoute(req.body);
    await newBusRoute.save();

    return res
      .status(200)
      .json({ message: "post successfully", BusRoute: newBusRoute });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

// update BusRoutes
AdminRouter.put("/api/update/busroute/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const updatedBusRoute = await BusRoute.findByIdAndUpdate(
      { _id: id },
      req.body
    );
    return res.status(200).json({ message: "Route Updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

//delete  BusRoutes
AdminRouter.delete("/api/delete/busroute/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deletedBusRoute = await BusRoute.findByIdAndDelete({ _id: id });
    return res.status(200).json({ message: " Route Deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

AdminRouter.get("/api/get/busroute", async (req, res) => {
  try {
    const BusRoutes = await BusRoute.find();
    return res.status(200).json({ BusRoutes });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});












//search source and destination

AdminRouter.get("/api/search/source/destination/:token?", async (req, res) => {
  const { sourceRoute, destinationRoute } = req.query;
  try {
    // Assuming BusRoute is a Mongoose model
    const source = await BusRoute.find({
      "route_details.polyline.name": { $regex: sourceRoute, $options: "i" }
    });
const desrination = await BusRoute.find({
  "route_details.polyline.name": { $regex: sourceRoute, $options: "i" }
});
    res.send({"sourseRoute":source,"destination":desrination});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});



module.exports = AdminRouter;
