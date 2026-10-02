import { io } from 'socket.io-client';
import { SocketEvent } from '@socket/socket.events';
import type { Socket } from 'socket.io-client';
import type { ClientToServerEvents, ServerToClientEvents } from '@socket/socket.events';

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'http://localhost:4000';

/**
 * Одно соединение на всё приложение.
 * withCredentials — session-cookie уходит в handshake, сервер узнаёт пользователя.
 */
export const socket: AppSocket = io(WS_URL, {
    autoConnect: false,
    withCredentials: true,
    transports: ['websocket'],
});

let currentChannelId: string | null = null;

/** Комната канала: чат, фоловы, сабы и зрители приходят только по ней. */
export const joinChannel = (channelId: string): void => {
    if (currentChannelId === channelId) {
        return;
    }
    if (currentChannelId !== null) {
        socket.emit(SocketEvent.LeaveChannel, { channelId: currentChannelId });
    }
    currentChannelId = channelId;
    if (socket.connected) {
        socket.emit(SocketEvent.JoinChannel, { channelId });
    }
};

export const leaveChannel = (): void => {
    if (currentChannelId !== null) {
        socket.emit(SocketEvent.LeaveChannel, { channelId: currentChannelId });
    }
    currentChannelId = null;
};

// после реконнекта сервер забывает комнаты — заходим заново
socket.on('connect', () => {
    if (currentChannelId !== null) {
        socket.emit(SocketEvent.JoinChannel, { channelId: currentChannelId });
    }
});
