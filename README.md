# 🌌 Guru-Core: Enterprise Voice SaaS Platform

> Quantum-Logic AI Voice Automation for FMCG L1 Support

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)

## 🎯 Overview

Guru-Core is an intelligent, self-healing voice automation platform designed specifically for FMCG companies. It replaces traditional L1 support with an emotional, clever AI that learns autonomously and provides warm handoffs when needed.

### ✨ Key Features

- ⚡ **Sub-250ms Voice Latency** - Real-time conversations with OpenAI Realtime API
- 🧠 **Autonomous Learning** - Automatically generates SOPs from knowledge gaps
- 🔄 **Self-Healing AI** - Detects and fixes hallucinations automatically
- 🌐 **Multilingual Support** - Hindi, Tamil, Telugu, Bengali, Marathi
- 🔒 **DPDP 2023 Compliant** - Built-in Indian data privacy compliance
- 🎨 **Modern Dashboard** - Beautiful, accessible command center
- 🔌 **Extensible Plugin System** - Add custom features without breaking changes
- 📱 **100% Responsive** - Perfect experience on mobile, tablet, desktop (320px - 4K)
- 🔗 **Universal Integration** - Connect ANY API without coding via visual builder
- 🛡️ **Zero-Downtime** - Self-healing system with automatic recovery

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- Supabase CLI (optional, for database management)
- npm 10+

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/guru-core.git
cd guru-core

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your credentials

# Start Docker services (Weaviate, Ollama, Redis)
cd infra/docker
docker-compose up -d

# Initialize database (if using Supabase)
npm run db:migrate
npm run db:seed

# Start development server
npm run dev
```

Visit `http://localhost:3000` to access the dashboard.

## 📖 Documentation

- [Architecture Overview](docs/architecture/README.md)
- [API Reference](docs/api/README.md)
- [Plugin Development Guide](docs/guides/plugin-development.md)
- [Deployment Guide](docs/guides/deployment.md)
- [Configuration](docs/guides/configuration.md)
- [Integration Studio](docs/guides/integration-studio.md)
- [Self-Healing System](docs/guides/self-healing.md)

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Supabase (Postgres, Auth, Edge Functions)
- **AI**: Llama 3.1, Mixtral, OpenAI (Whisper, Realtime)
- **Vector DB**: Weaviate
- **Caching**: Redis
- **Deployment**: Vercel, Docker

## 🎨 Responsive Design

Guru-Core is built mobile-first with perfect experiences across all devices:

- **xs (320px)**: Small phones (iPhone SE)
- **sm (640px)**: Large phones (iPhone 14)
- **md (768px)**: Tablets (iPad Mini)
- **lg (1024px)**: Laptops
- **xl (1280px)**: Desktops
- **2xl (1536px)**: Large desktops
- **3xl (1920px)**: 4K displays

## 🔌 Integration Studio

Connect to ANY API without writing code:

1. **Choose Integration Type** - CRM, Telephony, Messaging, ERP, etc.
2. **Configure Authentication** - API Key, OAuth 2.0, Basic Auth, JWT
3. **Map Endpoints** - Visual API endpoint configuration
4. **Map Data Fields** - Drag-and-drop field mapping
5. **Test & Activate** - Run scenarios and go live

### Pre-built Templates

- ✅ Freshdesk
- ✅ Freshservice
- ✅ Knowlarity
- ✅ Twilio
- ✅ WhatsApp Business
- ✅ Generic REST/GraphQL/SOAP

## 🛡️ Self-Healing System

Guru-Core automatically detects and recovers from failures:

- **Database Connection Issues** - Auto-reconnect
- **Vector DB Failures** - Container restart + fallback
- **LLM Service Issues** - Provider switching (Ollama → OpenAI)
- **Integration Failures** - Mock mode fallback
- **Memory Leaks** - Automatic cache clearing
- **High Latency** - Aggressive caching enablement
- **Voice API Failures** - Multi-provider fallback

**Zero user-facing downtime** - Users never experience system failures.

## 🔐 Security

