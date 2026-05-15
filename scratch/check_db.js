
const mongoose = require('mongoose');

const MONGO_URI = "mongodb+srv://manassankhla991_db_user:o2hV8HLujzChOtpN@cluster0.hwmaa92.mongodb.net/?appName=Cluster0";

async function checkData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to DB");

    const Booking = mongoose.models.Booking || mongoose.model('Booking', new mongoose.Schema({}, { strict: false }));
    const count = await Booking.countDocuments();
    console.log("Total Bookings:", count);

    if (count > 0) {
      const oneBooking = await Booking.findOne();
      console.log("Sample Booking:", JSON.stringify(oneBooking, null, 2));
      
      const distinctUsers = await Booking.distinct('user');
      console.log("Distinct Users (Hotel IDs):", distinctUsers);
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error("Error:", err);
  }
}

checkData();
