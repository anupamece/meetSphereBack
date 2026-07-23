

import mongoose from "mongoose";
import {User} from "./user.model.js";

const bookingSchema = new mongoose.Schema({
    user :{
        type:mongoose.Schema.ObjectId,
        ref:User,
        required:true
    },

    itemType :{
        type :String,
        enum : ['Event','Movie','Dining'],
        required:true
    },
    itemId:{
        type:mongoose.Schema.ObjectId,
        required:true,
        refPath:'itemType'
    },
    quantity:{
        type:Number,
        required:true,
        min:1,
        default:1
    },
    totalAmount:{
        type:Number,
        required:true
    },
    paymentStatus : {
        type:String,
        enum : ['pending','completed','failed'],
        default:'pending'
    },
    paymentMethod : {
        type:String,
        enum : ['card','paypal','upi'],
        required:true
    },
    paymentId:{
        type:String
    },

    bookingStatus:{
        type:String,
        enum : ['confirmed','cancelled','pending'],
        default:'pending'
    },
    bookingCode:{
        type:String,
        unique:true 
    },
    attendeeName:{
        type:String,
        required:true
    },
    attendeeEmail:{
        type:String,
        required:true
    },

    cancelledAt:{type : Date},


},
{timestamps:true})

const Booking =mongoose.model('Booking',bookingSchema);

export default Booking;