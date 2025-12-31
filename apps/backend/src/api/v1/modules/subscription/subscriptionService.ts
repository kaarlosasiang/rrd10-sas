import mongoose from "mongoose";

import User from "../../models/User";

const subscriptionService = {
  // Define your service methods here

  activateSubscription: async (userId: string, planId: string) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Mock subscription activation - update user with subscription details
      const result = await User.updateOne(
        { _id: new mongoose.Types.ObjectId(userId) },
        {
          $set: {
            hasActiveSubscription: true,
            subscriptionPlan: planId,
            subscriptionStatus: "active",
            subscriptionActivatedAt: new Date(),
          },
        }
      );

      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    }
  },

  getSubscription: async (userId: string) => {
    try {
      const user = await User.findOne({
        _id: new mongoose.Types.ObjectId(userId),
      });

      return user;
    } catch (error) {
      throw error;
    }
  },

  cancelSubscription: async (userId: string) => {
    try {
      const result = await User.updateOne(
        { _id: new mongoose.Types.ObjectId(userId) },
        {
          $set: {
            hasActiveSubscription: false,
            subscriptionStatus: "cancelled",
            subscriptionCancelledAt: new Date(),
          },
        }
      );

      return result;
    } catch (error) {
      throw error;
    }
  },
};

export default subscriptionService;
