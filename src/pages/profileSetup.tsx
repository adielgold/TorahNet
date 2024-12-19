import Stepper from "@/components/Stepper/Stepper";
import React from "react";

const ProfileSetup = () => {
  return (
    // <section className="flex flex-col w-full min-h-screen    justify-center items-center">
    //   <div className="flex sm:hidden flex-col w-full h-full justify-center items-center">
    //     <h1 className="text-darkblueui text-3xl font-bold">
    //       Setting up your Profile
    //     </h1>
    //     <span className="text-darkblueui font-medium text-base w-3/4 text-center mt-2">
    //       To make the platform as engaging as possible, we require some
    //       information so our teachers know who they are talking to.
    //     </span>
    //     <Stepper />
    //   </div>
    //   <div className="hidden sm:flex flex-col w-full h-full justify-center items-center">
    //     <h1 className="text-darkblueui text-3xl font-bold">
    //       Setting up your Profile
    //     </h1>
    //     <span className="text-blueui text-base text-center mt-4">
    //       To make the platform as engaging as possible, we require some <br />
    //       information so our teachers know who they are talking to.
    //     </span>
    //     <Stepper />
    //   </div>
    // </section>

    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Stepper />
    </div>
  );
};

export default ProfileSetup;
