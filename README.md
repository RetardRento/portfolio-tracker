# Quai Web3 Analytics & Alerts Dashboard

A comprehensive analytics dashboard for monitoring Quai Network blockchain activity, including whale movements, DEX trading, and real-time alerts.

## Features

- **Real-time Analytics**: Track ERC-20 transfers, DEX swaps, and whale movements
- **Professional Dashboard**: Clean, responsive UI with dark mode support
- **Whale Monitoring**: Automated alerts for large transfers (>$10k)
- **DEX Analytics**: Volume tracking and swap monitoring across multiple DEXes
- **Mock Data System**: Simulates real blockchain events for development

## Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL (Supabase-compatible)
- **Frontend**: Next.js + TailwindCSS
- **Charts**: Recharts
- **Real-time Updates**: Polling every 5 seconds

## Quick Start

### 1. Database Setup

Start PostgreSQL with Docker:
\`\`\`bash
docker-compose up -d postgres
\`\`\`

### 2. Environment Configuration

Copy the example environment file:
\`\`\`bash
cp .env.example .env
\`\`\`

Update `.env` with your database URL:
\`\`\`env
DATABASE_URL=postgresql://postgres:password@localhost:5432/quai_analytics
\`\`\`

### 3. Database Migration

Run the database setup:
\`\`\`bash
npm run db:migrate
\`\`\`

### 4. Start Services

Start the backend API:
\`\`\`bash
npm run backend
\`\`\`

Start the alerts worker (in another terminal):
\`\`\`bash
npm run worker
\`\`\`

Start the frontend (in another terminal):
\`\`\`bash
npm run dev
\`\`\`

## API Endpoints

### Webhook
- `POST /webhooks/indexing/quai` - Receive blockchain events

### Analytics
- `GET /api/overview` - Dashboard overview stats
- `GET /api/whales` - Large transfers (>$10k)
- `GET /api/dex-volume` - 24h DEX volume data
- `GET /api/top-tokens` - Top tokens by volume

### Health
- `GET /health` - Service health check

## Mock Data

The system automatically generates mock blockchain events every minute to simulate real activity:

- **ERC-20 Transfers**: Random transfers with occasional whale-sized amounts
- **DEX Swaps**: Trading activity across multiple mock DEXes
- **Whale Alerts**: Console notifications for large transfers

## Database Schema

### Core Tables
- `tokens` - ERC-20 token information
- `erc20_transfers` - Transfer events with USD values
- `dex_swaps` - DEX trading data
- `whale_watch` - Monitored wallet addresses
- `dao_treasuries` - DAO treasury tracking

## Development

### Project Structure
\`\`\`
├── backend/
│   ├── server.js          # Main API server
│   └── alerts-worker.js   # Whale monitoring worker
├── scripts/
│   ├── 01-create-schema.sql
│   ├── 02-seed-data.sql
│   └── run-migrations.js
├── app/                   # Next.js frontend
└── docker-compose.yml     # Local development setup
\`\`\`

### Adding New Features

1. **New API Endpoint**: Add routes in `backend/server.js`
2. **Database Changes**: Create new migration scripts in `scripts/`
3. **Frontend Pages**: Add components in `app/` directory
4. **Alerts**: Extend `alerts-worker.js` for new notification types

## Production Deployment

1. Set up PostgreSQL database (Supabase recommended)
2. Configure environment variables
3. Deploy backend API server
4. Deploy frontend to Vercel
5. Set up alerts worker as a background service

## Environment Variables

\`\`\`env
# Database
DATABASE_URL=postgresql://user:pass@host:port/db

# API Server
PORT=3001
NODE_ENV=production

# Frontend
NEXT_PUBLIC_API_URL=https://your-api-domain.com

# Alerts
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
WHALE_ALERT_THRESHOLD=10000
\`\`\`

## License

MIT License - see LICENSE file for details.
