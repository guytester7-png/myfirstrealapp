import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { useCourse, useCreatePurchase } from "@/hooks/use-courses";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2, Ticket, Tag } from "lucide-react";
import { getPaddleInstance } from "@/lib/paddle";

export default function CourseDetail() {
  const [, params] = useRoute("/courses/:id");
  const id = parseInt(params?.id || "0");
  const { data: course, isLoading } = useCourse(id);
  const { toast } = useToast();
  
  const [fairPrice, setFairPrice] = useState<string>("");
  const [couponCode, setCouponCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [discountApplied, setDiscountApplied] = useState(false);

  useEffect(() => {
    if (course) {
      setFairPrice((course.price / 100).toString());
    }
  }, [course]);

  const basePrice = course ? course.price / 100 : 25;
  const currentPrice = parseFloat(fairPrice) || basePrice;
  const finalPrice = discountApplied ? currentPrice * 0.5 : currentPrice;

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "MO50") {
      setDiscountApplied(true);
      toast({
        title: "Coupon Applied!",
        description: "50% discount has been applied to your price.",
        className: "bg-green-50 border-green-200",
      });
    } else {
      setDiscountApplied(false);
      toast({
        title: "Invalid Coupon",
        description: "That code didn't work. Try MO50.",
        variant: "destructive",
      });
    }
  };

  const handlePurchase = async () => {
    if (!course) return;
    setIsProcessing(true);

    try {
      const paddle = await getPaddleInstance();
      if (!paddle) throw new Error("Paddle failed to initialize");

      // In a real app, we would create a transaction on the backend with the custom price
      // For this frontend-only demo integration, we open the standard product checkout
      // We pass customData to indicate the user's intent for "Fair Price"
      
      await paddle.Checkout.open({
        items: [{ priceId: course.paddleProductId, quantity: 1 }],
        customData: {
          intendedPrice: finalPrice.toString(),
          coupon: discountApplied ? "MO50" : "NONE",
          courseId: course.id.toString(),
        },
      });
      
      // Note: We're not calling createPurchase mutation here because Paddle webhook 
      // usually handles the fulfillment on the backend.
      
    } catch (error) {
      console.error(error);
      toast({
        title: "Checkout Failed",
        description: "Could not open checkout window. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading || !course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Column: Course Info */}
          <div className="space-y-6">
            <div className="aspect-video rounded-2xl overflow-hidden bg-muted shadow-xl">
               {/* Fallback image for course details */}
              <img 
                src={course.imageUrl || "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&q=80"} 
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-4xl font-display font-bold mb-4">{course.title}</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {course.description}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-secondary/30 p-4 rounded-xl border">
                <div className="text-sm text-muted-foreground font-medium mb-1">Duration</div>
                <div className="font-semibold text-lg">12 Weeks</div>
              </div>
              <div className="bg-secondary/30 p-4 rounded-xl border">
                <div className="text-sm text-muted-foreground font-medium mb-1">Level</div>
                <div className="font-semibold text-lg">Beginner to Pro</div>
              </div>
            </div>
          </div>

          {/* Right Column: Purchase Card */}
          <div className="lg:sticky lg:top-24">
            <Card className="shadow-2xl border-primary/10 overflow-hidden">
              <div className="bg-primary/5 p-6 border-b border-primary/10">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Ticket className="h-5 w-5 text-primary" />
                  Enrollment Options
                </h2>
              </div>
              
              <CardContent className="p-6 space-y-6">
                
                {/* Fair Price Input */}
                <div className="space-y-3">
                  <Label htmlFor="price" className="text-base font-semibold">
                    Name your fair price
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    We believe in accessible education. The base price is ${basePrice}, but you can pay more to support us.
                  </p>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
                    <Input
                      id="price"
                      type="number"
                      min={basePrice}
                      value={fairPrice}
                      onChange={(e) => setFairPrice(e.target.value)}
                      className="pl-8 text-lg font-bold h-12"
                    />
                  </div>
                </div>

                <Separator />

                {/* Coupon Input */}
                <div className="space-y-3">
                  <Label htmlFor="coupon" className="text-base font-semibold flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Have a coupon?
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="coupon"
                      placeholder="Enter code (e.g. MO50)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="uppercase"
                      disabled={discountApplied}
                    />
                    <Button 
                      variant="secondary" 
                      onClick={handleApplyCoupon}
                      disabled={!couponCode || discountApplied}
                    >
                      Apply
                    </Button>
                  </div>
                  {discountApplied && (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 p-2 rounded-lg text-sm font-medium animate-in fade-in slide-in-from-top-1">
                      <CheckCircle2 className="h-4 w-4" />
                      50% Discount Applied!
                    </div>
                  )}
                </div>

                {/* Price Summary */}
                <div className="bg-muted/30 rounded-xl p-4 space-y-2 border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${currentPrice.toFixed(2)}</span>
                  </div>
                  {discountApplied && (
                    <div className="flex justify-between text-sm text-green-600 font-medium">
                      <span>Discount (50%)</span>
                      <span>-${(currentPrice * 0.5).toFixed(2)}</span>
                    </div>
                  )}
                  <Separator className="my-2" />
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-display font-bold text-3xl text-primary">
                      ${finalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

              </CardContent>

              <CardFooter className="p-6 bg-muted/20 border-t">
                <Button 
                  className="w-full h-14 text-lg shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all" 
                  onClick={handlePurchase}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Proceed to Payment"
                  )}
                </Button>
              </CardFooter>
            </Card>

            <p className="text-center text-xs text-muted-foreground mt-4">
              Secure payment powered by Paddle. 30-day money-back guarantee.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
