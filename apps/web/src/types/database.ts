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
          role: string
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: string
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: string
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
          status: string
          topic: string | null
          sentiment: string | null
          ai_handled: boolean
          ai_confidence: number | null
          escalation_risk: string | null
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
          status?: string
          topic?: string | null
          sentiment?: string | null
          ai_handled?: boolean
          ai_confidence?: number | null
          escalation_risk?: string | null
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
          status?: string
          topic?: string | null
          sentiment?: string | null
          ai_handled?: boolean
          ai_confidence?: number | null
          escalation_risk?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      integrations: {
        Row: {
          id: string
          name: string
          type: string
          provider: string
          status: string
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
          type: string
          provider: string
          status?: string
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
          type?: string
          provider?: string
          status?: string
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
      campaigns: {
        Row: {
          id: string
          name: string
          status: string
          type: string
          script_id: string | null
          script_content: string | null
          contacts_total: number
          contacts_completed: number
          contacts_connected: number
          schedule: Json
          metadata: Json
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          status?: string
          type?: string
          script_id?: string | null
          script_content?: string | null
          contacts_total?: number
          contacts_completed?: number
          contacts_connected?: number
          schedule?: Json
          metadata?: Json
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          status?: string
          type?: string
          script_id?: string | null
          script_content?: string | null
          contacts_total?: number
          contacts_completed?: number
          contacts_connected?: number
          schedule?: Json
          metadata?: Json
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          title: string
          category: string | null
          file_type: string | null
          file_url: string | null
          file_size: number | null
          content: string | null
          status: string
          metadata: Json
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          category?: string | null
          file_type?: string | null
          file_url?: string | null
          file_size?: number | null
          content?: string | null
          status?: string
          metadata?: Json
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          category?: string | null
          file_type?: string | null
          file_url?: string | null
          file_size?: number | null
          content?: string | null
          status?: string
          metadata?: Json
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      sops: {
        Row: {
          id: string
          title: string
          category: string | null
          content: Json
          version: number
          status: string
          ai_generated: boolean
          ai_confidence: number | null
          metadata: Json
          created_by: string | null
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          category?: string | null
          content: Json
          version?: number
          status?: string
          ai_generated?: boolean
          ai_confidence?: number | null
          metadata?: Json
          created_by?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          category?: string | null
          content?: Json
          version?: number
          status?: string
          ai_generated?: boolean
          ai_confidence?: number | null
          metadata?: Json
          created_by?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      knowledge_gaps: {
        Row: {
          id: string
          question: string
          context: string | null
          frequency: number
          status: string
          suggested_sop_id: string | null
          suggested_answer: string | null
          ai_confidence: number | null
          metadata: Json
          detected_at: string
          resolved_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          question: string
          context?: string | null
          frequency?: number
          status?: string
          suggested_sop_id?: string | null
          suggested_answer?: string | null
          ai_confidence?: number | null
          metadata?: Json
          detected_at?: string
          resolved_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          question?: string
          context?: string | null
          frequency?: number
          status?: string
          suggested_sop_id?: string | null
          suggested_answer?: string | null
          ai_confidence?: number | null
          metadata?: Json
          detected_at?: string
          resolved_at?: string | null
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string | null
          title: string
          message: string | null
          type: string | null
          read: boolean
          action_url: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          message?: string | null
          type?: string | null
          read?: boolean
          action_url?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          message?: string | null
          type?: string | null
          read?: boolean
          action_url?: string | null
          metadata?: Json
          created_at?: string
        }
      }
      [key: string]: any
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
