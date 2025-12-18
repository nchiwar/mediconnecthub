import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Activity, 
  Clock, 
  AlertCircle,
  Heart,
  Thermometer,
  Droplet,
  TrendingUp
} from "lucide-react";

const assignedPatients = [
  {
    id: 1,
    name: "Mary Johnson",
    room: "ICU-204",
    condition: "Post-Surgery",
    priority: "high",
    avatar: "MJ",
    vitals: { bp: "140/90", temp: "99.1°F", hr: "88 bpm", spo2: "96%" }
  },
  {
    id: 2,
    name: "David Miller",
    room: "Ward-312",
    condition: "Pneumonia",
    priority: "medium",
    avatar: "DM",
    vitals: { bp: "120/80", temp: "100.4°F", hr: "92 bpm", spo2: "94%" }
  },
  {
    id: 3,
    name: "Lisa Anderson",
    room: "Ward-205",
    condition: "Recovery",
    priority: "low",
    avatar: "LA",
    vitals: { bp: "118/75", temp: "98.6°F", hr: "72 bpm", spo2: "98%" }
  }
];

const tasks = [
  { id: 1, task: "Administer medication to Room 204", time: "10:00 AM", status: "pending" },
  { id: 2, task: "Check vitals - Ward 312", time: "10:30 AM", status: "pending" },
  { id: 3, task: "Update patient records", time: "11:00 AM", status: "completed" },
  { id: 4, task: "Assist with dressing change - Room 205", time: "02:00 PM", status: "pending" }
];

const NurseDashboard = () => {
  return (
    <DashboardLayout
      title="Nurse Dashboard"
      subtitle="Patient care and vitals monitoring"
      role="Nurse"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Assigned Patients"
          value={12}
          icon={Users}
          change="3 critical"
          trend="neutral"
        />
        <StatsCard
          title="Pending Tasks"
          value={8}
          icon={Clock}
          change="2 urgent"
          trend="neutral"
        />
        <StatsCard
          title="Vitals Logged Today"
          value={36}
          icon={Activity}
          change="+12 from yesterday"
          trend="up"
        />
        <StatsCard
          title="Shift Progress"
          value="65%"
          icon={TrendingUp}
          change="5 hours remaining"
          trend="neutral"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Assigned Patients */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Assigned Patients</h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="space-y-4">
              {assignedPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="p-4 rounded-xl border border-border hover:border-primary/50 transition-smooth"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12 bg-primary">
                        <AvatarFallback className="text-white font-semibold">
                          {patient.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{patient.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {patient.room} • {patient.condition}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={
                        patient.priority === "high" ? "destructive" : 
                        patient.priority === "medium" ? "default" : 
                        "outline"
                      }
                    >
                      {patient.priority}
                    </Badge>
                  </div>
                  
                  {/* Vitals */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">BP</p>
                        <p className="text-sm font-semibold">{patient.vitals.bp}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Temp</p>
                        <p className="text-sm font-semibold">{patient.vitals.temp}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Heart</p>
                        <p className="text-sm font-semibold">{patient.vitals.hr}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplet className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">SpO2</p>
                        <p className="text-sm font-semibold">{patient.vitals.spo2}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="flex-1 gradient-primary text-white">
                      Update Vitals
                    </Button>
                    <Button size="sm" variant="outline">
                      View History
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Vitals Entry */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Quick Vitals Entry</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Blood Pressure</label>
                <Input placeholder="120/80" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Temperature</label>
                <Input placeholder="98.6°F" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Heart Rate</label>
                <Input placeholder="75 bpm" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">SpO2</label>
                <Input placeholder="98%" />
              </div>
            </div>
            <Button className="w-full mt-4 gradient-secondary text-white">
              Log Vitals
            </Button>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Tasks */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Today's Tasks</h2>
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3 rounded-lg border ${
                    task.status === "completed" 
                      ? "bg-accent/5 border-accent/20" 
                      : "border-border"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={task.status === "completed"}
                      className="mt-1"
                      readOnly
                    />
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        task.status === "completed" ? "line-through text-muted-foreground" : ""
                      }`}>
                        {task.task}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {task.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Alerts */}
          <Card className="p-6 border-destructive/20 bg-destructive/5">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <h2 className="text-xl font-bold">Active Alerts</h2>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-background rounded-lg border border-destructive/20">
                <p className="text-sm font-medium">ICU-204: High BP Alert</p>
                <p className="text-xs text-muted-foreground mt-1">BP: 160/95 - Requires attention</p>
              </div>
              <div className="p-3 bg-background rounded-lg border border-destructive/20">
                <p className="text-sm font-medium">Ward-312: Fever Alert</p>
                <p className="text-xs text-muted-foreground mt-1">Temp: 102.1°F - Medication needed</p>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Shift Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Patients Checked</span>
                <span className="font-semibold">9/12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Medications Given</span>
                <span className="font-semibold">18</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Vitals Logged</span>
                <span className="font-semibold">36</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Hours Worked</span>
                <span className="font-semibold">6.5/10</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NurseDashboard;
