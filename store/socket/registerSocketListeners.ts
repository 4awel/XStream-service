import { socket } from '@socket/socket.client';
import { initEventMap } from '@store/socket/eventMap';
import type { AppDispatch } from '@store/store';


export const registerSocketListeners = (dispatch: AppDispatch): (() => void) => {
    const eventMap = initEventMap(dispatch);
    const entries = Object.entries(eventMap) as [string, (data: unknown) => void][];

    for (const [event, handler] of entries) {
        socket.on(event as never, handler as never);
    }

    return () => {
        for (const [event, handler] of entries) {
            socket.off(event as never, handler as never);
        }
    };
};
