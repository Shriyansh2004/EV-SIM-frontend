"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/store";
import { WS_URL } from "@/types";

export function useOcppWebSocket() {
  const handleWsEvent = useAppStore((s) => s.handleWsEvent);
  const setWsConnected = useAppStore((s) => s.setWsConnected);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    function connect() {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => setWsConnected(true);
      ws.onclose = () => {
        setWsConnected(false);
        reconnectRef.current = setTimeout(connect, 3000);
      };
      ws.onerror = () => ws.close();
      ws.onmessage = (event) => {
        try {
          const { type, data } = JSON.parse(event.data);
          handleWsEvent(type, data);
        } catch {
          // ignore malformed messages
        }
      };
    }

    connect();
    return () => {
      clearTimeout(reconnectRef.current);
      wsRef.current?.close();
    };
  }, [handleWsEvent, setWsConnected]);
}
