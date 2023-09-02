const express  = require('express');
const roteRouter = express.Router();
const Route = require('../Model/routeModel')

roteRouter.post("/api/add/route",async(req,res)=>{
    const payload = req.body;
    try {
        const  newRoute = new Route(payload);
        await newRoute.save();
        return res.status(200).json({ "msg": "added successfully", "route": newRoute });
    } catch (error) {
        console.log(error)
    }
})

roteRouter.get("/api/get/route",async(req,res)=>{
    try {
        const routes = await Route.find()
        return res.status(200).json({"routes": routes });
    } catch (error) {
        
    }
})

module.exports = roteRouter;