"use client";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/Common/Button";

const Profile = () => {
  const { user } = useUser();

  return (
    <div className="h-full flex-col gap-4 flex items-center justify-center ">
      <h1>Profile</h1>
      <p>Welcome, {user?.firstName}!</p>
    </div>
  );
};

export default Profile;