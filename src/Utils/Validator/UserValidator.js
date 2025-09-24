import joi from "joi";

export const LoginValidator = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
  deviceType: joi.string().optional(),
  deviceToken: joi.string().optional(),
  location: joi.object({
    type: joi.string().required(),
    coordinates: joi.array().required(),
  }),
});

export const VerifyOtpValidator = joi.object({
  otp: joi.string().required(),
  otpType: joi.string().valid("forget-password", "register").required(),
});

export const ForgetPasswordValidator = joi.object({
  email: joi.string().email().required(),
  // userType: joi.string().required(),
});

export const ChangePasswordValidator = joi.object({
  old_password: joi.string().required(),
  new_password: joi.string().required(),
});

export const ResetPasswordValidator = joi.object({
  password: joi.string().required(),
});

export const completeProfileValidator = joi.object({
  full_name: joi.string().required(),
  gender: joi.string().valid("male", "female", null),
  // location: joi.string().allow(null),
  dob: joi.string(),
  phone_number: joi.string().required(),
  address: joi.string().required(),
  country: joi.string().required(),
  state: joi.string().allow(null),
  city: joi.string().allow(null),
});

export const deviceRequired = joi.object({
  deviceToken: joi.string().required(),
  deviceType: joi.string().valid("android", "ios", "postman").required(),
});

export const IdValidator = joi.object({
  id: joi.string().length(24).required(),
});

export const RegisterValidator = joi.object({
  full_name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().required(),
  phone_number: joi.string().optional(),
  userType: joi.string().valid("admin", "user", "partner").required(),
  // location: joi.object({
  //   type: joi.string().required(),
  //   coordinates: joi.array().required(),
  // }),
});

export const CreateEventValidator = joi.object({
  name: joi.string().required().trim(),
  description: joi.string().required().trim(),
  date: joi.string().required().trim(),
  time: joi.string().required().trim(),

  event_type: joi
    .array()
    .items(joi.string().valid("Raffle", "Auction", "Donation").required())
    .required(),

  location: joi.string().required().trim(),
  organizer: joi.string().required().trim(),

  auctionItems: joi.array().items(
    joi.object({
      name: joi.string().required().trim(),
      description: joi.string().required().trim(),
      starting_bid_price: joi.string().required().trim(),
      start_time: joi.string().required().trim(),
      end_time: joi.string().required().trim(),
    })
  ),

  raffleTickets: joi.array().items(
    joi.object({
      name: joi.string().required().trim(),
      description: joi.string().required().trim(),
      ticket_price: joi.string().required().trim(),
      total_tickets: joi.number().required(),
      max_tickets_per_user: joi.number().required(),
      start_time: joi.string().required().trim(),
      end_time: joi.string().required().trim(),
    })
  ),

  donationSettings: joi.object({
    pre_defined_amounts: joi.array().items(joi.number().required()).optional(),
    custom_amount: joi.boolean().default(false),
    allow_virtual_participants: joi.boolean().default(false),
  }),
});
