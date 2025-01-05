import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";

type TextProps = {
    className?: string;
    children?: ReactNode;
} & DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;

export const Text = ({ className, children, ...props }: TextProps) => {
    // --- RENDER ---

    return (
        // @ts-ignore
        <p className={`leading-relaxed ${className ? className : ""}`} {...props}>
            {children}
      </p>
    );
};
