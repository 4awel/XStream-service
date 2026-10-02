/**
 * Адреса MediaMTX. Бэкенд отдаёт playbackUrl только для своего канала,
 * а плеер должен открывать любой — поэтому базовые адреса знает и фронт.
 *
 * Дефолты совпадают с docker-compose.yml из stream-backend.
 * В проде это домен за TLS-прокси: https://media.example.com
 */
const HLS_URL = process.env.NEXT_PUBLIC_MEDIA_HLS_URL ?? 'http://localhost:8888';
const WEBRTC_URL = process.env.NEXT_PUBLIC_MEDIA_WEBRTC_URL ?? 'http://localhost:8889';

const withoutTrailingSlash = (url: string): string => url.replace(/\/+$/, '');

/** HLS-манифест канала: задержка 2-4 с, работает во всех браузерах. */
export const hlsPlaybackUrl = (channelId: string): string =>
    `${withoutTrailingSlash(HLS_URL)}/${channelId}/index.m3u8`;

/** WebRTC (WHEP): задержка меньше секунды, но требует UDP до сервера. */
export const webrtcPlaybackUrl = (channelId: string): string =>
    `${withoutTrailingSlash(WEBRTC_URL)}/${channelId}/whep`;
