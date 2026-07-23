import mongoose from 'mongoose'

const diningSchema = new mongoose.Schema({
  organizer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image:{
    type: String,
    required: true
  }

},
{timestamps: true});

const Dining = mongoose.model('Dining', diningSchema)

export default Dining