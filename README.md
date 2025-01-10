# MediaMTX Panel

A panel for managing MediaMTX paths and configuration with automatic database synchronization.

## Features

- Automatic synchronization of paths and configuration from database to MediaMTX on startup.
- TypeScript-based sync script.
- Docker Compose setup with health checks.
- Database persistence for MediaMTX instance paths and configuration.

## Setup

1. Make sure you have the following prerequisites:

   - Docker and Docker Compose
   - Node.js / Bun

2. Set up your environment variables:

   ```bash
   # Create a .env file
   cp .env.example .env
   ```

   Required environment variables:

   - `DATABASE_URL`: PostgreSQL connection string
   - `MEDIAMTX_URL`: MediaMTX API URL (default: http://localhost:9997)
   - `DOMAIN_NAME`: Your domain name
   - `SSL_EMAIL`: Email for SSL certificates

3. Install dependencies:

   ```bash
   bun install
   ```

4. Start the services:
   ```bash
   docker-compose -f compose/docker-compose.yml up -d
   ```

## How it Works

The sync functionality works as follows:

1. When the MediaMTX service starts, it waits for the API to be available (health check)
2. The post-start script (`scripts/sync-mediamtx.ts`) runs and:
   - Connects to the PostgreSQL database
   - Retrieves all paths and the latest configuration
   - Updates the MediaMTX global configuration
   - Syncs each path (creates or updates as needed)

## Development

To run the sync script manually:

```bash
bun run sync
```

## Troubleshooting

If the sync fails:

1. Check the MediaMTX logs: `docker logs mediamtx`
2. Verify database connectivity
3. Ensure the MediaMTX API is accessible
4. Check environment variables are set correctly
