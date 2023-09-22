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
AdminRouter.put('/api/update/driver/:id',async(req,res)=>{
  const id = req.params.id;
  try {
    const driver = await User.findByIdAndUpdate({_id:id},
      req.body
    )
    return res
      .status(200)
      .json({ message: "Driver Updated successfully"});

  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  
  }
})
//delete driver
AdminRouter.delete('/api/delete/driver/:id',async(req,res)=>{
  const id = req.params.id;
  try {
    const driver = await User.findByIdAndDelete({_id:id})
    return res
      .status(200)
      .json({ message: "Driver deleted successfully"});

  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  
  }
})

//Bus
// Add a new bus
AdminRouter.post("/api/add/bus", async (req, res) => {
  try {
    const newBus = new Bus(req.body);
    await newBus.save();

    return res
      .status(200)
      .json({ message: "Bus added successfully", bus: newBus });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
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
AdminRouter.delete("/api/delete/bus/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deletedBus = await Bus.findByIdAndDelete({ _id: id });
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

//getbus by its name
// AdminRouter.get("/api/get/res", async (req, res) => {
//   const search = req.query.search; 
//   try {
//     const bus = await BusRoute.find({
//       "bus_details.busName": { $regex: `${search}`, $options: "i" },
//     });

//     if (bus.length === 0) {
//       res.status(404).send("Bus not found");
//     } else {
//       res.send(bus);
//     }
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

module.exports = AdminRouter;
