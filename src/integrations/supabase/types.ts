export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          blockchain_hash: string | null
          created_at: string
          doctor_id: string
          duration_minutes: number | null
          id: string
          notes: string | null
          patient_id: string
          prescription: string | null
          status: Database["public"]["Enums"]["appointment_status"] | null
          symptoms: string | null
          type: string | null
          updated_at: string
        }
        Insert: {
          appointment_date: string
          blockchain_hash?: string | null
          created_at?: string
          doctor_id: string
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          patient_id: string
          prescription?: string | null
          status?: Database["public"]["Enums"]["appointment_status"] | null
          symptoms?: string | null
          type?: string | null
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          blockchain_hash?: string | null
          created_at?: string
          doctor_id?: string
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          patient_id?: string
          prescription?: string | null
          status?: Database["public"]["Enums"]["appointment_status"] | null
          symptoms?: string | null
          type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          available_slots: Json | null
          bio: string | null
          consultation_fee: number | null
          created_at: string
          id: string
          license_number: string
          rating: number | null
          specialty_id: string | null
          updated_at: string
          user_id: string
          years_experience: number | null
        }
        Insert: {
          available_slots?: Json | null
          bio?: string | null
          consultation_fee?: number | null
          created_at?: string
          id?: string
          license_number: string
          rating?: number | null
          specialty_id?: string | null
          updated_at?: string
          user_id: string
          years_experience?: number | null
        }
        Update: {
          available_slots?: Json | null
          bio?: string | null
          consultation_fee?: number | null
          created_at?: string
          id?: string
          license_number?: string
          rating?: number | null
          specialty_id?: string | null
          updated_at?: string
          user_id?: string
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "doctors_specialty_id_fkey"
            columns: ["specialty_id"]
            isOneToOne: false
            referencedRelation: "specialties"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          category: string | null
          created_at: string
          current_stock: number
          expiry_date: string | null
          id: string
          is_active: boolean | null
          last_restocked: string | null
          medication_name: string
          pharmacy_id: string
          reorder_level: number
          reorder_quantity: number
          sku: string | null
          supplier: string | null
          unit_price: number | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          current_stock?: number
          expiry_date?: string | null
          id?: string
          is_active?: boolean | null
          last_restocked?: string | null
          medication_name: string
          pharmacy_id: string
          reorder_level?: number
          reorder_quantity?: number
          sku?: string | null
          supplier?: string | null
          unit_price?: number | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          current_stock?: number
          expiry_date?: string | null
          id?: string
          is_active?: boolean | null
          last_restocked?: string | null
          medication_name?: string
          pharmacy_id?: string
          reorder_level?: number
          reorder_quantity?: number
          sku?: string | null
          supplier?: string | null
          unit_price?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_pharmacy_id_fkey"
            columns: ["pharmacy_id"]
            isOneToOne: false
            referencedRelation: "pharmacies"
            referencedColumns: ["id"]
          },
        ]
      }
      pharmacies: {
        Row: {
          address: string
          created_at: string
          delivery_available: boolean | null
          id: string
          is_active: boolean | null
          latitude: number | null
          license_number: string
          longitude: number | null
          name: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          created_at?: string
          delivery_available?: boolean | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          license_number: string
          longitude?: number | null
          name: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          created_at?: string
          delivery_available?: boolean | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          license_number?: string
          longitude?: number | null
          name?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      prescription_fulfillments: {
        Row: {
          actual_delivery: string | null
          created_at: string
          delivery_address: string | null
          delivery_notes: string | null
          estimated_delivery: string | null
          id: string
          pharmacy_id: string
          prescription_id: string
          status: Database["public"]["Enums"]["prescription_status"]
          total_price: number | null
          tracking_updates: Json | null
          updated_at: string
        }
        Insert: {
          actual_delivery?: string | null
          created_at?: string
          delivery_address?: string | null
          delivery_notes?: string | null
          estimated_delivery?: string | null
          id?: string
          pharmacy_id: string
          prescription_id: string
          status?: Database["public"]["Enums"]["prescription_status"]
          total_price?: number | null
          tracking_updates?: Json | null
          updated_at?: string
        }
        Update: {
          actual_delivery?: string | null
          created_at?: string
          delivery_address?: string | null
          delivery_notes?: string | null
          estimated_delivery?: string | null
          id?: string
          pharmacy_id?: string
          prescription_id?: string
          status?: Database["public"]["Enums"]["prescription_status"]
          total_price?: number | null
          tracking_updates?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "prescription_fulfillments_pharmacy_id_fkey"
            columns: ["pharmacy_id"]
            isOneToOne: false
            referencedRelation: "pharmacies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescription_fulfillments_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "prescriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      prescription_items: {
        Row: {
          created_at: string
          dosage: string
          duration: string
          frequency: string
          id: string
          instructions: string | null
          medication_name: string
          prescription_id: string
          quantity: number
        }
        Insert: {
          created_at?: string
          dosage: string
          duration: string
          frequency: string
          id?: string
          instructions?: string | null
          medication_name: string
          prescription_id: string
          quantity?: number
        }
        Update: {
          created_at?: string
          dosage?: string
          duration?: string
          frequency?: string
          id?: string
          instructions?: string | null
          medication_name?: string
          prescription_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "prescription_items_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "prescriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      prescriptions: {
        Row: {
          appointment_id: string | null
          blockchain_hash: string | null
          created_at: string
          diagnosis: string
          digital_signature: string | null
          doctor_id: string
          id: string
          notes: string | null
          patient_id: string
          pharmacy_id: string | null
          signed_at: string | null
          status: Database["public"]["Enums"]["prescription_status"]
          updated_at: string
        }
        Insert: {
          appointment_id?: string | null
          blockchain_hash?: string | null
          created_at?: string
          diagnosis: string
          digital_signature?: string | null
          doctor_id: string
          id?: string
          notes?: string | null
          patient_id: string
          pharmacy_id?: string | null
          signed_at?: string | null
          status?: Database["public"]["Enums"]["prescription_status"]
          updated_at?: string
        }
        Update: {
          appointment_id?: string | null
          blockchain_hash?: string | null
          created_at?: string
          diagnosis?: string
          digital_signature?: string | null
          doctor_id?: string
          id?: string
          notes?: string | null
          patient_id?: string
          pharmacy_id?: string | null
          signed_at?: string | null
          status?: Database["public"]["Enums"]["prescription_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "prescriptions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prescriptions_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name: string
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reorder_alerts: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          alert_type: string
          created_at: string
          current_stock: number
          id: string
          inventory_item_id: string
          is_acknowledged: boolean | null
          pharmacy_id: string
          reorder_level: number
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type: string
          created_at?: string
          current_stock: number
          id?: string
          inventory_item_id: string
          is_acknowledged?: boolean | null
          pharmacy_id: string
          reorder_level: number
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type?: string
          created_at?: string
          current_stock?: number
          id?: string
          inventory_item_id?: string
          is_acknowledged?: boolean | null
          pharmacy_id?: string
          reorder_level?: number
        }
        Relationships: [
          {
            foreignKeyName: "reorder_alerts_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reorder_alerts_pharmacy_id_fkey"
            columns: ["pharmacy_id"]
            isOneToOne: false
            referencedRelation: "pharmacies"
            referencedColumns: ["id"]
          },
        ]
      }
      specialties: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      stock_movements: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          inventory_item_id: string
          movement_type: string
          notes: string | null
          pharmacy_id: string
          quantity: number
          reference_id: string | null
          reference_type: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          inventory_item_id: string
          movement_type: string
          notes?: string | null
          pharmacy_id: string
          quantity: number
          reference_id?: string | null
          reference_type?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          inventory_item_id?: string
          movement_type?: string
          notes?: string | null
          pharmacy_id?: string
          quantity?: number
          reference_id?: string | null
          reference_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movements_pharmacy_id_fkey"
            columns: ["pharmacy_id"]
            isOneToOne: false
            referencedRelation: "pharmacies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "patient" | "doctor" | "nurse" | "pharmacy" | "hospital_admin"
      appointment_status: "pending" | "confirmed" | "completed" | "cancelled"
      prescription_status:
        | "pending"
        | "signed"
        | "sent_to_pharmacy"
        | "processing"
        | "ready"
        | "out_for_delivery"
        | "delivered"
        | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["patient", "doctor", "nurse", "pharmacy", "hospital_admin"],
      appointment_status: ["pending", "confirmed", "completed", "cancelled"],
      prescription_status: [
        "pending",
        "signed",
        "sent_to_pharmacy",
        "processing",
        "ready",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
    },
  },
} as const
