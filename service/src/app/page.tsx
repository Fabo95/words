import { Button } from "@app/components/ui/button";

export default function Home() {
    console.log("have");

    return (
        <main className="bg-white flex min-h-screen flex-col items-center justify-between p-24">
        <Button size="sm" variant="destructive">
            Hi
            </Button>
      </main>
    );
}
