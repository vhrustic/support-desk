export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          created_at?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          tenant_id: string | null;
          full_name: string | null;
          role: "admin" | "agent" | "customer";
          email: string | null;
          created_at: string | null;
        };
        Insert: {
          id: string;
          tenant_id?: string | null;
          full_name?: string | null;
          role: "admin" | "agent" | "customer";
          email?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string | null;
          full_name?: string | null;
          role?: "admin" | "agent" | "customer";
          email?: string | null;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profiles_tenant_id_fkey";
            columns: ["tenant_id"];
            isOneToOne: false;
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          },
        ];
      };
      tickets: {
        Row: {
          id: string;
          tenant_id: string | null;
          created_by: string | null;
          assigned_to: string | null;
          title: string;
          description: string;
          status: "open" | "in_progress" | "resolved" | "closed";
          priority: "low" | "medium" | "high";
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          tenant_id?: string | null;
          created_by?: string | null;
          assigned_to?: string | null;
          title: string;
          description: string;
          status?: "open" | "in_progress" | "resolved" | "closed";
          priority?: "low" | "medium" | "high";
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          tenant_id?: string | null;
          created_by?: string | null;
          assigned_to?: string | null;
          title?: string;
          description?: string;
          status?: "open" | "in_progress" | "resolved" | "closed";
          priority?: "low" | "medium" | "high";
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "tickets_assigned_to_fkey";
            columns: ["assigned_to"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tickets_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tickets_tenant_id_fkey";
            columns: ["tenant_id"];
            isOneToOne: false;
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          },
        ];
      };
      ticket_comments: {
        Row: {
          id: string;
          ticket_id: string | null;
          author_id: string | null;
          body: string;
          is_internal: boolean | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          ticket_id?: string | null;
          author_id?: string | null;
          body: string;
          is_internal?: boolean | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          ticket_id?: string | null;
          author_id?: string | null;
          body?: string;
          is_internal?: boolean | null;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "ticket_comments_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "ticket_comments_ticket_id_fkey";
            columns: ["ticket_id"];
            isOneToOne: false;
            referencedRelation: "tickets";
            referencedColumns: ["id"];
          },
        ];
      };
      invitations: {
        Row: {
          id: string;
          email: string;
          tenant_id: string | null;
          role: "agent" | "customer";
          accepted_at: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          tenant_id?: string | null;
          role: "agent" | "customer";
          accepted_at?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          tenant_id?: string | null;
          role?: "agent" | "customer";
          accepted_at?: string | null;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "invitations_tenant_id_fkey";
            columns: ["tenant_id"];
            isOneToOne: false;
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
