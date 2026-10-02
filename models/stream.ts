/** Соответствует StreamKeyResponse на сервере (GET /channel/stream-key). */
export interface StreamKey {
    /** Поле «Сервер» в OBS. */
    server: string;
    /** Поле «Ключ потока» в OBS целиком: "<channelId>?key=<ключ>". */
    streamKey: string;
    /** HLS-манифест своего канала. */
    playbackUrl: string;
}
