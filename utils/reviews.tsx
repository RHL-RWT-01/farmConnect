// components/Reviews.tsx
import Image from "next/image";
import React from "react";

interface Review {
    name: string;
    role: string;
    text: string;
}

const reviews: Review[] = [
    {
        name: "Ramesh",
        role: "Organic Vegetable Farmer",
        text: "Since joining AgriConnect, I've increased my profit margins by 30% and built relationships with restaurants and grocery stores I never had access to before.",
    },
    {
        name: "Ramdayal",
        role: "Restaurant Owner",
        text: "AgriConnect has revolutionized our supply chain. We now source directly from local farmers, ensuring fresher ingredients and supporting our community.",
    },
    {
        name: "Sita",
        role: "Dairy Farmer",
        text: "Now I can sell milk directly to urban vendors without middlemen. AgriConnect is a game-changer.",
    },
    {
        name: "Arjun",
        role: "Fruit Supplier",
        text: "Managing logistics is easier than ever. I can focus more on quality now!",
    },
    {
        name: "Geeta",
        role: "Agro Tech Consultant",
        text: "The platform offers real-time data that helps our clients grow more efficiently.",
    },
    {
        name: "Mukesh",
        role: "Grocery Chain Owner",
        text: "Sourcing local and fresh has helped our sales go up. Customers love it!",
    },
    {
        name: "Radha",
        role: "Spice Exporter",
        text: "Exporting organic turmeric is smoother thanks to the FarmConnect network.",
    },
    {
        name: "Shyam",
        role: "Greenhouse Farmer",
        text: "We cut costs by 20% using the app’s direct buyer feature!",
    },
];

const Reviews: React.FC = () => {
    return (
        <section
            id="testimonials"
            className="w-full py-12 md:py-24 lg:py-32 bg-muted dark:bg-muted/50 overflow-hidden"
        >
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <div className="inline-block rounded-lg bg-green-100 dark:bg-green-900/30 px-3 py-1 text-sm text-green-800 dark:text-green-300">
                            Success Stories
                        </div>
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                            What Our Users Say
                        </h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl">
                            Hear from farmers and businesses who have transformed their operations with FarmConnect.
                        </p>
                    </div>
                </div>

                <div className="relative mt-12 overflow-hidden">
                    <div className="flex animate-scroll gap-6 w-max">
                        {reviews.map((user, idx) => (
                            <div
                                key={idx}
                                className="rounded-lg border bg-background p-6 w-[300px] flex-shrink-0 shadow-green-glow"
                            >
                                <div className="flex items-start gap-4">
                                    <Image
                                        src="/profile.png"
                                        width={60}
                                        height={60}
                                        alt={`${user.name} portrait`}
                                        className="rounded-full"
                                    />
                                    <div>
                                        <h3 className="text-lg font-bold">{user.name}</h3>
                                        <p className="text-sm text-muted-foreground">{user.role}</p>
                                    </div>
                                </div>
                                <p className="mt-4 text-muted-foreground">"{user.text}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Animation + Shadow CSS */}
            <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 20s linear infinite;
        }

        .shadow-green-glow {
          box-shadow: 0 0 10px 2px rgba(66, 245, 93, 0.3);
        }
      `}</style>
        </section>
    );
};

export default Reviews;
