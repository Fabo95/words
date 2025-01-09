import * as React from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { HTMLInputTypeAttribute } from "react";

import {
    FormControl,
    FormDescription,
    FormField as FormFieldReactHookForm,
    FormItem,
    FormLabel,
    FormMessage,
} from "@app/components/ui/form";
import { Input } from "@app/components/ui/input";

type FormFieldProps<TFieldValues extends FieldValues = FieldValues, TContext = any> = {
    control: Control<TFieldValues, TContext>;
    className?: string;
    name: Path<TFieldValues>;
    label: string;
    placeholder?: string;
    // Make a proper type for this.
    input: typeof Input;
    inputType?: HTMLInputTypeAttribute | undefined;
    description?: string;
};

export const FormField = <TFieldValues extends FieldValues = FieldValues, TContext = any>({
    control,
    className,
    name,
    label,
    placeholder,
    input: Input,
    inputType,
    description,
}: FormFieldProps<TFieldValues, TContext>) => {
    return (
        <FormFieldReactHookForm
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={className}>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input type={inputType} placeholder={placeholder} {...field} />
                    </FormControl>

                    {description && <FormDescription>{description}</FormDescription>}

                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
