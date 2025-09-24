import envVars from "../Config/env-vars.js";

export const generateFilename = (req, file, cb) => {
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  cb(null, uniqueSuffix + "." + file.originalname.split(".").pop());
};

export const addPlatformFeeToFare = (amount) => {
  return amount * 1.1;
};

export const calculateRideCost = (distance, vehicleBaseFare) => {
  const intDistance = parseInt(distance);
  const intVehicleBaseFare = parseInt(vehicleBaseFare);
  const baseFare = intVehicleBaseFare ?? envVars.base_fare;
  if (intDistance <= envVars.default_miles)
    return baseFare * envVars.platform_commission;
  const extraMilesFare =
    (intDistance - envVars.default_miles) * envVars.per_mileage_rate;
  let estFare = (baseFare + extraMilesFare) * envVars.platform_commission;
  return estFare;
};
