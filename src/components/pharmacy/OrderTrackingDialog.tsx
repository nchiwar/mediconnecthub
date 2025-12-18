import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Truck, 
  MapPin, 
  Clock, 
  Phone, 
  CheckCircle,
  Package,
  Home
} from "lucide-react";

interface Order {
  id: string;
  medication: string;
  pharmacy: string;
  status: string;
  eta: string;
  tracking: string;
}

interface OrderTrackingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
}

export const OrderTrackingDialog = ({
  open,
  onOpenChange,
  order
}: OrderTrackingDialogProps) => {
  if (!order) return null;

  const trackingSteps = [
    { label: "Order Placed", completed: true, icon: Package },
    { label: "Processing", completed: true, icon: Clock },
    { label: "Out for Delivery", completed: order.status === "in-transit" || order.status === "delivered", icon: Truck },
    { label: "Delivered", completed: order.status === "delivered", icon: Home },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Track Order {order.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-xl">
            <h3 className="font-semibold">{order.medication}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3" />
              {order.pharmacy}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={order.status === "delivered" ? "default" : "outline"}>
                {order.status}
              </Badge>
              <span className="text-sm text-muted-foreground">{order.eta}</span>
            </div>
          </div>

          <Separator />

          {/* Tracking Timeline */}
          <div className="space-y-4">
            <h4 className="font-semibold">Delivery Progress</h4>
            <div className="relative">
              {trackingSteps.map((step, index) => (
                <div key={step.label} className="flex items-start gap-3 pb-4 last:pb-0">
                  <div className="relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.completed ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <step.icon className="w-4 h-4" />
                      )}
                    </div>
                    {index < trackingSteps.length - 1 && (
                      <div className={`absolute left-1/2 top-8 w-0.5 h-6 -translate-x-1/2 ${
                        step.completed ? 'bg-primary' : 'bg-muted'
                      }`} />
                    )}
                  </div>
                  <div className="pt-1">
                    <p className={`font-medium ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.label}
                    </p>
                    {step.completed && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {step.label === "Delivered" ? "Today at 2:30 PM" : 
                         step.label === "Out for Delivery" ? "Today at 1:45 PM" :
                         step.label === "Processing" ? "Today at 12:00 PM" :
                         "Today at 11:30 AM"}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tracking Number</span>
              <span className="font-mono">{order.tracking}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              <Phone className="w-4 h-4 mr-2" />
              Contact Pharmacy
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
