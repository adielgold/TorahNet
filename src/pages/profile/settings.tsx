import { Navbar, Sidebar, HamburgerDashboard } from "@/components";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import QuickLinksCard from "@/components/QuickLinks/QuickLinksCard";
import { FaRegCircleQuestion } from "react-icons/fa6";
import withAuth from "@/components/withAuth/withAuth";
import { useUserStore } from "@/stores/userStore";
import { Controller, set, SubmitHandler, useForm } from "react-hook-form";
import ValidateInput from "@/components/ui/validateInput";
import { createClient } from "@/utils/supabase/client";
import { UpdateUserData } from "@/types";
import { usePaymentDetailsStore } from "@/stores/paymentDetailsStore";
import { isCreditCard } from "validator";
import InputMask from "react-input-mask";
import {
  Camera,
  CheckCircle,
  Loader,
  Pencil,
  Save,
  X,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import LayoutWrapper from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import PayPalConnect from "@/components/Paypal/PayPalConnect";
import ToasterTitle from "@/components/ui/toaster-title";
import { TeacherAvailability } from "@/components/TimePicker/TeacherAvailability";

interface AdjustPersonalDetailsForm {
  name: string;
  bio: string;
  expertise?: string;
  hourly_rate?: number;
  card_number?: string;
  paypal_email?: string;
  available_hours: {
    start: string;
    end: string;
    timezone: string;
  };
}

interface AdjustPaymentDetailsForm {}

const Settings = () => {
  const { setUser, user } = useUserStore();

  const [loginLink, setLoginLink] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const { paymentDetails, setPaymentDetails } = usePaymentDetailsStore();

  const [isEditing, setIsEditing] = useState(false);

  const [profileUpdateLoading, setProfileUpdateLoading] = useState(false);

  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const initialOptions = {
    clientId: "test",
    currency: "USD",
    intent: "capture",
  };

  const topics = [
    "Hebrew Bible (Tanakh/Torah)",
    "Talmud (Gemara)",
    "Jewish Mysticism (Kabbalah)",
    "Jewish Law (Halakha)",
    "Jewish Ethics & Philosophy",
    "Jewish History",
    "Hebrew",
    "Mentorship",
    "Business & Leadership",
    "Relationships & Marriage",
  ];

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) => {
      if (prev.includes(topic)) {
        return prev.filter((item) => item !== topic);
      } else {
        return [...prev, topic];
      }
    });
  };

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<AdjustPersonalDetailsForm>();

  const supabase = createClient();

  useEffect(() => {
    setValue("name", user?.name ?? "");
    setValue("bio", user?.bio ?? "");
    if (user?.role === "teacher") {
      setValue("expertise", user?.expertise ?? "");
      setValue("hourly_rate", paymentDetails?.hourly_rate ?? 0);
      setValue("card_number", paymentDetails?.card_number ?? "");
      setValue("paypal_email", paymentDetails?.stripe_account_id ?? "");
      setValue(
        "available_hours",
        (user?.available_hours as any) ?? {
          start: "09:00",
          end: "17:00",
          timezone: "UTC",
        },
      );
    }
    setSelectedTopics(user?.topics ?? []);
  }, [user, paymentDetails]);

  // useEffect(() => {
  //   if (user?.role !== "teacher") return;

  //   setPaymentValue("hourly_rate", paymentDetails?.hourly_rate ?? 0);
  //   setPaymentValue("card_number", paymentDetails?.card_number ?? "");
  // }, [paymentDetails, user]);

  const onSubmitPersonalDetails: SubmitHandler<
    AdjustPersonalDetailsForm
  > = async (data) => {
    setProfileUpdateLoading(true);

    try {
      let updateData: UpdateUserData = {
        name: data.name,
        bio: data.bio,
        topics: selectedTopics,
      };

      if (user?.role === "teacher") {
        updateData.expertise = data.expertise;
        updateData.available_hours = data.available_hours;
      }

      const { data: userData, error: userError } = await supabase
        .from("users")
        .update(updateData)
        .eq("id", user?.id as string)
        .select("*")
        .single();

      if (user?.role === "teacher") {
        const { data: pdData, error: pdError } = await supabase
          .from("payment_details")
          .update({
            hourly_rate: data?.hourly_rate
              ? +data.hourly_rate
              : paymentDetails?.hourly_rate,
            card_number: data.card_number,
          })
          .eq("id", user?.id as string)
          .select("*")
          .single();

        if (pdError) {
          throw pdError;
        }

        if (pdData) {
          setPaymentDetails(pdData);
        }

        const { data: payaplEmail, error: payaplEmailError } = await supabase
          .from("payment_details")
          .update({
            stripe_account_id: data.paypal_email,
            onboarding_completed: true,
          })
          .eq("id", user?.id as string)
          .select("*")
          .single();

        if (payaplEmailError) {
          console.log(payaplEmailError);
          throw payaplEmailError;
        }

        if (payaplEmail) {
          console.log(payaplEmail);
          setPaymentDetails(payaplEmail);
        }
      }

      if (userError) {
        throw userError;
      }

      if (userData) {
        setUser({ token: user?.token!, ...userData });
        toast({
          title: <ToasterTitle title="Success" type="success" />,
          description: "User details updated successfully",
        });
        setIsEditing(false);
      }
    } catch (error) {
      toast({
        title: <ToasterTitle title="Error" type="error" />,
        description: "Error updating user details",
        variant: "destructive",
      });
    } finally {
      setProfileUpdateLoading(false);
    }
  };

  // const onSubmitHandlePaymentDetails: SubmitHandler<
  //   AdjustPaymentDetailsForm
  // > = async (data) => {
  //   setAdjustPaymentDetailsLoading(true);
  //   const { data: pdData, error: pdError } = await supabase
  //     .from("payment_details")
  //     .update({
  //       hourly_rate: +data.hourly_rate,
  //       card_number: data.card_number,
  //     })
  //     .eq("id", user?.id as string)
  //     .select("*")
  //     .single();

  //   if (pdError) {
  //     toast.error("Error updating payment details");
  //     setAdjustPaymentDetailsLoading(false);
  //     setAdjustPaymentDetails(false);
  //   }

  //   if (pdData) {
  //     toast.success("Payment details updated successfully");
  //     setPaymentDetails(pdData);
  //     setAdjustPaymentDetailsLoading(false);
  //     setAdjustPaymentDetails(false);
  //   }
  // };

  const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageUploadLoading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `images/${fileName}`;

    const { data, error } = await supabase.storage
      .from("user-images")
      .upload(filePath, file);

    if (error) {
      console.error("Error uploading file:", error);
      setImageUploadLoading(false);
      toast({
        title: <ToasterTitle title="Error" type="error" />,
        description: "Error uploading image . Please try again",
        variant: "destructive",
      });
      return;
    }

    const { data: imageData } = supabase.storage
      .from("user-images")
      .getPublicUrl(filePath);

    await saveImageUrlToDatabase(imageData?.publicUrl as string);
  };

  const saveImageUrlToDatabase = async (url: string) => {
    const { data, error } = await supabase
      .from("users")
      .update({ image_url: url })
      .eq("id", user?.id as string)
      .select("*")
      .single();

    if (error) {
      console.error("Error saving image URL to database:", error);
    }

    setImageUploadLoading(false);
    toast({
      title: <ToasterTitle title="Success" type="success" />,
      description: "Image uploaded successfully",
    });

    if (data) {
      setUser({ token: user?.token!, ...data });
    }
  };

  const connectStripeAccount = async () => {
    try {
      const { data } = await axios.get("/api/stripe/connect");

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast({
        title: <ToasterTitle title="Error" type="error" />,
        description: "Error connecting stripe account",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await supabase
        .from("payment_details")
        .select("*")
        .eq("id", user?.id as string)
        .single();

      if (error) {
        console.error("Error fetching payment details:", error);
        return;
      }

      if (data) {
        setPaymentDetails(data);
      }
    })();
  }, [user]);

  // useEffect(() => {
  //   if (
  //     !user ||
  //     (!paymentDetails?.stripe_account_id &&
  //       !paymentDetails?.onboarding_completed)
  //   )
  //     return;
  //   const getDashboardLink = async () => {
  //     try {
  //       const { data } = await axios.post("/api/stripe/dashboard-link", {
  //         stripeAccountId: paymentDetails?.stripe_account_id,
  //       });

  //       if (data?.url) {
  //         setLoginLink(data.url);
  //       }
  //     } catch (error) {
  //       toast({
  //         title: <ToasterTitle title="Error" type="error" />,
  //         description: "Error fetching stripe dashboard link",
  //         variant: "destructive",
  //       });
  //     }
  //   };
  //   getDashboardLink();
  // }, [paymentDetails, user]);

  return (
    <LayoutWrapper>
      <div className="mx-auto max-w-4xl">
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
              <input
                type="file"
                ref={inputRef}
                className="hidden"
                onChange={uploadFile}
                accept="image/*"
              />
              <div
                className="border-dashed-styled relative rounded-full p-2"
                onClick={() => inputRef?.current?.click()}
              >
                <Avatar className="h-32 w-32 cursor-pointer">
                  <AvatarImage src={user?.image_url!} alt={user?.name!} />
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-3 right-[50px]">
                  <Button className="h-10 w-10 rounded-full border border-white bg-darkblueui p-0">
                    <Camera className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="mb-2 text-3xl font-bold">{user?.name}</h1>
                <h1 className="mb-2 text-sm text-gray-600">{user?.bio}</h1>
                <p className="mb-4 text-gray-600">{user?.expertise}</p>
                <div className="mb-4 flex flex-wrap justify-center gap-2 md:justify-start">
                  {selectedTopics?.map((topic, index) => (
                    <Badge key={index} className="bg-darkblueui p-2">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* <form onSubmit={handleSubmit(onSubmitPersonalDetails)}> */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Personal Details</CardTitle>
            {isEditing ? (
              <Button
                onClick={handleSubmit(onSubmitPersonalDetails)}
                disabled={profileUpdateLoading}
                className="bg-[#1e1e4a] hover:bg-[#2a2a5a]"
              >
                {profileUpdateLoading ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}{" "}
                Save Changes
              </Button>
            ) : (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                <Pencil className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <ValidateInput
                control={control}
                name="name"
                placeholder="Name"
                rules={{ required: "Name is required" }}
                label="Name"
                type="text"
                disabled={!isEditing}
              />
            </div>
            <div>
              <ValidateInput
                control={control}
                name="bio"
                placeholder="About Me"
                rules={{ required: "Bio is required" }}
                label="About Me"
                type="text"
                disabled={!isEditing}
                isTextArea
              />
            </div>
            {user?.role === "teacher" && (
              <div>
                <ValidateInput
                  control={control}
                  name="expertise"
                  placeholder="Expertise"
                  rules={{}}
                  label="Expertise"
                  type="text"
                  disabled={!isEditing}
                />
              </div>
            )}
            <CardTitle className="pt-4">Topics</CardTitle>
            <div className="flex flex-wrap gap-2">
              {topics?.map((topic, index) => (
                <Badge
                  key={index}
                  className={`p-2 ${
                    isEditing
                      ? "cursor-pointer hover:bg-blueui hover:text-white"
                      : "cursor-auto hover:bg-white"
                  } ${
                    selectedTopics?.includes(topic) && isEditing
                      ? "bg-blueui text-white"
                      : "border border-blueui bg-white text-blueui"
                  }`}
                  onClick={() => isEditing && toggleTopic(topic)}
                >
                  {topic}
                  {isEditing && topics?.includes(topic) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
            {user?.role === "teacher" && (
              <>
                <CardTitle className="pt-4">Payment Details</CardTitle>
                <div>
                  <ValidateInput
                    control={control}
                    name="hourly_rate"
                    placeholder="Hourly Fee"
                    rules={{}}
                    label="Hourly Fee"
                    type="number"
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <TeacherAvailability
                    control={control}
                    setValue={setValue}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  {!paymentDetails?.stripe_account_id &&
                  !paymentDetails?.onboarding_completed ? (
                    <ValidateInput
                      control={control}
                      name="paypal_email"
                      placeholder="abc@xyz.com"
                      rules={{}}
                      label="Paypal Email"
                      type="email"
                      disabled={!isEditing}
                    />
                  ) : null}
                  {paymentDetails?.disabled_reason && (
                    <p className="mt-1.5 text-sm font-medium text-red-500">
                      Your account Has been Rejected for{" "}
                      {paymentDetails?.disabled_reason?.split(".")?.[1]} Reason.
                      Please contact support
                    </p>
                  )}

                  {paymentDetails?.stripe_account_id &&
                  !paymentDetails?.onboarding_completed &&
                  !paymentDetails?.disabled_reason ? (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      Your account is under review
                    </p>
                  ) : null}

                  {paymentDetails?.stripe_account_id &&
                    paymentDetails?.onboarding_completed &&
                    !paymentDetails?.disabled_reason && (
                      <ValidateInput
                        control={control}
                        name="paypal_email"
                        placeholder="abc@xyz.com"
                        rules={{}}
                        label="Paypal Email"
                        type="email"
                        disabled={!isEditing}
                      />
                    )}
                </div>
                <p className="text-sm text-gray-500">
                  We charge a 15% commission to keep our platform running. This
                  means the end user pays ${paymentDetails?.hourly_rate!}, you
                  get ${Math.round(paymentDetails?.hourly_rate! * 0.85)} per
                  hour.
                </p>
              </>
            )}
          </CardContent>
        </Card>
        {/* </form> */}
      </div>
    </LayoutWrapper>

    // <section className="w-full h-full flex flex-col">
    //   <div className="hidden sm:flex">
    //     <Navbar />
    //   </div>
    //   <div className="flex sm:hidden justify-between items-center bg-white w-full h-20 shadowprofile px-4">
    //     <HamburgerDashboard />
    //     <button className="px-3.5 py-1.5 rounded-full bg-blueui flex justify-center items-center mt-4 hover:bg-dark">
    //       <FaRegCircleQuestion className="text-sm mt-0.5 question-icon" />
    //       <span className="text-sm text-white ml-1 font-light">Help</span>
    //     </button>
    //   </div>
    //   <div className="w-full h-full flex">
    //     <div className="hidden sm:flex">
    //       <Sidebar />
    //     </div>
    //     <div className="w-full h-full flex flex-col sm:ml-14 mt-11 px-4">
    //       <div className="flex flex-col">
    //         <p className="text-blueui capitalize">{user?.role}</p>
    //         <h1 className="text-darkblueui text-2xl font-bold">
    //           Account Settings
    //         </h1>
    //       </div>
    //       {/* {account personal detail} */}
    //       <div className="flex w-full h-full items-center mt-8">
    //         <div
    //           onClick={() => inputRef?.current?.click()}
    //           className="sm:w-36 sm:h-36 w-28 h-28 rounded-full bg-[#D7E3F4] flex items-center justify-center cursor-pointer relative"
    //         >
    //           {user?.image_url ? (
    //             <Image
    //               alt="profile image"
    //               src={user?.image_url}
    //               className="rounded-full sm:w-36 sm:h-36 w-28 h-28 object-contain"
    //               layout="fill"
    //             />
    //           ) : (
    //             <>
    //               {imageUploadLoading ? (
    //                 <div className="basic"></div>
    //               ) : (
    //                 <Camera className="w-8 h-8 text-black " />
    //               )}
    //             </>
    //           )}

    //           <input
    //             type="file"
    //             className="hidden"
    //             onChange={uploadFile}
    //             ref={inputRef}
    //             accept="image/*"
    //           />
    //         </div>
    //         <span className="ml-8 text-darkblueui text-2xl font-bold whitespace-nowrap">
    //           {user?.name}
    //         </span>
    //       </div>
    //       <div className="flex flex-col sm:flex-row h-full mt-8">
    //         <div className="flex flex-col h-full w-full sm:w-1/2">
    //           <div className="flex justify-between w-full h-full">
    //             <span className="text-darkblueui text-lg font-bold">
    //               Personal Details
    //             </span>
    //             {adjustDetails ? (
    //               <button
    //                 onClick={handleSubmit(onSubmitPersonalDetails)}
    //                 className="text-sm font-medium px-2.5 rounded-full bg-[#D7E3F4] justify-center items-center hidden sm:flex"
    //               >
    //                 {"Save"} details{" "}
    //                 {adjustPersonalDetailsLoading ? (
    //                   <div className="basic-small ml-2"></div>
    //                 ) : (
    //                   <span className="ml-2">→</span>
    //                 )}
    //               </button>
    //             ) : (
    //               <button
    //                 onClick={() => {
    //                   setAdjustDetails(true);
    //                 }}
    //                 type={"button"}
    //                 className="text-sm font-medium px-2.5 rounded-full bg-[#D7E3F4] justify-center items-center hidden sm:flex"
    //               >
    //                 {"Adjust"} details <span className="ml-2">→</span>
    //               </button>
    //             )}
    //           </div>
    //           <div className="flex flex-col w-full h-full mt-8">
    //             <div className="flex flex-col w-full h-full">
    //               <span className="text-darkblueui font-bold text-base">
    //                 Name
    //               </span>

    //               {adjustDetails ? (
    //                 <ValidateInput
    //                   control={control}
    //                   name="name"
    //                   placeholder="Name"
    //                   rules={{ required: "Name is required" }}
    //                   type="text"
    //                   className="bg-white py-2 pl-4 pr-6 min-w-full sm:min-w-96 rounded-full border border-[#D7E3F4] mt-2"
    //                 />
    //               ) : (
    //                 <span className="text-darkblueui text-sm">
    //                   {user?.name}
    //                 </span>
    //               )}

    //               {/* <span className="text-darkblueui text-sm">{user?.name}</span> */}
    //             </div>
    //             <div className="flex flex-col w-full h-full mt-6">
    //               <span className="text-darkblueui font-bold">About me</span>
    //               {adjustDetails ? (
    //                 <>
    //                   <textarea
    //                     {...control.register("bio", {
    //                       required: "Bio is required",
    //                     })}
    //                     name="bio"
    //                     placeholder="Bio"
    //                     className="bg-white py-2 pl-4 pr-6 min-w-full rounded-full border border-[#D7E3F4] mt-2"
    //                   />
    //                   {errors.bio && (
    //                     <p className="text-red-500 font-medium mt-1.5 text-xs">
    //                       {errors?.bio?.message}
    //                     </p>
    //                   )}
    //                 </>
    //               ) : (
    //                 <span className="text-darkblueui text-sm">{user?.bio}</span>
    //               )}
    //             </div>
    //             {user?.role === "teacher" && (
    //               <div className="flex flex-col w-full h-full mt-4">
    //                 <span className="text-darkblueui font-bold">Expertise</span>
    //                 {adjustDetails ? (
    //                   <>
    //                     <textarea
    //                       {...control.register("expertise")}
    //                       name="expertise"
    //                       placeholder="Expertise"
    //                       className="bg-white py-2 pl-4 pr-6 min-w-full rounded-full border border-[#D7E3F4] mt-2"
    //                     />
    //                   </>
    //                 ) : (
    //                   <span className="text-darkblueui text-sm">
    //                     {user?.expertise}
    //                   </span>
    //                 )}
    //               </div>
    //             )}

    //             <div className="flex flex-col w-full h-full mt-8">
    //               <span className="text-darkblueui font-bold">Topics</span>
    //               <div className="flex flex-col min-h-[100px]">
    //                 <div className="flex flex-wrap gap-y-2">
    //                   {adjustDetails ? (
    //                     <>
    //                       {topics.map((topic, index) => (
    //                         <QuickLinksCard
    //                           key={index}
    //                           title={topic}
    //                           textSize="sm"
    //                           customClasses={`${
    //                             selectedTopics.includes(topic)
    //                               ? "bg-darkblueui text-white"
    //                               : ""
    //                           }`}
    //                           onClick={() => {
    //                             setSelectedTopics((prev) => {
    //                               if (prev.includes(topic)) {
    //                                 return prev.filter(
    //                                   (item) => item !== topic
    //                                 );
    //                               } else {
    //                                 return [...prev, topic];
    //                               }
    //                             });
    //                           }}
    //                         />
    //                       ))}
    //                     </>
    //                   ) : (
    //                     <>
    //                       {user?.topics &&
    //                         user?.topics.map((topic) => (
    //                           <QuickLinksCard
    //                             key={topic}
    //                             title={topic}
    //                             textSize="sm"
    //                           />
    //                         ))}
    //                     </>
    //                   )}
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //         {user?.role === "teacher" && (
    //           <div className="flex flex-col w-full sm:w-2/6 sm:ml-16 h-full mt-4 sm:mt-0 mb-4 sm:mb-0">
    //             <div className="flex justify-between w-full h-full">
    //               <span className="text-darkblueui text-lg font-bold">
    //                 Payment Details
    //               </span>
    //               {adjustPaymentDetails ? (
    //                 <button
    //                   onClick={paymentHandleSubmit(
    //                     onSubmitHandlePaymentDetails
    //                   )}
    //                   className="text-sm font-medium px-2.5 rounded-full bg-[#D7E3F4] justify-center items-center hidden sm:flex"
    //                 >
    //                   {"Save"} Settings{" "}
    //                   {adjustPaymentDetailsLoading ? (
    //                     <div className="basic-small ml-2"></div>
    //                   ) : (
    //                     <span className="ml-2">→</span>
    //                   )}
    //                 </button>
    //               ) : (
    //                 <button
    //                   onClick={() => {
    //                     setAdjustPaymentDetails(true);
    //                   }}
    //                   type={"button"}
    //                   className="text-sm font-medium px-2.5 rounded-full bg-[#D7E3F4] justify-center items-center hidden sm:flex"
    //                 >
    //                   {"Adjust"} Settings <span className="ml-2">→</span>
    //                 </button>
    //               )}
    //             </div>
    //             <div className="flex flex-col w-full h-full mt-2">
    //               <span className="text-darkblueui font-bold text-base">
    //                 Hourly Fee
    //               </span>
    //               {adjustPaymentDetails ? (
    //                 <ValidateInput
    //                   control={paymentControl}
    //                   name="hourly_rate"
    //                   placeholder="Hourly Rate"
    //                   rules={{ required: "Hourly rate is required" }}
    //                   type="number"
    //                   className="bg-white py-2 pl-4 pr-6 min-w-full sm:min-w-96 rounded-full border border-[#D7E3F4] mt-2"
    //                 />
    //               ) : (
    //                 <span className="text-darkblueui text-sm">
    //                   ${paymentDetails?.hourly_rate}
    //                 </span>
    //               )}

    //               {!adjustPaymentDetails && (
    //                 <span className="text-blueui text-xs ">
    //                   We charge a 15% commision to keep our platform running.{" "}
    //                   <br /> This means the end user pays $
    //                   {paymentDetails?.hourly_rate}, you get $
    //                   {paymentDetails?.hourly_rate &&
    //                     paymentDetails?.hourly_rate -
    //                       paymentDetails?.hourly_rate * 0.15}{" "}
    //                   per hour.
    //                 </span>
    //               )}
    //             </div>
    //             <div className="flex flex-col w-full h-full mt-4">
    //               <span className="text-darkblueui font-bold">
    //                 Connected Bank Account
    //               </span>
    //               <span className="text-darkblueui text-sm mt-2">
    //                 Card Number
    //               </span>
    //               {adjustPaymentDetails ? (
    //                 <>
    //                   <Controller
    //                     name="card_number"
    //                     control={paymentControl}
    //                     rules={{
    //                       required: "Credit card number is required",
    //                       validate: (value) => {
    //                         return (
    //                           value.replaceAll("_", "")?.trim()?.length ===
    //                             19 || "Invalid credit card number"
    //                         );
    //                       },
    //                     }}
    //                     render={({ field }) => (
    //                       <InputMask
    //                         mask="9999 9999 9999 9999"
    //                         value={field.value}
    //                         onChange={field.onChange}
    //                         onBlur={field.onBlur}
    //                         className="bg-white py-2 pl-4 pr-6 min-w-full sm:min-w-96 rounded-full border border-[#D7E3F4] mt-2"
    //                       ></InputMask>
    //                     )}
    //                   />
    //                   {paymentErrors?.card_number && (
    //                     <p className="text-red-500 font-medium mt-1.5 text-xs">
    //                       {paymentErrors?.card_number.message}
    //                     </p>
    //                   )}
    //                 </>
    //               ) : (
    //                 <span className="text-darkblueui text-sm">
    //                   {paymentDetails?.card_number
    //                     ? `**** **** **** ${paymentDetails?.card_number?.slice(
    //                         15
    //                       )}`
    //                     : ""}
    //                 </span>
    //               )}
    //             </div>
    //           </div>
    //         )}
    //       </div>
    //     </div>
    //   </div>
    //   <div className="sm:hidden flex h-full items-end">
    //     <Navbar />
    //   </div>
    // </section>
  );
};

export default withAuth(Settings);