- Row Level Security (RLS) on all database tables
- JWT-based authentication
- API key encryption
- PII scrubbing pipeline
- DPDP Act 2023 compliance
- Audit logging for all actions
- Rate limiting and CORS protection

## 📊 Project Structure

```
guru-core/
├── apps/
│   └── web/                  # Next.js 15 application
├── packages/
│   ├── core/                 # Core business logic
│   ├── ui/                   # Shared UI components
│   ├── database/             # Database schemas & migrations
│   ├── types/                # Shared TypeScript types
│   └── config/               # Shared configuration
├── plugins/                  # Official plugins
├── services/                 # Standalone services
│   ├── weaviate/            # Vector database
│   ├── llm-server/          # Ollama/vLLM hosting
│   └── workers/             # Background jobs
├── infra/                    # Infrastructure as code
│   ├── docker/              # Docker Compose configs
│   └── scripts/             # Deployment scripts
├── docs/                     # Documentation
└── tests/                    # Test suites
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e
```

## 🚀 Deployment

### Automatic Deployment (GitHub Actions)

1. Push to `main` branch
2. GitHub Actions runs tests and builds
3. Automatically deploys to Vercel
4. Runs database migrations
5. Health checks confirm deployment

### Manual Deployment

```bash
# Build for production
npm run build

# Deploy to Vercel
npm run deploy
```

See [Deployment Guide](docs/guides/deployment.md) for detailed instructions.

## 🔌 Plugin Development

Create custom plugins to extend Guru-Core:

```typescript
import { GuruPlugin } from '@guru-core/types';

export const myPlugin: GuruPlugin = {
  id: 'my-custom-plugin',
  name: 'My Custom Plugin',
  version: '1.0.0',
  
  hooks: {
    async afterCall(result) {
      // Custom logic after each call
    }
  },
  
  components: {
    dashboardWidgets: [
      {
        id: 'my-widget',
        component: MyCustomWidget,
        slot: 'dashboard-metrics',
      }
    ]
  }
};
```

See [Plugin Development Guide](docs/guides/plugin-development.md) for details.

## 📈 Roadmap

- [x] Core platform foundation
- [x] Responsive design system
- [x] Universal integration engine
- [x] Self-healing infrastructure
- [ ] Voice engine with multi-provider support
- [ ] RAG pipeline with Weaviate
- [ ] Autonomous learning system
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-tenant support
- [ ] WhiteLabel capabilities

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with ❤️ by the Guru team for the FMCG industry.

---

**Developed, Managed, and Authorized by Guru**

For support, email: support@guru-core.com  
For sales inquiries: sales@guru-core.com

## 🎯 Getting Started Guide

### Step 1: Initial Setup

After deployment, access your dashboard at the provided URL and:

1. Login with admin credentials
2. Complete your profile setup
3. Enable 2FA (recommended)

### Step 2: Upload Knowledge Base

1. Navigate to **Knowledge Base** → **Upload Document**
2. Drag and drop your SOPs or training materials
3. Add metadata (category, tags)
4. Wait for processing and indexing

### Step 3: Generate Your First SOP

1. Go to **SOP Generator** → **Create New SOP**
2. Enter a simple description or bullet points
3. Let AI generate a structured SOP
4. Review, edit if needed, and publish

### Step 4: Configure Integrations

1. Navigate to **Integrations** → **Integration Studio**
2. Choose integration type (e.g., Freshdesk)
3. Configure authentication
4. Map data fields visually
5. Test and activate

### Step 5: Test in Sandbox

1. Open **Sandbox Playground**
2. Enter test scenarios
3. Simulate calls and interactions
4. Verify AI responses

### Step 6: Go Live

1. Review all configurations
2. Toggle **Live Mode** ON
3. Monitor **Live Calls** dashboard
4. Track metrics and performance

## 📞 Support

- **Documentation**: [docs.guru-core.com](https://docs.guru-core.com)
- **Community**: [community.guru-core.com](https://community.guru-core.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/guru-core/issues)
- **Email**: support@guru-core.com

---

**Ready to revolutionize your FMCG customer support! 🚀**
