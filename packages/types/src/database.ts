// Database table types (from Supabase)

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: 'admin' | 'supervisor' | 'viewer';
          metadata: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      integrations: {
        Row: {
          id: string;
          name: string;
          type: string;
          provider: string;
          status: 'active' | 'inactive' | 'error';
          config: Record<string, any>;
          is_mock: boolean;
          last_sync_at: string | null;
          last_error: string | null;
          metadata: Record<string, any>;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['integrations']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['integrations']['Insert']>;
      };
    };
  };
}
