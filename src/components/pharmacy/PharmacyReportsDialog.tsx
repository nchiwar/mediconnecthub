import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  DollarSign, 
  Package, 
  Truck,
  Calendar,
  Download
} from "lucide-react";
import { toast } from "sonner";

interface PharmacyReportsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PharmacyReportsDialog = ({
  open,
  onOpenChange
}: PharmacyReportsDialogProps) => {
  const handleExport = (reportType: string) => {
    toast.success(`${reportType} report exported successfully`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Pharmacy Reports
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="sales" className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Today's Sales</p>
                    <p className="text-2xl font-bold">$1,245.00</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Package className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Orders Filled</p>
                    <p className="text-2xl font-bold">34</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-4">
              <h4 className="font-semibold mb-3">Weekly Sales Summary</h4>
              <div className="space-y-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                  <div key={day} className="flex items-center gap-3">
                    <span className="w-8 text-sm text-muted-foreground">{day}</span>
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${[65, 80, 45, 90, 70, 55, 40][i]}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-16 text-right">
                      ${[845, 1120, 560, 1340, 920, 680, 490][i]}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Button className="w-full" onClick={() => handleExport("Sales")}>
              <Download className="w-4 h-4 mr-2" />
              Export Sales Report
            </Button>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <p className="text-3xl font-bold text-primary">156</p>
                <p className="text-sm text-muted-foreground">Total Items</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-3xl font-bold text-yellow-500">12</p>
                <p className="text-sm text-muted-foreground">Low Stock</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-3xl font-bold text-destructive">3</p>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
              </Card>
            </div>

            <Card className="p-4">
              <h4 className="font-semibold mb-3">Top Moving Items</h4>
              <div className="space-y-3">
                {[
                  { name: "Lisinopril 10mg", sold: 145, stock: 89 },
                  { name: "Metformin 500mg", sold: 132, stock: 156 },
                  { name: "Atorvastatin 20mg", sold: 98, stock: 45 },
                  { name: "Amlodipine 5mg", sold: 87, stock: 78 },
                  { name: "Omeprazole 20mg", sold: 76, stock: 92 },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <span className="text-sm">{item.name}</span>
                    <div className="flex gap-4 text-sm">
                      <span className="text-muted-foreground">Sold: {item.sold}</span>
                      <span className="text-muted-foreground">Stock: {item.stock}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Button className="w-full" onClick={() => handleExport("Inventory")}>
              <Download className="w-4 h-4 mr-2" />
              Export Inventory Report
            </Button>
          </TabsContent>

          <TabsContent value="deliveries" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Deliveries Today</p>
                    <p className="text-2xl font-bold">18</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Delivery Time</p>
                    <p className="text-2xl font-bold">32 min</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-4">
              <h4 className="font-semibold mb-3">Delivery Performance</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">On-Time Deliveries</span>
                  <span className="font-semibold text-accent">94%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Customer Satisfaction</span>
                  <span className="font-semibold text-accent">4.8/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Failed Deliveries</span>
                  <span className="font-semibold text-destructive">2</span>
                </div>
              </div>
            </Card>

            <Button className="w-full" onClick={() => handleExport("Deliveries")}>
              <Download className="w-4 h-4 mr-2" />
              Export Deliveries Report
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
