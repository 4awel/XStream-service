import { ChannelPage } from '@page-ui/Channel/ChannelPage';
import type { ReactNode } from 'react';

interface ChannelRouteProps {
    params: Promise<{ username: string }>;
}

/**
 * /<username> — страница канала. Статические маршруты (/settings, /login...)
 * Next проверяет раньше динамического, а сервер не даёт занять такие имена.
 */
const ChannelRoute = async ({ params }: ChannelRouteProps): Promise<ReactNode> => {
    const { username } = await params;
    return <ChannelPage key={username} username={decodeURIComponent(username)} />;
};

export default ChannelRoute;
