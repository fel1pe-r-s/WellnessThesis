import { withSwagger } from 'next-swagger-doc';

const swaggerHandler = withSwagger({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WellnessThesis API',
      version: '1.0.0',
      description: 'API for WellnessThesis Application',
    },
  },
  apiFolder: 'src/app/api',
});

export async function GET() {
    const spec = swaggerHandler();
    return new Response(JSON.stringify(spec), {
        headers: { 'Content-Type': 'application/json' },
    });
}
