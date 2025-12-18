import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
}

export const StatsCard = ({ title, value, change, icon: Icon, trend = "neutral" }: StatsCardProps) => {
  const trendColors = {
    up: "text-accent",
    down: "text-destructive",
    neutral: "text-muted-foreground"
  };

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Card className="p-6 hover:shadow-medium transition-smooth">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <h3 className="text-3xl font-bold mb-2">{value}</h3>
            {change && (
              <p className={`text-sm ${trendColors[trend]}`}>
                {change}
              </p>
            )}
          </div>
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
