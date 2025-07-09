import { ShoppingBag } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function EmptyCart() {
    return (
        <div className="container mx-auto px-4 py-16 text-center max-w-md">
            <div className="flex justify-center">
                <div className="h-24 w-24 rounded-full bg-green-50 flex items-center justify-center mb-6">
                    <ShoppingBag className="h-12 w-12 text-green-600" />
                </div>
            </div>
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">Looks like you haven't added any fresh produce to your cart yet.</p>
            <Button asChild size="lg" className="gap-2">
                <Link href="/products">
                    <ShoppingBag className="h-4 w-4" />
                    Browse Marketplace
                </Link>
            </Button>
        </div>
    )
}
