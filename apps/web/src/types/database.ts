export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'admin' | 'supervisor' | 'viewer'
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'supervisor' | 'viewer'
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'supervisor' | 'viewer'
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      calls: {
        Row: {
          id: string
          caller_phone: string
          caller_name: string | null
          started_at: string
          ended_at: string | null
          duration: number | null
          status: 'active' | 'completed' | 'escalated' | 'failed'
          topic: string | null
          sentiment: 'positive' | 'neutral' | 'negative' | null
          ai_handled: boolean
          ai_confidence: number | null
          escalation_risk: 'low' | 'medium' | 'high' | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          caller_phone: string
          caller_name?: string | null
          started_at?: string
          ended_at?: string | null
          duration?: number | null
          status?: 'active' | 'completed' | 'escalated' | 'failed'
          topic?: string | null
          sentiment?: 'positive' | 'neutral' | 'negative' | null
          ai_handled?: boolean
          ai_confidence?: number | null
          escalation_risk?: 'low' | 'medium' | 'high' | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          caller_phone?: string
          caller_name?: string | null
          started_at?: string
          ended_at?: string | null
          duration?: number | null
          status?: 'active' | 'completed' | 'escalated' | 'failed'
          topic?: string | null
          sentiment?: 'positive' | 'neutral' | 'negative' | null
          ai_handled?: boolean
          ai_confidence?: number | null
          escalation_risk?: 'low' | 'medium' | 'high' | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      integrations: {
        Row: {
          id: string
          name: string
          type: 'crm' | 'telephony' | 'messaging' | 'erp' | 'payment' | 'analytics' | 'storage' | 'notification' | 'custom'
          provider: string
          status: 'active' | 'inactive' | 'error'
          config: Json
          is_mock: boolean
          last_sync_at: string | null
          last_error: string | null
          metadata: Json
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'crm' | 'telephony' | 'messaging' | 'erp' | 'payment' | 'analytics' | 'storage' | 'notification' | 'custom'
          provider: string
          status?: 'active' | 'inactive' | 'error'
          config?: Json
          is_mock?: boolean
          last_sync_at?: string | null
          last_error?: string | null
          metadata?: Json
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'crm' | 'telephony' | 'messaging' | 'erp' | 'payment' | 'analytics' | 'storage' | 'notification' | 'custom'
          provider?: string
          status?: 'active' | 'inactive' | 'error'
          config?: Json
          is_mock?: boolean
          last_sync_at?: string | null
          last_error?: string | null
          metadata?: Json
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
