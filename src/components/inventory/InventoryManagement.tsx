import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, Plus, Search, AlertTriangle, ArrowUp, ArrowDown, 
  RefreshCw, Trash2, Edit, TrendingDown, TrendingUp, Clock
} from "lucide-react";
import { useInventory, InventoryItem } from "@/hooks/useInventory";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface InventoryManagementProps {
  pharmacyId: string;
}

export function InventoryManagement({ pharmacyId }: InventoryManagementProps) {
  const { 
    inventory, 
    alerts, 
    loading, 
    lowStockItems,
    outOfStockItems,
    criticalItems,
    addInventoryItem, 
    updateStock, 
    acknowledgeAlert,
    deleteItem
  } = useInventory(pharmacyId);
  
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [stockDialogOpen, setStockDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [stockAction, setStockAction] = useState<"in" | "out" | "adjustment">("in");
  const [stockQuantity, setStockQuantity] = useState("");
  const [stockNotes, setStockNotes] = useState("");

  // New item form state
  const [newItem, setNewItem] = useState({
    medication_name: "",
    sku: "",
    category: "",
    current_stock: 0,
    reorder_level: 50,
    reorder_quantity: 100,
    unit_price: 0,
    supplier: ""
  });

  const filteredInventory = inventory.filter(item =>
    item.medication_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddItem = async () => {
    if (!newItem.medication_name) {
      toast({ title: "Error", description: "Medication name is required", variant: "destructive" });
      return;
    }

    try {
      await addInventoryItem({
        ...newItem,
        pharmacy_id: pharmacyId,
        sku: newItem.sku || null,
        category: newItem.category || null,
        unit_price: newItem.unit_price || null,
        supplier: newItem.supplier || null,
        expiry_date: null,
        last_restocked: null,
        is_active: true
      });
      toast({ title: "Success", description: "Item added to inventory" });
      setAddDialogOpen(false);
      setNewItem({
        medication_name: "",
        sku: "",
        category: "",
        current_stock: 0,
        reorder_level: 50,
        reorder_quantity: 100,
        unit_price: 0,
        supplier: ""
      });
    } catch (error) {
      console.error('Error adding item:', error);
      toast({ title: "Error", description: "Failed to add item", variant: "destructive" });
    }
  };

  const handleStockUpdate = async () => {
    if (!selectedItem || !stockQuantity) return;

    try {
      await updateStock(
        selectedItem.id,
        parseInt(stockQuantity),
        stockAction,
        stockNotes || undefined
      );
      toast({ 
        title: "Stock Updated", 
        description: `${stockAction === 'in' ? 'Added' : stockAction === 'out' ? 'Removed' : 'Adjusted'} stock for ${selectedItem.medication_name}` 
      });
      setStockDialogOpen(false);
      setSelectedItem(null);
      setStockQuantity("");
      setStockNotes("");
    } catch (error) {
      console.error('Error updating stock:', error);
      toast({ title: "Error", description: "Failed to update stock", variant: "destructive" });
    }
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.current_stock <= 0) return { label: "Out of Stock", variant: "destructive" as const, icon: AlertTriangle };
    if (item.current_stock <= item.reorder_level * 0.25) return { label: "Critical", variant: "destructive" as const, icon: TrendingDown };
    if (item.current_stock <= item.reorder_level) return { label: "Low Stock", variant: "secondary" as const, icon: TrendingDown };
    return { label: "In Stock", variant: "default" as const, icon: TrendingUp };
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading inventory...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Items</p>
              <p className="text-2xl font-bold">{inventory.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <TrendingDown className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Low Stock</p>
              <p className="text-2xl font-bold">{lowStockItems.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Critical</p>
              <p className="text-2xl font-bold">{criticalItems.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-600/10">
              <Package className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Out of Stock</p>
              <p className="text-2xl font-bold">{outOfStockItems.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Active Alerts ({alerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.slice(0, 5).map((alert) => {
                const item = inventory.find(i => i.id === alert.inventory_item_id);
                return (
                  <div 
                    key={alert.id} 
                    className="flex items-center justify-between p-3 bg-background rounded-lg border"
                  >
                    <div>
                      <p className="font-medium">{item?.medication_name || 'Unknown Item'}</p>
                      <p className="text-sm text-muted-foreground">
                        {alert.alert_type === 'out_of_stock' ? 'Out of stock' :
                         alert.alert_type === 'critical' ? `Critical: ${alert.current_stock} units` :
                         `Low stock: ${alert.current_stock}/${alert.reorder_level} units`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        Dismiss
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => {
                          setSelectedItem(item || null);
                          setStockAction("in");
                          setStockDialogOpen(true);
                        }}
                      >
                        Restock
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Inventory Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Inventory Items</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search inventory..."
                  className="pl-10 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Inventory Item</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Medication Name *</Label>
                      <Input
                        value={newItem.medication_name}
                        onChange={(e) => setNewItem({ ...newItem, medication_name: e.target.value })}
                        placeholder="e.g., Lisinopril 10mg"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>SKU</Label>
                        <Input
                          value={newItem.sku}
                          onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                          placeholder="e.g., MED-001"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Input
                          value={newItem.category}
                          onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                          placeholder="e.g., Cardiovascular"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Initial Stock</Label>
                        <Input
                          type="number"
                          value={newItem.current_stock}
                          onChange={(e) => setNewItem({ ...newItem, current_stock: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Reorder Level</Label>
                        <Input
                          type="number"
                          value={newItem.reorder_level}
                          onChange={(e) => setNewItem({ ...newItem, reorder_level: parseInt(e.target.value) || 50 })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Unit Price ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={newItem.unit_price}
                          onChange={(e) => setNewItem({ ...newItem, unit_price: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Supplier</Label>
                        <Input
                          value={newItem.supplier}
                          onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                          placeholder="Supplier name"
                        />
                      </div>
                    </div>
                    <Button onClick={handleAddItem} className="w-full">
                      Add to Inventory
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredInventory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No inventory items found</p>
              </div>
            ) : (
              filteredInventory.map((item) => {
                const status = getStockStatus(item);
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        status.variant === 'destructive' ? 'bg-destructive/10' :
                        status.variant === 'secondary' ? 'bg-yellow-500/10' :
                        'bg-primary/10'
                      }`}>
                        <Package className={`w-6 h-6 ${
                          status.variant === 'destructive' ? 'text-destructive' :
                          status.variant === 'secondary' ? 'text-yellow-500' :
                          'text-primary'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{item.medication_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.sku && `SKU: ${item.sku} • `}
                          {item.category && `${item.category} • `}
                          Reorder at: {item.reorder_level}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold">{item.current_stock}</p>
                        <p className="text-xs text-muted-foreground">units</p>
                      </div>
                      <Badge variant={status.variant}>{status.label}</Badge>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setSelectedItem(item);
                            setStockAction("in");
                            setStockDialogOpen(true);
                          }}
                          title="Add Stock"
                        >
                          <ArrowUp className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setSelectedItem(item);
                            setStockAction("out");
                            setStockDialogOpen(true);
                          }}
                          title="Remove Stock"
                        >
                          <ArrowDown className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stock Update Dialog */}
      <Dialog open={stockDialogOpen} onOpenChange={setStockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {stockAction === 'in' ? 'Add Stock' : stockAction === 'out' ? 'Remove Stock' : 'Adjust Stock'}
              {selectedItem && ` - ${selectedItem.medication_name}`}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Action</Label>
              <Select value={stockAction} onValueChange={(v) => setStockAction(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in">Add Stock (Restock)</SelectItem>
                  <SelectItem value="out">Remove Stock (Sale/Usage)</SelectItem>
                  <SelectItem value="adjustment">Stock Adjustment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{stockAction === 'adjustment' ? 'New Stock Level' : 'Quantity'}</Label>
              <Input
                type="number"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                placeholder={stockAction === 'adjustment' ? 'Enter new stock level' : 'Enter quantity'}
              />
            </div>
            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Input
                value={stockNotes}
                onChange={(e) => setStockNotes(e.target.value)}
                placeholder="e.g., Monthly restock order"
              />
            </div>
            {selectedItem && (
              <div className="p-3 bg-muted rounded-lg text-sm">
                <p>Current Stock: <strong>{selectedItem.current_stock}</strong></p>
                {stockQuantity && stockAction !== 'adjustment' && (
                  <p>New Stock: <strong>
                    {stockAction === 'in' 
                      ? selectedItem.current_stock + parseInt(stockQuantity) 
                      : Math.max(0, selectedItem.current_stock - parseInt(stockQuantity))}
                  </strong></p>
                )}
              </div>
            )}
            <Button onClick={handleStockUpdate} className="w-full">
              Update Stock
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
