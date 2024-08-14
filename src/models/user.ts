import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
  stripeCustomerId: {
    type: String,
    unique: true,
  },
  stripePriceId: {
    type: String,
  },
  stripeCurrentPeriodEnd: {
    type: String,
  },
  stripeSubscriptionId: {
    type: String,
    unique: true,
  },
});

const Users = mongoose.models.users || mongoose.model("users", userSchema);

export default Users;