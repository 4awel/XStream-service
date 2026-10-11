'use client';

import { useState } from 'react';
import { Provider } from 'react-redux';
import { useAuthInit } from '@composables/useAuthInit';
import { useSocket } from '@composables/useSocket';
import { useThemeSync } from '@composables/useThemeSync';
import { useFollowsSync } from '@composables/useFollowsSync';
import { makeStore } from '@store/store';
import type { ReactNode } from 'react';
import type { AppStore } from '@store/store';

interface ProvidersProps {
    children: ReactNode;
}

const AppBootstrap = ({ children }: ProvidersProps): ReactNode => {
    useAuthInit();
    useSocket();
    useThemeSync();
    useFollowsSync();
    return children;
};

export const Providers = ({ children }: ProvidersProps): ReactNode => {
    const [store] = useState<AppStore>(makeStore);

    return (
        <Provider store={store}>
            <AppBootstrap>{children}</AppBootstrap>
        </Provider>
    );
};
