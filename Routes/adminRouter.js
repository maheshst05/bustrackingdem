const express = require("express");
const AdminRouter = express.Router();
const User = require("../Model/userModel");
const Bus = require("../Model/busModel");
const Route = require("../Model/routeModel");
const BusRoute = require("../Model/busRoute");
const Country = require("../Model/countryModel");
const City = require("../Model/CityModel");


//drivers
AdminRouter.get("/api/get/drivers/", async (req, res) => {
  try {
    // const { isvisible } = req.params;
    const  isvisible  = req.query.isvisible;
    const search = req.query.search;

    const filter = {
      profileType: "Driver",
    };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { "address.country.countryName": { $regex: search, $options: "i" } },
        { "address.city": { $regex: search, $options: "i" } },
      ];
    }

    let managers;

    if (isvisible === "true") {
      managers = await User.find(filter)
        .select("name id licenceNo dob phoneNo email address")
        .lean();
    } else {
      const isAssignedDriverIds = await BusRoute.distinct(
        "driver_details._id"
      );

      filter._id = { $nin: isAssignedDriverIds };

      managers = await User.find(filter)
        .select("name id licenceNo dob phoneNo email address")
        .lean();
    }

    return res.status(200).json({ managers });
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
  try {
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
//delete bus
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
AdminRouter.get("/api/get/buses/", async (req, res) => {
  const  isvisible  = req.query.isvisible;
  const search = req.query.search;
  try {
    let filter = {};
    if (search) {
      filter = {
        $or: [
          { busNo: { $regex: search, $options: "i" } },
          { "address.country.countryName": { $regex: search, $options: "i" } },
          { "address.city": { $regex: search, $options: "i" } },
        ],
      };
    }

    let Buses;

    if (isvisible === "true") {
      Buses = await Bus.find(filter);
    } else {
      const assignedBuses = await BusRoute.find().select("bus_details._id");
      const ids = assignedBuses.map((item) => item.bus_details._id);
      Buses = await Bus.find({ _id: { $nin: ids }, ...filter });
    }

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
    const search  =req.query.search
    const filter = {
    };

    if (search) {
      filter.$or = [
        { routeNo: { $regex: search, $options: "i" } },
        { route: { $regex: search, $options: "i" } },
        { "address.country.countryName": { $regex: search, $options: "i" } },
        { "address.city": { $regex: search, $options: "i" } },
      ];
      const routes = await Route.find(filter);
      return res.status(200).json({ routes });
    }
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



AdminRouter.get("/api/search/source/destination/:token?", async (req, res) => {
  const { sourceRoute, destinationRoute } = req.query;

  if (!sourceRoute || !destinationRoute) {
    return res
      .status(400)
      .json({ msg: "Both sourceRoute and destinationRoute are required" });
  }

  try {
    const commonProjection = {
      _id: 1,
      "bus_details.busName": 1,
      "bus_details.busNo": 1,
      "driver_details.name": 1,
      "route_details.routeNo": 1,
      "route_details.route": 1,
      "route_details.sourceRoute": 1,
      "route_details.destinationRoute": 1,
      "route_details.stops": 1,
      "route_details.polyline": 1,
      time: 1,
      status: 1,
      currentRouteLocation: 1,
    };

    const sourceQuery = {
      "route_details.polyline.name": { $regex: sourceRoute, $options: "i" },
    };

    const destinationQuery = {
      "route_details.polyline.name": {
        $regex: destinationRoute,
        $options: "i",
      },
    };

    const source = await BusRoute.find(sourceQuery).select(commonProjection);
    const destination = await BusRoute.find(destinationQuery).select(
      commonProjection
    );

    const response = {};

    if (source.length > 0 && destination.length > 0) {
      const mergedRoutes = source.concat(destination);
      const uniqueRoutes = Array.from(
        new Set(mergedRoutes.map((route) => route.bus_details.busNo))
      ).map((busNo) =>
        mergedRoutes.find((route) => route.bus_details.busNo === busNo)
      );

      response.message = "Successfully found";
      response.routes = uniqueRoutes;
    } else if (source.length > 0 && destination.length === 0) {
      response.message =
        "Destination does not match with your destination input";
      response.routes = source;
    } else if (source.length === 0 && destination.length > 0) {
      response.message = "Source does not match with your source input";
      response.routes = destination;
    } else {
      response.message = "No result found";
      response.routes = [];
    }

    if (response.routes.length > 0) {
      res.send(response);
    } else {
      res.status(404).json({ msg: "No results found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

//manager
//delete manager

//get all and search Manager
AdminRouter.get("/api/get/manager/:token", async (req, res) => {
  try {
    const { search } = req.query;
    let query = { profileType: "Manager" };

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const managers = await User.find(query).select(
      "name id licenceNo dob phoneNo email"
    );

    if (managers.length === 0) {
      return res.status(404).json({ error: "No results found" });
    }

    return res.status(200).json({ manager: managers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

//update manager
AdminRouter.put("/api/update/manager/:token/:id", async (req, res) => {
  const id = req.params.id;
  try {
    if (req.body.password) {
      // Hash the new password
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    // Update the user document
    const manager = await User.findByIdAndUpdate(
      { _id: id },
      req.body,
      { new: true } // This option returns the updated document
    );

    if (!manager) {
      return res.status(404).json({ message: "Manager not found" });
    }

    return res.status(200).json({ message: "Manager Updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});
//delete manager
AdminRouter.delete("/api/delete/manager/:token/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deletemanger = await User.findByIdAndDelete(id);
    if (!deletemanger) {
      return res.status(404).json({
        error: "Manager not found.",
      });
    }

    return res.status(200).json({ message: "Manager Deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

//user
//get all users
AdminRouter.get("/api/get/User/:token", async (req, res) => {
  try {
    const { search } = req.query;
    let query = { profileType: "User" };

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const Users = await User.find(query).select(
      "name id licenceNo dob phoneNo email"
    );

    return res.status(200).json({ Users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

//delete user
AdminRouter.delete("/api/delete/user/:token/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const delteuser = await User.findByIdAndDelete(id);
    if (!delteuser) {
      return res.status(404).json({
        error: "user not found.",
      });
    }

    return res.status(200).json({ message: "User Deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

//country
//get countryes
AdminRouter.get("/api/get/country/", async (req, res) => {
  try {
    const countryes = await Country.find();
    return res.status(200).json(countryes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

//post countryes
AdminRouter.post("/api/post/country/", async (req, res) => {
  try {
    const { countryName } = req.body;

    const existingCountry = await Country.findOne({ countryName });

    if (existingCountry) {
      return res.status(400).json({ msg: "Country already exists" });
    }

    const newCountry = new Country(req.body);
    await newCountry.save();

    return res.status(200).json({ msg: "New country added successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

//update country
AdminRouter.put("/api/update/country/:id", async (req, res) => {
  try {
    const country = await Country.findByIdAndUpdate(req.params.id, req.body);
    return res.status(200).json({ msg: "Country updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});
//delete country
AdminRouter.delete("/api/delete/country/:id", async (req, res) => {
  try {
    const countryId = req.params.id;
    const deletedCountry = await Country.findByIdAndRemove(countryId);

    if (!deletedCountry) {
      return res.status(404).json({ msg: "Country not found" });
    }

    return res.status(200).json({ msg: "Country deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

//citywith country

//get city with country
AdminRouter.get("/api/get/city/:country?", async (req, res) => {
  try {
    const country = req.params.country;
    if(country){
     const cityes = await City.find({
      "country.countryName":country ,
    });

    if (cityes.length === 0) {
      return res.status(404).json({ msg: "NO city Found in this Country" });
    }

    return res.status(200).json(cityes);
  }
  else{
    const cityes = await City.find();

    if (cityes.length === 0) {
      return res.status(404).json({ msg: "City not found" });
    }

    return res.status(200).json(cityes);
  }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});


//post city with country

AdminRouter.post("/api/post/city", async (req, res) => {
  try {
    const citys= new City(req.body);
    await citys.save();
    return res.status(200).json({ msg: "New city added successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

//update city with country
AdminRouter.put("/api/update/city/:id", async (req, res) => {
  try {
  const city = await City.findByIdAndUpdate(req.params.id, req.body)
  return res.status(200).json({ msg: "City updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
})

//delete city with country
AdminRouter.delete("/api/delete/city/:id", async (req, res) => {
  try {
    const countryId = req.params.id;
    const deletedCountry = await City.findByIdAndRemove(countryId);

    if (!deletedCountry) {
      return res.status(404).json({ msg: "City not found" });
    }

    return res.status(200).json({ msg: "City deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = AdminRouter;
