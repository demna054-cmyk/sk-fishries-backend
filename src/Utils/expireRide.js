import RideModel from "../DB/Model/rideModel.js";

export const expireRide = async () => {
  try {
    const rides = await RideModel.find({
      status: "accepted",
      mode: "pre",
    });
    console.log("================", rides);
    if (rides.length > 0) {
      rides.map(async (e) => {
        const pre_date = e.pre_date; // Your predefined date
        const pre_time = e.pre_time; // Your predefined time

        // Combine the date and time into a single string
        const dateTimeString = `${pre_date}T${pre_time}`;

        // Convert the combined date and time string into a Date object
        const preDateTime = new Date(dateTimeString);

        // Add 1 hour to the preDateTime
        // const oneHourLater = new Date(preDateTime.getTime() + 1 * 60 * 60 * 1000);
        const oneHourLater = new Date(preDateTime.getTime() + 5 * 60 * 1000);
        // Get the current date and time
        const now = new Date();

        // Check if the current date is the same as the predefined date
        const isToday = now.toISOString().slice(0, 10) === pre_date;

        // Check if the current time is greater than oneHourLater
        const isTimePast = now > oneHourLater;

        if (isToday && isTimePast) {
          await RideModel.findByIdAndUpdate(e._id, {
            status: "rejected",
            reasonOfCancel: "Driver Not Arrived",
          });
          console.log(
            "The current time is greater than pre_time + 1 hour on the same day.",
          );
        }
      });
    }
    return;
  } catch (error) {
    console.log("Ride Expiry Went Wrong", error.message);
  }
};
