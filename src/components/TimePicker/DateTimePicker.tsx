"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TimePickerDemo } from "./TimePicker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowIconWhite } from "@/Icons";

const formSchema = z.object({
  dateTime: z.date(),
});

type FormSchemaType = z.infer<typeof formSchema>;

interface DateTimePickerFormProps {
  onSubmitHandler: (data: FormSchemaType) => void;
  onClose: () => void;
  buttonTitle?: string;
}

export function DateTimePickerForm({
  onSubmitHandler,
  onClose,
  buttonTitle,
}: DateTimePickerFormProps) {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(data: FormSchemaType) {
    onSubmitHandler(data);
  }

  return (
    <Form {...form}>
      <form
        className="flex items-start gap-4 justify-center  flex-col"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="dateTime"
          render={({ field }) => (
            <FormItem className="flex  w-full">
              <Popover>
                <FormControl>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP HH:mm:ss")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                </FormControl>
                <PopoverContent className="w-full p-0  flex pointer-events-auto ">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                  <div className="p-3 border-t border-border ">
                    <TimePickerDemo
                      setDate={field.onChange}
                      date={field.value}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />
        <div className="flex items-center">
          <Clock className="mr-2 h-4 w-4" />
          <span className="text-sm text-gray-500">
            Time selection will be added here
          </span>
        </div>
        <div className="flex w-full justify-end mt-5">
          <Button
            type="submit"
            className="bg-[#1e1e4a] text-white hover:bg-[#2a2a5a]"
          >
            {buttonTitle || "Send"}
          </Button>
        </div>
        {/* <Button type="submit">Select</Button> */}
      </form>
    </Form>
  );
}
