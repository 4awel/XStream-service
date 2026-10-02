import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // Заголовок X-Powered-By рассказывает о стеке и ничего не даёт взамен.
    poweredByHeader: false,
};

export default nextConfig;
