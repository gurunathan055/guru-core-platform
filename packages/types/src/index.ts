// ============================================
// USER & AUTH TYPES
// ============================================

export type UserRole = 'admin' | 'supervisor' | 'viewer';

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: UserRole;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// ============================================
// INTEGRATION TYPES
// ============================================

export type IntegrationType = 
  | 'crm' 
  | 'telephony' 
  | 'messaging' 
  | 'erp' 
  | 'payment' 
  | 'analytics' 
  | 'storage' 
  | 'notification' 
  | 'custom';

export type AuthType = 'api-key' | 'oauth2' | 'basic' | 'bearer' | 'jwt' | 'custom';

export interface AuthConfig {
  type: AuthType;
  apiKey?: {
    key: string;
    headerName?: string;
    queryParamName?: string;
    prefix?: string;
    encoding?: 'base64' | 'none';
  };
  oauth2?: {
    authUrl: string;
    tokenUrl: string;
    clientId: string;
    clientSecret: string;
    scope: string[];
    redirectUri: string;
    grantType: 'authorization_code' | 'client_credentials' | 'password';
  };
  basic?: {
    username: string;
    password: string;
  };
  jwt?: {
    secret: string;
    algorithm: 'HS256' | 'RS256' | 'ES256';
    expiresIn: string;
    issuer?: string;
    audience?: string;
  };
  customHeaders?: Record<string, string>;
}

export interface EndpointConfig {
  id: string;
  name: string;
  description: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  headers?: Record<string, string>;
  queryParams?: Array<{
    key: string;
    value: string | FieldMapping;
    required: boolean;
  }>;
  body?: {
    type: 'json' | 'form-data' | 'xml' | 'raw';
    content: Record<string, any> | FieldMapping[];
  };
  responseMapping: {
    successPath: string;
    errorPath: string;
    dataTransform?: TransformRule[];
  };
  rateLimit?: {
    requests: number;
    perSeconds: number;
    strategy: 'fixed-window' | 'sliding-window' | 'token-bucket';
  };
  retry?: {
    maxAttempts: number;
    backoffStrategy: 'exponential' | 'linear' | 'constant';
    initialDelay: number;
    maxDelay: number;
  };
  cache?: {
    enabled: boolean;
    ttl: number;
    key: string;
  };
}

export interface FieldMapping {
  source: {
    entity: 'call' | 'user' | 'ticket' | 'sop' | 'custom';
    field: string;
    transform?: TransformRule;
  };
  destination: {
    path: string;
    format?: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object';
    required: boolean;
    default?: any;
  };
  bidirectional?: boolean;
}

export interface TransformRule {
  type: 'format' | 'calculate' | 'lookup' | 'conditional' | 'custom';
  format?: {
    from: string;
    to: string;
  };
  calculate?: {
    formula: string;
  };
  lookup?: {
    table: string;
    key: string;
    value: string;
  };
  conditional?: {
    if: string;
    then: any;
    else: any;
  };
  custom?: {
    code: string;
  };
}

export interface IntegrationConfig {
  id: string;
  name: string;
  type: IntegrationType;
  provider: string;
  auth: AuthConfig;
  baseUrl: string;
  endpoints: EndpointConfig[];
  fieldMappings: FieldMapping[];
  webhooks?: Array<{
    id: string;
    name: string;
    description: string;
    url: string;
    events: string[];
    signatureHeader?: string;
    signatureSecret?: string;
  }>;
  automations?: Array<{
    id: string;
    name: string;
    trigger: string;
    action: string;
    enabled: boolean;
  }>;
}

// ============================================
// PLUGIN TYPES
// ============================================

export interface GuruPlugin {
  id: string;
  name: string;
  version: string;
  description?: string;
  author?: string;
  homepage?: string;
  dependencies?: string[];
  requiredVersion?: string;
  
  onInstall?: () => Promise<void>;
  onUninstall?: () => Promise<void>;
  onEnable?: () => Promise<void>;
  onDisable?: () => Promise<void>;
  onUpgrade?: (fromVersion: string) => Promise<void>;
  
  hooks?: {
    beforeCall?: (context: any) => Promise<any>;
    afterCall?: (result: any) => Promise<void>;
    beforeRetrieval?: (query: string) => Promise<string>;
    afterRetrieval?: (results: any[]) => Promise<any[]>;
    customMetric?: (call: any) => Promise<Record<string, any>>;
  };
  
  routes?: Array<{
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    handler: (req: any) => Promise<any>;
    auth?: boolean;
  }>;
  
  components?: {
    dashboardWidgets?: Array<{
      id: string;
      component: any;
      slot: string;
      order?: number;
    }>;
    navigationItems?: Array<{
      label: string;
      href: string;
      icon?: any;
    }>;
  };
  
  settings?: {
    schema: any;
    defaults: Record<string, any>;
  };
  
  permissions?: Array<string>;
}

// ============================================
// SELF-HEALING TYPES
// ============================================

export interface HealthCheck {
  name: string;
  type: string;
  execute: () => Promise<HealthCheckResult>;
  autoHeal?: boolean;
}

export interface HealthCheckResult {
  healthy: boolean;
  latency?: number;
  metrics?: Record<string, any>;
  error?: string;
}

export interface Incident {
  id: string;
  type: string;
  component: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  detectedAt: Date;
  status: 'detected' | 'healing' | 'healed' | 'healing-failed';
  autoHeal: boolean;
  healedAt?: Date;
  healingAction?: string;
  error?: string;
  metadata?: Record<string, any>;
}

export interface HealingStrategy {
  heal: (incident: Incident) => Promise<{ success: boolean; action?: string; error?: string }>;
}

// ============================================
// KNOWLEDGE BASE TYPES
// ============================================

export type FileType = 'pdf' | 'docx' | 'mp4' | 'mp3' | 'text';
export type ProcessingStatus = 'queued' | 'processing' | 'completed' | 'failed';

export interface KnowledgeBase {
  id: string;
  title: string;
  description?: string;
  file_path?: string;
  file_type?: FileType;
  file_size_bytes?: number;
  category?: string;
  tags: string[];
  metadata: Record<string, any>;
  processing_status: ProcessingStatus;
  processing_error?: string;
  indexed_at?: string;
  version: number;
  parent_id?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export * from './api';
export * from './database';
