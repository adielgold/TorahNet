"use client";

import { TimePickerInput } from "../TimePicker/TimePickerInput";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import moment from "moment-timezone";
import { Control, UseFormSetValue, useWatch } from "react-hook-form";
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
interface TeacherAvailabilityProps {
  control: Control<AdjustPersonalDetailsForm>;
  setValue: UseFormSetValue<AdjustPersonalDetailsForm>;
  disabled?: boolean;
}

export function TeacherAvailability({
  control,
  setValue,
  disabled = false,
}: TeacherAvailabilityProps) {
  const available_hours = useWatch({
    control,
    name: "available_hours",
    defaultValue: {
      start: "09:00",
      end: "17:00",
      timezone: "UTC",
    },
  });

  console.log("picker", available_hours);

  const handleTimeChange = (
    type: "start" | "end",
    newDate: Date | undefined
  ) => {
    if (newDate) {
      const hours = newDate.getHours().toString().padStart(2, "0");
      const minutes = newDate.getMinutes().toString().padStart(2, "0");
      const newTime = `${hours}:${minutes}`;

      setValue(
        "available_hours",
        {
          ...available_hours,
          [type]: newTime,
        },
        { shouldDirty: true }
      );
    }
  };

  const handleTimezoneChange = (newTimezone: string) => {
    setValue(
      "available_hours",
      {
        ...available_hours,
        timezone: newTimezone,
      },
      { shouldDirty: true }
    );
  };

  return (
    <div className="space-y-4">
      <Label>Available Hours</Label>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center gap-6">
          <div className="flex gap-2">
            <div>
              <Label className="text-xs text-gray-500">Start Time</Label>
              <TimePickerInput
                picker="hours"
                date={moment(available_hours.start, "HH:mm").toDate()}
                setDate={(date) => handleTimeChange("start", date)}
                disabled={disabled}
                className="w-16 h-10 rounded-md border border-[#D7E3F4] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">Minutes</Label>
              <TimePickerInput
                picker="minutes"
                date={moment(available_hours.start, "HH:mm").toDate()}
                setDate={(date) => handleTimeChange("start", date)}
                disabled={disabled}
                className="w-16 h-10 rounded-md border border-[#D7E3F4] px-3 py-2 text-sm"
              />
            </div>
          </div>

          <span className="text-gray-500">to</span>

          <div className="flex gap-2">
            <div>
              <Label className="text-xs text-gray-500">End Time</Label>
              <TimePickerInput
                picker="hours"
                date={moment(available_hours.end, "HH:mm").toDate()}
                setDate={(date) => handleTimeChange("end", date)}
                disabled={disabled}
                className="w-16 h-10 rounded-md border border-[#D7E3F4] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">Minutes</Label>
              <TimePickerInput
                picker="minutes"
                date={moment(available_hours.end, "HH:mm").toDate()}
                setDate={(date) => handleTimeChange("end", date)}
                disabled={disabled}
                className="w-16 h-10 rounded-md border border-[#D7E3F4] px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        <div>
          <Label className="text-xs text-gray-500">Timezone</Label>
          <Select
            value={available_hours.timezone}
            onValueChange={handleTimezoneChange}
            disabled={disabled}
          >
            <SelectTrigger className="w-full border-[#D7E3F4]">
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              {moment.tz.names().map((tz) => (
                <SelectItem key={tz} value={tz}>
                  {tz} ({moment.tz(tz).format("Z")})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
