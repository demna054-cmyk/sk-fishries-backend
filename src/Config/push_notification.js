// var FCM = require("fcm-node");
// import FCM from "fcm-node";
var serverKey =
  "AAAAHcuSx1g:APA91bEdAQPLsSfdFyLuZhq4Z48mW8A58KyBNDGzh11x4vuJJRiLOVmN0ldhmamhAzR8gA67u-5Xlde52y87FrMRvhIJzgS5cjQHmS7kHB3Dxv9vOkDj5-x7qOJ-w6j8fG5_pD9z-7Y9"; //put your server key here
var fcm = new FCM(serverKey);

const push_notifications = (notification_obj) => {
  console.log(notification_obj);
  var message = {
    to: notification_obj.deviceToken,
    collapse_key: "your_collapse_key",

    notification: {
      title: notification_obj.title,
      body: notification_obj.body,
      sound: "default",
    },
  };

  // fcm.send(message, function (err, response) {
  //   if (err) {
  //     console.log("err", err);
  //   } else {
  //     console.log("response", response);
  //   }
  // });
};

// module.exports = { push_notifications };
export default push_notifications;
