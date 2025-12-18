import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus,
  Truck,
  CreditCard
} from "lucide-react";
import { toast } from "sonner";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  pharmacy: string;
}

interface CartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onClearCart: () => void;
}

export const CartDialog = ({ 
  open, 
  onOpenChange, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem,
  onClearCart 
}: CartDialogProps) => {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = cartItems.length > 0 ? 5.99 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    toast.success("Order placed successfully! You'll receive a confirmation email shortly.");
    onClearCart();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Your Cart ({cartItems.length} items)
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Your cart is empty</p>
              <p className="text-sm">Add medications to get started</p>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 rounded-xl border border-border"
                  >
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                      <span className="text-2xl">💊</span>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.pharmacy}</p>
                      <p className="text-primary font-semibold">${item.price.toFixed(2)}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => onRemoveItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Delivery Address */}
              <div>
                <label className="text-sm font-medium">Delivery Address</label>
                <Input 
                  placeholder="Enter your delivery address" 
                  className="mt-2"
                />
              </div>

              <Separator />

              {/* Order Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Truck className="w-3 h-3" />
                    Delivery Fee
                  </span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="gap-2">
          {cartItems.length > 0 && (
            <>
              <Button variant="outline" onClick={onClearCart}>
                Clear Cart
              </Button>
              <Button className="gradient-primary text-white" onClick={handleCheckout}>
                <CreditCard className="w-4 h-4 mr-2" />
                Checkout (${total.toFixed(2)})
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
