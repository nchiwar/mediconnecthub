import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  Pill,
  FileText,
  Truck
} from "lucide-react";
import { PrescriptionCard } from "@/components/prescriptions/PrescriptionCard";
import { InventoryManagement } from "@/components/inventory/InventoryManagement";
import { PharmacyReportsDialog } from "@/components/pharmacy/PharmacyReportsDialog";
import { DeliveryManagementDialog } from "@/components/pharmacy/DeliveryManagementDialog";
import { usePrescriptions } from "@/hooks/usePrescriptions";
import { useInventory } from "@/hooks/useInventory";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PharmacyDashboard = () => {
  const { user } = useAuth();
  const { prescriptions, updatePrescriptionStatus } = usePrescriptions();
  const [pharmacyId, setPharmacyId] = useState<string | null>(null);
  const { inventory, alerts, lowStockItems, criticalItems, outOfStockItems } = useInventory(pharmacyId);
  const [reportsOpen, setReportsOpen] = useState(false);
  const [deliveriesOpen, setDeliveriesOpen] = useState(false);

  useEffect(() => {
    const fetchPharmacyId = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('pharmacies')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      if (data) setPharmacyId(data.id);
    };
    fetchPharmacyId();
  }, [user]);

  const pharmacyPrescriptions = prescriptions.filter(p => 
    pharmacyId && p.pharmacy_id === pharmacyId
  );

  const pendingCount = pharmacyPrescriptions.filter(p => 
    ['sent_to_pharmacy', 'processing'].includes(p.status)
  ).length;

  const activeDeliveries = pharmacyPrescriptions.filter(p => 
    p.status === 'out_for_delivery'
  ).length;

  const handleNewPrescription = () => {
    toast.info("Navigate to prescriptions to receive new e-prescriptions from doctors");
  };

  const handleUpdateInventory = () => {
    // Scroll to inventory tab
    const inventoryTab = document.querySelector('[value="inventory"]');
    if (inventoryTab) {
      (inventoryTab as HTMLElement).click();
    }
    toast.success("Switched to inventory management");
  };

  return (
    <DashboardLayout
      title="Pharmacy Dashboard"
      subtitle="Manage prescriptions, inventory, and deliveries"
      role="Pharmacy"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Pending Prescriptions"
          value={pendingCount}
          icon={FileText}
          change={`${pharmacyPrescriptions.length} total`}
          trend="up"
        />
        <StatsCard
          title="Low Stock Items"
          value={lowStockItems.length + criticalItems.length}
          icon={AlertTriangle}
          change={`${criticalItems.length} critical`}
          trend="neutral"
        />
        <StatsCard
          title="Active Deliveries"
          value={activeDeliveries}
          icon={Truck}
          change="In transit"
          trend="neutral"
        />
        <StatsCard
          title="Inventory Items"
          value={inventory.length}
          icon={Package}
          change={`${outOfStockItems.length} out of stock`}
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Prescriptions */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">E-Prescriptions</h2>
              <div className="flex gap-2">
                <Input placeholder="Search prescriptions..." className="w-64" />
              </div>
            </div>
            <div className="space-y-4">
              {pharmacyPrescriptions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No prescriptions assigned to your pharmacy yet</p>
                </div>
              ) : (
                pharmacyPrescriptions.map((prescription) => (
                  <PrescriptionCard
                    key={prescription.id}
                    prescription={prescription}
                    showActions={true}
                    role="pharmacy"
                    onUpdateStatus={updatePrescriptionStatus}
                  />
                ))
              )}
            </div>
          </Card>

          {/* Inventory Management */}
          <Card className="p-6">
            <Tabs defaultValue="inventory">
              <TabsList className="mb-6">
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
              </TabsList>
              
              <TabsContent value="inventory">
                {pharmacyId ? (
                  <InventoryManagement pharmacyId={pharmacyId} />
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No pharmacy profile found</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="deliveries" className="space-y-3">
                {pharmacyPrescriptions.filter(p => p.status === 'out_for_delivery').length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Truck className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No active deliveries</p>
                  </div>
                ) : (
                  pharmacyPrescriptions
                    .filter(p => p.status === 'out_for_delivery')
                    .map((prescription) => (
                      <PrescriptionCard
                        key={prescription.id}
                        prescription={prescription}
                        showActions={true}
                        role="pharmacy"
                        onUpdateStatus={updatePrescriptionStatus}
                      />
                    ))
                )}
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Button 
                className="w-full gradient-primary text-white justify-start"
                onClick={handleNewPrescription}
              >
                <FileText className="w-4 h-4 mr-2" />
                New Prescription
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleUpdateInventory}
              >
                <Package className="w-4 h-4 mr-2" />
                Update Inventory
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setDeliveriesOpen(true)}
              >
                <Truck className="w-4 h-4 mr-2" />
                Manage Deliveries
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setReportsOpen(true)}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                View Reports
              </Button>
            </div>
          </Card>

          {/* Stock Alerts */}
          {alerts.length > 0 && (
            <Card className="p-6 border-destructive/20 bg-destructive/5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <h2 className="text-xl font-bold">Stock Alerts ({alerts.length})</h2>
              </div>
              <div className="space-y-3">
                {alerts.slice(0, 3).map((alert) => {
                  const item = inventory.find(i => i.id === alert.inventory_item_id);
                  return (
                    <div 
                      key={alert.id} 
                      className={`p-3 bg-background rounded-lg border ${
                        alert.alert_type === 'critical' || alert.alert_type === 'out_of_stock' 
                          ? 'border-destructive/20' 
                          : 'border-yellow-500/20'
                      }`}
                    >
                      <p className="text-sm font-medium">{item?.medication_name || 'Unknown'}</p>
                      <p className={`text-xs mt-1 ${
                        alert.alert_type === 'critical' || alert.alert_type === 'out_of_stock'
                          ? 'text-destructive'
                          : 'text-yellow-500'
                      }`}>
                        {alert.alert_type === 'out_of_stock' ? 'Out of stock' :
                         alert.alert_type === 'critical' ? `Critical: ${alert.current_stock} units` :
                         `Low Stock: ${alert.current_stock} units`}
                      </p>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Performance */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Today's Performance</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Orders Processed</span>
                <span className="font-semibold">{pharmacyPrescriptions.filter(p => p.status === 'delivered').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Deliveries Active</span>
                <span className="font-semibold">{activeDeliveries}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Inventory Items</span>
                <span className="font-semibold">{inventory.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Active Alerts</span>
                <span className="font-semibold text-destructive">{alerts.length}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <PharmacyReportsDialog
        open={reportsOpen}
        onOpenChange={setReportsOpen}
      />
      <DeliveryManagementDialog
        open={deliveriesOpen}
        onOpenChange={setDeliveriesOpen}
      />
    </DashboardLayout>
  );
};

export default PharmacyDashboard;
