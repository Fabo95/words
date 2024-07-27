import { ReactElement } from "react";
import { Input, InputProps } from "@app/components/ui/input";
import { Box } from "@app/components/ui/box";
import { Label } from "@app/components/ui/label";
import { Text } from "@app/components/ui/text";

type InputWrapperProps = {
    className?: string;
    name?: string;
    label?: string;
    children: ReactElement<InputProps>;
    errorMessage?: string;
};

export const InputWrapper = ({ className, errorMessage, name, label, children }: InputWrapperProps) => {
    // --- RENDER ---

    return (
        <Box className={`w-full space-y-1 ${className ? className : ""}`}>
            <Label htmlFor={name}>{label}</Label>

            {children}

            {errorMessage && <Text className="text-neutral-100 text-sm">{errorMessage}</Text>}
        </Box>
    );
};
