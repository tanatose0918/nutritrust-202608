'use client';

import { useEffect } from 'react';
import { sendTelemetryEvent } from '@/services/api';

export default function TelemetryTracker() {
    useEffect(() => {
        try {
            const sessionKey = 'ntt_session_visitor_tracked';
            let sessionId = sessionStorage.getItem(sessionKey);
            if (!sessionId) {
                sessionId = 'sess_' + Math.random().toString(36).substring(2, 10);
                sessionStorage.setItem(sessionKey, sessionId);
                sendTelemetryEvent('page_view', sessionId);
            }
        } catch (err) {
            console.error('Site-wide telemetry error:', err);
        }
    }, []);

    return null;
}
