import Booking from "../models/booking.model.js";
import Event from "../models/events.model.js";
import Movie from "../models/movies.model.js";
import Dining from "../models/dining.model.js";

const getModelByType = (itemType) => {
  const models = {
    'Event': Event,
    'Movie': Movie,
    'Dining': Dining,
  };
  return models[itemType] || null;
};


const generateBookingCode =(item)=>{
    const pfMap = {
        'Event':'EVT',
        'Movie':'MOV',
        'Dining':'DIN'
    }
    const pfx=pfMap[item] || "GEN";
    const randomPart=Math.random().toString(36).substring(2,8).toUpperCase();
    return `MS-${pfx}-${randomPart}`;
}
const generatePaymentId = ()=>{
    const randomPart=Math.random().toString(36).substring(2,12).toUpperCase();
    return `PAY-${randomPart}`;
}

const delay =(ms) =>
    new Promise((resolve) => setTimeout(resolve,ms));//to simulate delay


const initiateBooking = async (req,res)=>{
    try{
        const{
            itemType,
            itemId,
            quantity,
            paymentMethod,
            attendeeName,
            attendeeEmail
        }=req.body;

        if (!itemType || !itemId || !quantity || !paymentMethod || !attendeeName || !attendeeEmail) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const model=getModelByType(itemType);
        if(!model){
            return res.status(400).json({message:"Invalid itemType"});
        }
        const item=await model.findById(itemId);
        if(!item){
            return res.status(404).json({message:`${itemType} not found`});
        }



        //availability and price calculation
        let unitPrice=0;
        let availableQuantity=0;

        if(itemType === 'Dining'){
            unitPrice=item.price;
            availableQuantity=Infinity; //assuming unlimited dining slots
        }
        else{
            unitPrice=item.ticketPrice;
            availableQuantity=item.totalTickets-item.ticketsSold;

            if(quantity > availableQuantity){
                return res.status(400).json({
                    message:`Only ${availableQuantity} tickets(s) available for this ${itemType}`,
                    availableTickets :availableQuantity,
                });
            }
        }

        const totalAmount =unitPrice * quantity;

        // /locking the tickets after validating availability
        if(itemType !== 'Dining'){
            await model.findByIdAndUpdate(itemId,{$inc:{ticketsSold:quantity}});
        }

        const bookingCode=generateBookingCode(itemType);

        //now create the booking entry

        const booking = await Booking.create({
            user:req.user._id,
            itemType,
            quantity,
            itemId,
            totalAmount,
            paymentMethod,
            bookingCode,
            paymentStatus:"pending",
            bookingStatus:"pending",
            attendeeName,
            attendeeEmail
        })

        return res.status(200).json({
            message:"Booking initiated successfully",
            booking
        });

    }
    catch(err){
        console.error("booking initiation error:",err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

//step 2 simulating payment

const simulatePayment = async (req,res)=>{
    try{
        const {bookingId,cardNumber} = req.body;

        if(!bookingId){
            return res.status(400).json({message:"bookingId is required"});
        }

        //find the booking model with status pending
        const booking = await Booking.findById(bookingId);
        if(!booking){
            return res.status(404).json({message:"Booking not found"});
        }

        //overshipping check jis user ne booking create kara h wahe user payment karega
        if(booking.user.toString() !== req.user._id.toString()){
            return res.status(403).json({message:"You are not authorized to pay for this booking"});
        }

        if(booking.paymentStatus !== "pending"){
            return res.status(400).json({
                message:`payment already ${booking.paymentStatus} for this booking`
            });
        }

        const delayMs=2000 + Math.random()*1000

        await delay(delayMs);

        //simulate succes or falure of payment
        let isSuccess;
        const lastFour=cardNumber ? cardNumber.slice(-4) : "";

        if(lastFour === "0000"){
            isSuccess=false;
        }
        else if(lastFour==="1111"){
            isSuccess=true;
        }
        else{
            isSuccess = Math.random() < 0.95
            //95% succcess rate
        }

        const paymentId=generatePaymentId();

        if(isSuccess){
            booking.paymentStatus="completed";
            booking.paymentId=paymentId;
            await booking.save();
            return res.status(200).json({
                message:"Payment successful",
                success:true,
                paymentId,
                paymentStatus:"completed"
            });
        }else{
            booking.paymentStatus="failed";
            booking.paymentId=paymentId;
            await booking.save();

            if(booking.itemType !=="Dining"){
                const Model=getModelByType(booking.itemType);
                await Model.findByIdAndUpdate(booking.itemId,{
                    $inc:{ticketsSold : -booking.quantity}
                });
            }

            return res.status(200).json({
                message:"Payment failed!! . Please try again",
                success:false,
                paymentId,
                paymentStatus:"failed",
            })
        }
    }
    catch(err){
        console.error("simulatePayment error",err);
        return res.status(500).json({
            message:"Error processing payment"
        });
    }
};


const confirmBooking = async (req,res)=>{
    try{
        const {bookingId}=req.body;

        if(!bookingId){
            return res.status(400).json({
                message : "bookingId not found"
            });
        }
        const booking = await Booking.findById(bookingId);
        if(!booking){
            return res.status(404).json({
                message:"Booking not found"
            });
        }

        if(booking.user.toString() !== req.user._id.toString()){
            return res.status(403).json({
                message:"You are not authorized to confirm this booking"
            });
        }


        if(booking.bookingStatus === "confirmed"){
            return res.status(400).json({
                message:"This booking is already confirmed"
            });
        }

        
        //if payment not completed then cannot confirm booking
        if(booking.paymentStatus !== "completed"){
            return res.status(400).json({
                message:"Payment is not completed for this booking"
            });
        }

        booking.bookingStatus="confirmed";
        await booking.save();

        const Model=getModelByType(booking.itemType);
        const item=await Model.findById(booking.itemId);

        return res.status(200).json({
            message:"Booking confirmed Successfully!!",
            booking,
            item,
        });
    }
    catch(err){
        console.error("confirmBooking error",err);
        return res.status(500).json({
            message:"Error confirming booking"
        });
    }
}

const getMyBookings =async(req,res)=>{
    try{
        const user=req.user._id;
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        const bookings= await Booking.find({user,bookingStatus:"confirmed"}).populate('itemId').sort({createdAt:-1});
        return res.status(200).json({
            message:"Bookings fetched successfully",
            bookings
        });
    }
    catch(err){
        console.error("getMyBookings error",err);
        return res.status(500).json({
            message:"Error fetching bookings"
        });
    }
}

const getBookingById= async (req,res)=>{
    try{
        const booking=await Booking.findById(req.params.id);

        if(!booking){
            return res.status(404).json({message:"Booking not found"});
        }
        if(booking.user.toString() !== req.user._id.toString()){
            return res.status(403).json({message:"You are not authorized to view this booking"});
        }

        const Model=getModelByType(booking.itemType);
        const item= Model ? await Model.findById(booking.itemId):null;
        return res.status(200).json({
            message:"Booking fetched successfully",
            booking,
            itemDetails:item,
        });
    }
    catch(err){
        console.error("getBookingById error",err);
        return res.status(500).json({
            message:"Error fetching booking"
        });
    }
}

const getEventAttendees = async (req,res)=>{
    try{
        const {itemId}=req.params;
        const {type}=req.query;

        if(!itemId || !type){
            return res.status(400).json({message:"itemId and type are required"});
        }
        const normalizedType = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
        const Model=getModelByType(normalizedType);
        const item= await Model.findById(itemId);
        if(!item){
            return res.status(404).json({message:`${type} not found`});
        }

        if(item.organizer.toString() !== req.user._id.toString()){
            return res.status(403).json({message:"You are not authorized to view attendees for this item"});
        }

        const bookings= await Booking.find({itemType:normalizedType,itemId,bookingStatus:"confirmed"}).sort({createdAt:-1});

        const totalTicketsSold= bookings.reduce((sum,b)=>sum+b.quantity,0);
        const totalRevenue= bookings.reduce((sum,b)=>sum+b.totalAmount,0);

        return res.status(200).json({
            message:"Attendees fetched successfully",
            totalBookings:bookings.length,
            bookings,
            totalTicketsSold,
            totalRevenue
        });
    }catch(err){
        console.error("getEventAttendees error",err);
        return res.status(500).json({
            message:"Error fetching attendees"
        });
    }
}

const cancelBooking = async (req,res)=>{
    try{
        const booking=await Booking.findById(req.params.id);
        if(!booking){
            return res.status(404).json({message:"Booking not found"});
        }
        if(booking.user.toString() !== req.user._id.toString()){
            return res.status(403).json({message:"You are not authorized to cancel this booking"});
        }

        if(booking.bookingStatus === "cancelled"){
            return res.status(400).json({message:"This booking is already cancelled"});
        }

        //release ticket back
        if(booking.itemType !== "Dining"){
            const Model=getModelByType(booking.itemType);
            await Model.findByIdAndUpdate(booking.itemId,{
                $inc:{ticketsSold:-booking.quantity}
            });
        }

        booking.bookingStatus="cancelled";
        booking.cancelledAt=new Date();
        await booking.save();

        return res.status(200).json({
            message:"Booking cancelled successfully",
            booking
        });
    } catch(err){
        console.error("cancelBooking error",err);
        return res.status(500).json({
            message:"Error canceling booking"
        });
    }
}
const getOrganizerStats=async (req,res)=>{

}

export {initiateBooking,
    simulatePayment,
    confirmBooking,getMyBookings,
    getBookingById,getEventAttendees,
    getOrganizerStats,
    cancelBooking};
