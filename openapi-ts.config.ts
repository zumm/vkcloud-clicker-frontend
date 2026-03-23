import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: 'openapi.yaml',
  output: 'src/api',
  plugins: [{
    name: '@hey-api/client-fetch',
    throwOnError: true,
  }, {
    name: '@hey-api/transformers',
    dates: true,
  }, {
    name: '@hey-api/sdk',
    transformer: true,
    paramsStructure: 'grouped',
    responseStyle: 'data',
  }],
})
