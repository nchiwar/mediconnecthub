import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Pill, 
  MapPin, 
  Star, 
  ShoppingCart,
  Truck,
  Clock,
  Filter,
  CheckCircle
} from "lucide-react";
import { CartDialog } from "@/components/pharmacy/CartDialog";
import { PrescriptionDetailsDialog } from "@/components/pharmacy/PrescriptionDetailsDialog";
import { OrderTrackingDialog } from "@/components/pharmacy/OrderTrackingDialog";
import { toast } from "sonner";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  pharmacy: string;
}

const medications = [
  { id: 1, name: "Lisinopril 10mg", category: "Blood Pressure", price: 12.99, pharmacy: "HealthPlus Pharmacy", distance: "0.5 miles", rating: 4.8, inStock: true, delivery: "30 min" },
  { id: 2, name: "Metformin 500mg", category: "Diabetes", price: 15.50, pharmacy: "CareRx Pharmacy", distance: "1.2 miles", rating: 4.9, inStock: true, delivery: "45 min" },
  { id: 3, name: "Atorvastatin 20mg", category: "Cholesterol", price: 18.99, pharmacy: "MediCare Plus", distance: "0.8 miles", rating: 4.7, inStock: true, delivery: "35 min" },
  { id: 4, name: "Amlodipine 5mg", category: "Blood Pressure", price: 11.50, pharmacy: "HealthPlus Pharmacy", distance: "0.5 miles", rating: 4.8, inStock: false, delivery: "Next day" },
  { id: 5, name: "Omeprazole 20mg", category: "Gastric", price: 14.25, pharmacy: "CareRx Pharmacy", distance: "1.2 miles", rating: 4.9, inStock: true, delivery: "40 min" },
  { id: 6, name: "Losartan 50mg", category: "Blood Pressure", price: 16.75, pharmacy: "MediCare Plus", distance: "0.8 miles", rating: 4.7, inStock: true, delivery: "35 min" },
  { id: 7, name: "Gabapentin 300mg", category: "Neurological", price: 22.99, pharmacy: "HealthPlus Pharmacy", distance: "0.5 miles", rating: 4.8, inStock: true, delivery: "30 min" },
  { id: 8, name: "Levothyroxine 50mcg", category: "Thyroid", price: 9.99, pharmacy: "CareRx Pharmacy", distance: "1.2 miles", rating: 4.9, inStock: true, delivery: "45 min" },
  { id: 9, name: "Sertraline 50mg", category: "Mental Health", price: 19.50, pharmacy: "MediCare Plus", distance: "0.8 miles", rating: 4.7, inStock: false, delivery: "Next day" },
  { id: 10, name: "Albuterol Inhaler", category: "Respiratory", price: 35.00, pharmacy: "HealthPlus Pharmacy", distance: "0.5 miles", rating: 4.8, inStock: true, delivery: "30 min" },
  { id: 11, name: "Hydrochlorothiazide 25mg", category: "Blood Pressure", price: 8.99, pharmacy: "CareRx Pharmacy", distance: "1.2 miles", rating: 4.9, inStock: true, delivery: "45 min" },
  { id: 12, name: "Simvastatin 40mg", category: "Cholesterol", price: 13.25, pharmacy: "MediCare Plus", distance: "0.8 miles", rating: 4.7, inStock: true, delivery: "35 min" },
];

const prescriptions = [
  { id: 1, medication: "Lisinopril 10mg", quantity: 30, refills: 2, doctor: "Dr. Sarah Johnson", expires: "2025-12-31", status: "active" },
  { id: 2, medication: "Metformin 500mg", quantity: 60, refills: 1, doctor: "Dr. Michael Chen", expires: "2025-11-15", status: "active" },
  { id: 3, medication: "Atorvastatin 20mg", quantity: 30, refills: 3, doctor: "Dr. Sarah Johnson", expires: "2026-03-01", status: "active" },
  { id: 4, medication: "Omeprazole 20mg", quantity: 30, refills: 0, doctor: "Dr. Emily Roberts", expires: "2025-06-15", status: "expired" },
];

const orders = [
  { id: "#3421", medication: "Lisinopril 10mg", pharmacy: "HealthPlus Pharmacy", status: "in-transit", eta: "Arriving in 15 min", tracking: "TR1234567890" },
  { id: "#3420", medication: "Atorvastatin 20mg", pharmacy: "MediCare Plus", status: "delivered", eta: "Delivered today", tracking: "TR1234567891" },
  { id: "#3419", medication: "Metformin 500mg", pharmacy: "CareRx Pharmacy", status: "processing", eta: "Ready in 20 min", tracking: "TR1234567892" },
];

const PharmacyMarketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [prescriptionDialogOpen, setPrescriptionDialogOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<typeof prescriptions[0] | null>(null);
  const [trackingDialogOpen, setTrackingDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);

  const addToCart = (med: typeof medications[0]) => {
    const existingItem = cartItems.find(item => item.id === med.id);
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === med.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, {
        id: med.id,
        name: med.name,
        price: med.price,
        quantity: 1,
        pharmacy: med.pharmacy
      }]);
    }
    toast.success(`${med.name} added to cart`);
  };

  const updateQuantity = (id: number, quantity: number) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    toast.success("Item removed from cart");
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const handleViewPrescription = (prescription: typeof prescriptions[0]) => {
    setSelectedPrescription(prescription);
    setPrescriptionDialogOpen(true);
  };

  const handleOrderRefill = (id: number) => {
    const prescription = prescriptions.find(p => p.id === id);
    if (prescription) {
      toast.success(`Refill ordered for ${prescription.medication}`);
    }
  };

  const handleTrackOrder = (order: typeof orders[0]) => {
    setSelectedOrder(order);
    setTrackingDialogOpen(true);
  };

  const filteredMedications = medications.filter(med =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    med.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cartItemIds = cartItems.map(item => item.id);
  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <DashboardLayout
      title="Pharmacy Marketplace"
      subtitle="Find medications and track deliveries"
      role="Patient"
    >
      {/* Search Bar */}
      <Card className="p-6 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search medications..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button className="gradient-primary text-white" onClick={() => setCartOpen(true)}>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Cart ({totalCartItems})
          </Button>
        </div>
      </Card>

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList>
          <TabsTrigger value="browse">Browse Medications</TabsTrigger>
          <TabsTrigger value="prescriptions">My Prescriptions</TabsTrigger>
          <TabsTrigger value="orders">Order Tracking</TabsTrigger>
        </TabsList>

        {/* Browse Medications */}
        <TabsContent value="browse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMedications.map((med) => (
              <Card key={med.id} className="p-6 hover:shadow-medium transition-smooth">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                    <Pill className="w-6 h-6 text-white" />
                  </div>
                  {med.inStock ? (
                    <Badge className="bg-accent/10 text-accent border-accent/20">
                      In Stock
                    </Badge>
                  ) : (
                    <Badge variant="outline">Out of Stock</Badge>
                  )}
                </div>

                <h3 className="text-lg font-semibold mb-1">{med.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{med.category}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Price</span>
                    <span className="text-lg font-bold text-primary">${med.price.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{med.pharmacy}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <span className="font-medium">{med.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{med.delivery}</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    {med.distance} away
                  </div>
                </div>

                <Button 
                  className="w-full gradient-secondary text-white"
                  disabled={!med.inStock}
                  onClick={() => addToCart(med)}
                >
                  {cartItemIds.includes(med.id) ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      In Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </>
                  )}
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* My Prescriptions */}
        <TabsContent value="prescriptions">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {prescriptions.map((prescription) => (
              <Card key={prescription.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                      <Pill className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{prescription.medication}</h3>
                      <p className="text-sm text-muted-foreground">
                        Prescribed by {prescription.doctor}
                      </p>
                    </div>
                  </div>
                  <Badge variant={prescription.status === "active" ? "default" : "secondary"}>
                    {prescription.status}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Quantity</span>
                    <span className="font-medium">{prescription.quantity} tablets</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Refills Remaining</span>
                    <span className="font-medium">{prescription.refills}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Expires</span>
                    <span className="font-medium">{prescription.expires}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    className="flex-1 gradient-primary text-white"
                    disabled={prescription.refills === 0 || prescription.status !== "active"}
                    onClick={() => handleOrderRefill(prescription.id)}
                  >
                    Order Refill
                  </Button>
                  <Button variant="outline" onClick={() => handleViewPrescription(prescription)}>
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Order Tracking */}
        <TabsContent value="orders">
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">Order {order.id}</h3>
                      <Badge 
                        variant={order.status === "delivered" ? "default" : "outline"}
                        className={order.status === "in-transit" ? "bg-blue-500/10 text-blue-500" : ""}
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{order.medication}</p>
                    <p className="text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3 inline mr-1" />
                      {order.pharmacy}
                    </p>
                  </div>
                  <div className="w-16 h-16 rounded-xl gradient-secondary flex items-center justify-center">
                    <Truck className="w-8 h-8 text-white" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">{order.eta}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Tracking: {order.tracking}
                  </span>
                </div>

                {order.status === "in-transit" && (
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delivery Progress</span>
                      <span className="font-medium">75%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "75%" }} />
                    </div>
                  </div>
                )}

                {order.status === "delivered" && (
                  <div className="flex items-center gap-2 p-3 bg-accent/10 rounded-lg mb-4">
                    <CheckCircle className="w-5 h-5 text-accent" />
                    <span className="text-sm font-medium text-accent">
                      Successfully delivered
                    </span>
                  </div>
                )}

                <div className="flex gap-2">
                  {order.status === "in-transit" && (
                    <Button variant="outline" className="flex-1" onClick={() => handleTrackOrder(order)}>
                      Track Live
                    </Button>
                  )}
                  <Button variant="outline" className="flex-1" onClick={() => toast.success("Receipt downloaded")}>
                    View Receipt
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => toast.info("Contacting pharmacy...")}>
                    Contact Pharmacy
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <CartDialog
        open={cartOpen}
        onOpenChange={setCartOpen}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onClearCart={clearCart}
      />

      <PrescriptionDetailsDialog
        open={prescriptionDialogOpen}
        onOpenChange={setPrescriptionDialogOpen}
        prescription={selectedPrescription}
        onOrderRefill={handleOrderRefill}
      />

      <OrderTrackingDialog
        open={trackingDialogOpen}
        onOpenChange={setTrackingDialogOpen}
        order={selectedOrder}
      />
    </DashboardLayout>
  );
};

export default PharmacyMarketplace;
