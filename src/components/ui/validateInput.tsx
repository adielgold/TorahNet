import React, { useState } from "react";
import {
  Controller,
  Control,
  FieldValues,
  RegisterOptions,
  Path,
} from "react-hook-form";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Label } from "./label";

interface ValidateInputProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: keyof TFieldValues;
  label?: string;
  placeholder: string;
  rules: RegisterOptions;
  type?: string;
  className?: string;
  disabled?: boolean;
  isTextArea?: boolean;
}

const ValidateInput = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  rules,
  type,
  className,
  disabled,
  isTextArea,
}: ValidateInputProps<TFieldValues>) => {
  return (
    <div>
      {label && (
        <Label className="text-appGrey text-sm block mb-2">{label}</Label>
      )}
      <Controller
        name={name as Path<TFieldValues>}
        control={control}
        // @ts-ignore
        rules={rules}
        render={({ field, fieldState: { error } }) => (
          <div className="relative">
            {isTextArea ? (
              <Textarea
                {...field}
                placeholder={placeholder}
                className={className}
                disabled={disabled}
              />
            ) : (
              <Input
                {...field}
                type={type}
                placeholder={placeholder}
                className={className}
                disabled={disabled}
              />
            )}
            {error && (
              <p className="text-red-500 font-medium mt-1.5 text-xs">
                {error.message}
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default ValidateInput;
