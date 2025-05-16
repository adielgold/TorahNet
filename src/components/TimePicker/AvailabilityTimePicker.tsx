"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { TimePickerInput } from "./TimePickerInput";
import { Label } from "../ui/label";
import moment from "moment-timezone";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "../ui/use-toast";

interface AvailabilityTimePickerProps {
  startTime: string;
  endTime: string;
  timezone: string;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  onTimezoneChange: (timezone: string) => void;
  disabled?: boolean;
}

export function AvailabilityTimePicker({
  startTime,
  endTime,
  timezone,
  onStartTimeChange,
  onEndTimeChange,
  onTimezoneChange,
  disabled = false,
}: AvailabilityTimePickerProps) {
  const { toast } = useToast();
  const startMinuteRef = React.useRef<HTMLInputElement>(null);
  const startHourRef = React.useRef<HTMLInputElement>(null);
  const endMinuteRef = React.useRef<HTMLInputElement>(null);
  const endHourRef = React.useRef<HTMLInputElement>(null);

  // Parse the HH:mm string to a Date object for the time picker
  const getDateFromTimeString = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date;
  };

  const validateTimeRange = (start: string, end: string) => {
    const startMoment = moment(start, "HH:mm");
    const endMoment = moment(end, "HH:mm");

    if (endMoment.isBefore(startMoment)) {
      toast({
        title: "Invalid time range",
        description: "End time must be after start time",
        variant: "destructive",
      });
      return false;
    }

    // Ensure the time range is at least 1 hour
    const duration = moment.duration(endMoment.diff(startMoment));
    if (duration.asHours() < 1) {
      toast({
        title: "Invalid time range",
        description: "Available hours must be at least 1 hour",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleTimeChange = (isStart: boolean, newDate: Date | undefined) => {
    if (newDate) {
      const hours = newDate.getHours().toString().padStart(2, "0");
      const minutes = newDate.getMinutes().toString().padStart(2, "0");
      const newTime = `${hours}:${minutes}`;

      if (isStart) {
        if (validateTimeRange(newTime, endTime)) {
          onStartTimeChange(newTime);
        }
      } else {
        if (validateTimeRange(startTime, newTime)) {
          onEndTimeChange(newTime);
        }
      }
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <Label className="text-darkblueui">Available Hours</Label>

      <div className="flex flex-col space-y-4">
        {/* Quick select time slots */}

        <div className="flex items-center gap-6">
          <div className="flex gap-2">
            <div>
              <Label className="text-xs text-gray-500">Hours</Label>
              <TimePickerInput
                picker="hours"
                date={getDateFromTimeString(startTime)}
                setDate={(newDate) => handleTimeChange(true, newDate)}
                ref={startHourRef}
                onRightFocus={() => startMinuteRef.current?.focus()}
                disabled={disabled}
                className="w-16 h-10 rounded-md border border-[#D7E3F4] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">Minutes</Label>
              <TimePickerInput
                picker="minutes"
                date={getDateFromTimeString(startTime)}
                setDate={(newDate) => handleTimeChange(true, newDate)}
                ref={startMinuteRef}
                onLeftFocus={() => startHourRef.current?.focus()}
                onRightFocus={() => endHourRef.current?.focus()}
                disabled={disabled}
                className="w-16 h-10 rounded-md border border-[#D7E3F4] px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <div>
              <Label className="text-xs text-gray-500">Hours</Label>
              <TimePickerInput
                picker="hours"
                date={getDateFromTimeString(endTime)}
                setDate={(newDate) => handleTimeChange(false, newDate)}
                ref={endHourRef}
                onRightFocus={() => endMinuteRef.current?.focus()}
                disabled={disabled}
                className="w-16 h-10 rounded-md border border-[#D7E3F4] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">Minutes</Label>
              <TimePickerInput
                picker="minutes"
                date={getDateFromTimeString(endTime)}
                setDate={(newDate) => handleTimeChange(false, newDate)}
                ref={endMinuteRef}
                onLeftFocus={() => endHourRef.current?.focus()}
                disabled={disabled}
                className="w-16 h-10 rounded-md border border-[#D7E3F4] px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="w-full">
          <Label className="text-xs text-gray-500 mb-2">Timezone</Label>
          <Select
            value={timezone}
            onValueChange={onTimezoneChange}
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
          <p className="text-xs text-gray-500 mt-1">
            Times will be converted to this timezone for your students
          </p>
        </div>
      </div>
    </div>
  );
}
