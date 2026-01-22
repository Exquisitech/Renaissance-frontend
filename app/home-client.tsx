"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { RenaissanceLogo } from "@/components/renaissance-logo";
import { Header } from "@/components/header";

export default function HomeClient() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header showAuthButtons={true} />
            <main className="flex-1">
                <section className="w-full py-12 md:py-24 lg:py-32 bg-linear-to-b from-background to-muted">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                                    Support Your Favorite Teams on Renaissance
                                </h1>
                                <p className="mx-auto max-w-175 text-muted-foreground md:text-xl">
                                    Get live scores, match notifications, and
                                    exclusive content for the teams you support
                                    with seamless blockchain integration. Be the
                                    number one blockchain fan
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    size="lg"
                                    className="w-full sm:w-auto"
                                    asChild
                                >
                                    <Link href="/signup">Get Started</Link>
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="w-full sm:w-auto bg-transparent"
                                    asChild
                                >
                                    <Link href="#features">Learn More</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
