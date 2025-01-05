import { DetailedHTMLProps, HTMLAttributes, ReactNode, useEffect, useState } from "react";

type BoxProps = {
    className?: string;
    children?: ReactNode;
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const Box = ({ className, children, ...props }: BoxProps) => {
    // --- RENDER ---

    return (
        // @ts-ignore
        <div className={`flex flex-col ${className ? className : ""}`} {...props}>
            {children}
        </div>
    );
};
