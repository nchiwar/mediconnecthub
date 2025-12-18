import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown,
  Users,
  Bed,
  Activity,
  DollarSign,
  Clock,
  Calendar
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const admissionData = [
  { month: "Jan", admissions: 245, discharges: 230 },
  { month: "Feb", admissions: 267, discharges: 254 },
  { month: "Mar", admissions: 298, discharges: 285 },
  { month: "Apr", admissions: 310, discharges: 295 },
  { month: "May", admissions: 325, discharges: 318 },
  { month: "Jun", admissions: 340, discharges: 330 },
];

const departmentData = [
  { name: "Emergency", patients: 450, color: "#ef4444" },
  { name: "ICU", patients: 120, color: "#f97316" },
  { name: "General Ward", patients: 380, color: "#22c55e" },
  { name: "Pediatrics", patients: 210, color: "#3b82f6" },
  { name: "Surgery", patients: 175, color: "#8b5cf6" },
];

const revenueData = [
  { month: "Jan", revenue: 245000 },
  { month: "Feb", revenue: 267000 },
  { month: "Mar", revenue: 298000 },
  { month: "Apr", revenue: 310000 },
  { month: "May", revenue: 325000 },
  { month: "Jun", revenue: 340000 },
];

interface AnalyticsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AnalyticsDialog = ({ open, onOpenChange }: AnalyticsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Analytics Report
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">1,335</p>
                  <p className="text-xs text-muted-foreground">Total Patients</p>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-green-500">
                <TrendingUp className="w-3 h-3" />
                <span>+12% vs last month</span>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Bed className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">80%</p>
                  <p className="text-xs text-muted-foreground">Occupancy Rate</p>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-green-500">
                <TrendingUp className="w-3 h-3" />
                <span>Optimal range</span>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">4.2</p>
                  <p className="text-xs text-muted-foreground">Avg. Stay (days)</p>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-red-500">
                <TrendingDown className="w-3 h-3" />
                <span>-0.3 vs last month</span>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">$340K</p>
                  <p className="text-xs text-muted-foreground">Monthly Revenue</p>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-green-500">
                <TrendingUp className="w-3 h-3" />
                <span>+8% vs last month</span>
              </div>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Admissions vs Discharges */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Admissions vs Discharges</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={admissionData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Line type="monotone" dataKey="admissions" stroke="hsl(var(--primary))" strokeWidth={2} />
                  <Line type="monotone" dataKey="discharges" stroke="hsl(var(--accent))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-sm">Admissions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  <span className="text-sm">Discharges</span>
                </div>
              </div>
            </Card>

            {/* Department Distribution */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Patients by Department</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="patients"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
                {departmentData.map((dept) => (
                  <div key={dept.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }} />
                    <span className="text-xs">{dept.name}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Revenue Chart */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Monthly Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={(value) => `$${value/1000}K`} />
                <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
