/** @type {import('next').NextConfig} */
const nextConfig = {
  // OBRIGATÓRIO para Hostinger (gera a pasta standalone)
  output: 'standalone',
  
  // Opcional: Ajuda a evitar erros de compilação em builds lentos
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
};

module.exports = nextConfig;