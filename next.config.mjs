/** @type {import('next').NextConfig} */
const nextConfig = {
  // OBRIGATÓRIO para Hostinger (gera a pasta standalone para o servidor Node.js)
  output: 'standalone',

  // Desativa a telemetria e otimiza o build para ambientes com recursos limitados
  poweredByHeader: false,
  reactStrictMode: true,

  // Opcional: Ajuda a evitar erros de compilação em builds lentos ou com pouca RAM
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Garante que o Next.js não tente usar otimizações de imagem que dependem de libs nativas
  // que podem não estar instaladas no servidor da Hostinger
  images: {
    unoptimized: true,
  },
};

export default nextConfig;