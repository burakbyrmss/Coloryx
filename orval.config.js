/**
 * Orval config: generates type-safe endpoint functions from OpenAPI.
 * Spec is served locally from `http://localhost:3000/docs/json` (OpenAPI 3.0.3).
 */
module.exports = {
  coloryx: {
    input: {
      target: 'http://localhost:3000/docs/json',
      validation: false,
    },
    output: {
      client: 'react-query',
      httpClient: 'fetch',
      mode: 'single',
      target: './src/services/api/generated/endpoints.ts',
      schemas: './src/services/api/generated/schemas',
      prettier: true,
      override: {
        fetch: {
          includeHttpResponseReturnType: true,
          forceSuccessResponse: false,
        },
        mutator: {
          path: './src/services/api/orval-mutator.ts',
          name: 'orvalFetch',
        },
      },
    },
  },
};

