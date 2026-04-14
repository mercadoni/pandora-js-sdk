# CLAUDE.md - Ecommerce JS SDK

## Project Overview
TypeScript-based SDK for ecommerce platform integration with GraphQL client architecture.

## Architecture Patterns
```yaml
Core: Platform→Services→Models | Client: GraphQL→HTTP→fetch
Structure: /core (client, platform, services, models) | /services (home, product)
Data Flow: Platform(config)→Service(filter)→Client(query)→API
```

## Key Components

### Platform (`src/core/Platform.ts`)
- Entry point for SDK initialization
- Manages GraphQL client & service instances
- Config: `{baseUrl, clientId}`

### Services
- **HomeService**: Dynamic content retrieval
- **ProductService**: Catalog operations
- Pattern: Interface→GraphQL implementation

### Models
- **Home**: Homepage widgets & metadata
- **Product**: Catalog items & stock details
- **Filter**: Query parameters

## Commands & Scripts
```yaml
Build: npm run build (TypeScript compilation)
Dev: npm run dev (watch mode w/ nodemon)
Watch: npm run watch-ts (TypeScript watch)
Lint: Use ESLint config (eslint.config.mjs)
```

## Development Rules
```yaml
Code Style: 
  - TypeScript strict mode enabled
  - Interface-based service contracts
  - Async/await for API calls
  - Default exports for main classes

File Organization:
  - Models: /core/models/{domain}/
  - Services: /core/services/{domain}/
  - HTTP: /core/http/ (clients & interfaces)
  - Utils: /core/utils/

Dependencies:
  - isomorphic-unfetch: HTTP requests
  - TypeScript: Build system
  - ESLint: Code quality
```

## Testing Patterns
- Example usage in `src/index.ts`
- Platform initialization→Service creation→API calls
- Filter-based queries

## Common Operations
```typescript
// SDK initialization
const platform = new Platform({
  baseUrl: 'https://api.example.com',
  clientId: 'CLIENT_ID'
});

// Service usage
const filter = new HomeFilter({...});
const result = await platform.homeService.home({filter});
```

## Build Process
- TypeScript→CommonJS (tsconfig.json)
- Output: `/dist` directory
- Entry: `dist/index.js`

## Code Quality
- ESLint configuration present
- TypeScript strict mode
- Interface-driven design
- Error handling in Client class

---
*Generated for ecommerce-js-sdk TypeScript SDK project*