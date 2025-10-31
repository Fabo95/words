import { Control, ControllerProps, FieldPath, FieldValues } from "react-hook-form"

import {
	FormControl,
	FormDescription,
	FormField as FormFieldReactHookForm,
	FormItem,
	FormLabel,
	FormMessage,
} from "services/words/src/components/ui/form"

type FormFieldProps<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
	// biome-ignore lint/suspicious/noExplicitAny: biome migration
	TContext = any,
> = {
	control: Control<TFieldValues, TContext>
	className?: string
	name: TName
	label: string
	description?: string
} & ControllerProps<TFieldValues, TName>

export const FormField = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
	// biome-ignore lint/suspicious/noExplicitAny: biome migration
	TContext = any,
>({
	control,
	className,
	name,
	label,
	render,
	description,
}: FormFieldProps<TFieldValues, TName, TContext>) => {
	return (
		<FormFieldReactHookForm
			control={control}
			name={name}
			render={(fieldProps) => (
				<FormItem className={className}>
					<FormLabel>{label}</FormLabel>

					<FormControl>{render(fieldProps)}</FormControl>

					{description && <FormDescription>{description}</FormDescription>}

					<FormMessage />
				</FormItem>
			)}
		/>
	)
}
