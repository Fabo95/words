"use client";

import { useEffect } from "react";
import { Box } from "@app/components/ui/box";
import { Button } from "@app/components/ui/button";
import { Text } from "@app/components/ui/text";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <Box className="justify-center pt-16 items-center">
            <Text className="text-neutral-100 text-sm mb-5">Something went wrong!</Text>

            <Button onClick={() => reset()}>Try again</Button>
        </Box>
    );
}
