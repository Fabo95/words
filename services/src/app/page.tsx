import { Button } from "@app/components/ui/button";

export default function Home() {
    console.log("have");

    return (
        <main className="bg-white flex min-h-screen flex-col items-center justify-between p-24">
            <Button variant="destructive" size="sm">
                Hi
            </Button>
        </main>
    );
}
