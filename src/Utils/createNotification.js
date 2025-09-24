import NotificationModel from "../DB/Model/notificationModel.js";
console.log("NotificationModel:", NotificationModel);

export const createNotificationHelper1 = async (
  type,
  title,
  description,
  link,
  user,
) => {
  try {
    const notification = new NotificationModel({
      type,
      title,
      description,
      link,
      user,
    });

    const createdNotification = await notification.save();
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};
