import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Truck, 
  MapPin, 
  Clock, 
  Phone,
  CheckCircle,
  XCircle,
  Search
} from "lucide-react";
import { toast } from "sonner";

interface Delivery {
  id: string;
  orderNumber: string;
  customer: string;
  address: string;
  medication: string;
  status: "pending" | "in-transit" | "delivered" | "failed";
  driver: string;
  eta: string;
}

interface DeliveryManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mockDeliveries: Delivery[] = [
  {
    id: "1",
    orderNumber: "#3421",
    customer: "John Smith",
    address: "123 Main St, Apt 4B",
    medication: "Lisinopril 10mg",
    status: "in-transit",
    driver: "Mike Johnson",
    eta: "15 min"
  },
  {
    id: "2",
    orderNumber: "#3420",
    customer: "Sarah Davis",
    address: "456 Oak Ave",
    medication: "Metformin 500mg",
    status: "pending",
    driver: "Unassigned",
    eta: "30 min"
  },
  {
    id: "3",
    orderNumber: "#3419",
    customer: "Robert Brown",
    address: "789 Pine Rd",
    medication: "Atorvastatin 20mg",
    status: "delivered",
    driver: "Lisa Chen",
    eta: "Completed"
  },
  {
    id: "4",
    orderNumber: "#3418",
    customer: "Emily Wilson",
    address: "321 Elm St",
    medication: "Amlodipine 5mg",
    status: "in-transit",
    driver: "Mike Johnson",
    eta: "25 min"
  }
];

export const DeliveryManagementDialog = ({
  open,
  onOpenChange
}: DeliveryManagementDialogProps) => {
  const [deliveries, setDeliveries] = useState<Delivery[]>(mockDeliveries);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDeliveries = deliveries.filter(d => 
    d.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.medication.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const updateStatus = (id: string, newStatus: Delivery["status"]) => {
    setDeliveries(prev => prev.map(d => 
      d.id === id ? { ...d, status: newStatus } : d
    ));
    toast.success(`Delivery status updated to ${newStatus}`);
  };

  const getStatusColor = (status: Delivery["status"]) => {
    switch (status) {
      case "pending": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "in-transit": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "delivered": return "bg-accent/10 text-accent border-accent/20";
      case "failed": return "bg-destructive/10 text-destructive border-destructive/20";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Delivery Management
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search deliveries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            <div className="p-3 bg-muted/50 rounded-lg text-center">
              <p className="text-xl font-bold">{deliveries.filter(d => d.status === "pending").length}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg text-center">
              <p className="text-xl font-bold text-blue-500">{deliveries.filter(d => d.status === "in-transit").length}</p>
              <p className="text-xs text-muted-foreground">In Transit</p>
            </div>
            <div className="p-3 bg-accent/10 rounded-lg text-center">
              <p className="text-xl font-bold text-accent">{deliveries.filter(d => d.status === "delivered").length}</p>
              <p className="text-xs text-muted-foreground">Delivered</p>
            </div>
            <div className="p-3 bg-destructive/10 rounded-lg text-center">
              <p className="text-xl font-bold text-destructive">{deliveries.filter(d => d.status === "failed").length}</p>
              <p className="text-xs text-muted-foreground">Failed</p>
            </div>
          </div>

          {/* Delivery List */}
          <div className="space-y-3">
            {filteredDeliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="p-4 border border-border rounded-xl space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{delivery.orderNumber}</span>
                      <Badge className={getStatusColor(delivery.status)}>
                        {delivery.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium mt-1">{delivery.customer}</p>
                    <p className="text-sm text-muted-foreground">{delivery.medication}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {delivery.eta}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Driver: {delivery.driver}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {delivery.address}
                </div>

                {delivery.status !== "delivered" && delivery.status !== "failed" && (
                  <div className="flex gap-2">
                    {delivery.status === "pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(delivery.id, "in-transit")}
                      >
                        <Truck className="w-3 h-3 mr-1" />
                        Start Delivery
                      </Button>
                    )}
                    {delivery.status === "in-transit" && (
                      <>
                        <Button
                          size="sm"
                          className="gradient-primary text-white"
                          onClick={() => updateStatus(delivery.id, "delivered")}
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Mark Delivered
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateStatus(delivery.id, "failed")}
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Failed
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="outline">
                      <Phone className="w-3 h-3 mr-1" />
                      Call
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
