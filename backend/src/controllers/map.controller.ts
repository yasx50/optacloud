import User from '../models/user.model';
import { Request, Response, NextFunction } from 'express';

const currentLocation  = async(req:Request,res:Response,next:NextFunction)=>{
    const { latitude, longitude } = req.body;
    try {
        const {lat,lon} = req.body;
       res.json({lat,lon})
        
    } catch (error) {
        
    }



}
export {
    currentLocation
}
