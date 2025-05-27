import Image from "next/image";
import React from "react";

import { Users,BarChart3,ShieldCheck } from "lucide-react";

const Benefits: React.FC = () => {

    return (
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <div className="inline-block rounded-lg bg-green-100 dark:bg-green-900/30 px-3 py-1 text-sm text-green-800 dark:text-green-300">
                            Platform Benefits
                        </div>
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Why Choose AgriConnect</h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl">
                            Our platform offers unique advantages for both farmers and businesses.
                        </p>
                    </div>
                </div>
                <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2 lg:gap-12">
                    <div className="grid gap-6">
                        <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                                <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Better Profit Margins</h3>
                                <p className="text-muted-foreground">
                                    Farmers earn more by selling directly to businesses without intermediaries.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                                <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Quality Assurance</h3>
                                <p className="text-muted-foreground">
                                    Verified profiles and reviews ensure quality products and reliable transactions.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                                <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Community Support</h3>
                                <p className="text-muted-foreground">
                                    Join a network of farmers and businesses sharing knowledge and best practices.
                                </p>
                            </div>
                        </div>
                    </div>
                    <Image
                        src="/placeholder2.png?height=400&width=400"
                        width={400}
                        height={400}
                        alt="Platform features"
                        className="mx-auto aspect-square overflow-hidden rounded-xl object-cover"
                    />
                </div>
            </div>
        </section>
    )
}

export default Benefits;