import fetch from "node-fetch";
import { config } from "dotenv";
import { OAuth2Client } from "google-auth-library";
import { saveNetworkImage } from "./saveNetworkImage.js";

config();
export const accessTokenValidator = async (
  accessToken,
  socialType,
  deviceType,
) => {
  console.log("deviceType");
  console.log(deviceType);
  var GOOGLE_CLIENT_ID =
    "127969445720-lofpvvtit173agi3t93o4mocgcftp0cn.apps.googleusercontent.com";
  if (deviceType == "android") {
    // console.log('devce is andriod');
    GOOGLE_CLIENT_ID =
      "127969445720-efdauc7peoif1gl15el1dm11pgohhfk0.apps.googleusercontent.com"; //andriod keys
  }
  // else{
  //   // ios keys
  //   const GOOGLE_CLIENT_ID ="127969445720-lofpvvtit173agi3t93o4mocgcftp0cn.apps.googleusercontent.com";
  // }

  //
  const APPLE_CLIENT_ID = "5ce4ec2c-6a3c-48ad-9998-1f95b5913d54";
  const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET } = process.env;
  // console.log("GOOGLE_CLIENT_ID",GOOGLE_CLIENT_ID)
  let name, email, dateOfBirth, profilePic, gender, imageUrl;
  switch (socialType) {
    case "facebook": {
      if (!FACEBOOK_APP_ID || !FACEBOOK_APP_SECRET) {
        return {
          hasError: true,
          message: "Facebook app id or secret is not provided",
        };
      }
      const { data } = await fetch(
        `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${FACEBOOK_APP_ID}|${FACEBOOK_APP_SECRET}`,
      ).then((r) => r.json());

      if (!data.is_valid && data.error) {
        return {
          hasError: true,
          message: data.error.message,
        };
      }
      const { user_id } = data;
      const getUserData = await fetch(
        `https://graph.facebook.com/${user_id}?fields=id,name,email,picture,age_range,gender,birthday&access_token=${FACEBOOK_APP_ID}|${FACEBOOK_APP_SECRET}`,
      ).then((r) => {
        return r.json();
      });
      name = getUserData.name;
      imageUrl = getUserData.picture.data.url;

      gender = getUserData.gender;
      email = user_id;
      dateOfBirth = getUserData.birthday;

      break;
    }
    case "google": {
      if (!GOOGLE_CLIENT_ID) {
        return {
          hasError: true,
          message: "Google client id is not provided",
        };
      }

      const client = new OAuth2Client(GOOGLE_CLIENT_ID);
      const googleResponse = await client.verifyIdToken({
        idToken: accessToken,
        audience: GOOGLE_CLIENT_ID,
      });
      const data = googleResponse.getPayload();

      if (!data.aud && data.error) {
        return {
          hasError: true,
          message: data.error.message,
        };
      }
      name = data.name;
      imageUrl = data.picture;
      email = data.sub;
      break;
    }
    case "apple": {
      if (!APPLE_CLIENT_ID) {
        return {
          hasError: true,
          message: "Apple client id is not provided",
        };
      }

      const appleJwt = accessToken;

      // Extract only the payload from the JWT token received from Apple
      const payloadBase64 = appleJwt.split(".")[1];

      try {
        // Decode the payload from base64
        const decodedData = JSON.parse(
          Buffer.from(payloadBase64, "base64").toString("utf-8"),
        );

        // Extract relevant data from the decoded payload
        const { email } = decodedData;

        // Check if the user data exists
        if (!email) {
          return {
            hasError: true,
            message: "Incomplete user data received from Apple",
          };
        }

        const userEmail = email; // Renaming to avoid confusion with variable naming

        return {
          data: decodedData,
          hasError: false,
          message: "Login Success!",
        };
      } catch (error) {
        return {
          hasError: true,
          message: "Error decoding Apple JWT token: " + error.message,
        };
      }

      console.log("end");
      break;
    }
    default: {
      return {
        hasError: true,
        message: "Invalid social type",
      };
    }
  }
  const { hasError, message, image } = await saveNetworkImage(imageUrl);
  if (hasError) {
    return {
      hasError: true,
      message,
    };
  }

  return {
    hasError: false,
    data: {
      name,
      image,
      email,
      dateOfBirth,
      profilePic,
      gender,
    },
  };
};
