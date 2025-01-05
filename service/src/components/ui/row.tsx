import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";

type RowProps = {
    className?: string;
    children?: ReactNode;
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const Row = ({ className, children, ...props }: RowProps) => {
    // --- RENDER ---

    return (
        // @ts-ignore
        <div className={`flex flex-row ${className ? className : ""}`} {...props}>
            {children}
      </div>
    );
};
