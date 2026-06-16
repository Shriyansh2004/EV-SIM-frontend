"use client";

import useSWR from "swr";
import { API_BASE } from "@/types";
import { mapCharger, mapOcppMessage, mapSession } from "@/types";
import { useAppStore } from "@/store";
import { useEffect } from "react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useInitialData() {
  const setChargers = useAppStore((s) => s.setChargers);
  const setSessions = useAppStore((s) => s.setSessions);
  const setOcppMessages = useAppStore((s) => s.setOcppMessages);

  const { data: chargers } = useSWR(`${API_BASE}/api/chargers`, fetcher, {
    refreshInterval: 10000,
  });
  const { data: sessions } = useSWR(`${API_BASE}/api/sessions`, fetcher, {
    refreshInterval: 10000,
  });
  const { data: messages } = useSWR(`${API_BASE}/api/ocpp/messages?limit=100`, fetcher, {
    refreshInterval: 15000,
  });

  useEffect(() => {
    if (chargers) setChargers(chargers.map(mapCharger));
  }, [chargers, setChargers]);

  useEffect(() => {
    if (sessions) setSessions(sessions.map(mapSession));
  }, [sessions, setSessions]);

  useEffect(() => {
    if (messages) setOcppMessages(messages.map(mapOcppMessage));
  }, [messages, setOcppMessages]);
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}

export async function apiDelete(path: string): Promise<void> {
  const res = await fetch(`${API_BASE}${path}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Delete failed");
}
