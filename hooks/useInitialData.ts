"use client";

import useSWR from "swr";
import { API_BASE } from "@/types";
import { mapCharger, mapEv, mapEvPreset, mapOcppMessage, mapSession } from "@/types";
import { useAppStore } from "@/store";
import { useEffect } from "react";

import { EV_PRESETS } from "@/lib/evPresets";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
};

export function useInitialData() {
  const setChargers = useAppStore((s) => s.setChargers);
  const setEvs = useAppStore((s) => s.setEvs);
  const setSessions = useAppStore((s) => s.setSessions);
  const setOcppMessages = useAppStore((s) => s.setOcppMessages);

  const { data: chargers } = useSWR(`${API_BASE}/api/chargers`, fetcher, {
    refreshInterval: 10000,
  });
  const { data: evs } = useSWR(`${API_BASE}/api/evs`, fetcher, {
    refreshInterval: 5000,
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
    if (evs) setEvs(evs.map(mapEv));
  }, [evs, setEvs]);

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

export function useEvPresets() {
  const { data } = useSWR(`${API_BASE}/api/evs/presets`, fetcher, {
    fallbackData: EV_PRESETS,
    revalidateOnFocus: false,
  });

  if (Array.isArray(data) && data.length > 0) {
    return (data as Record<string, unknown>[]).map(mapEvPreset);
  }
  return EV_PRESETS;
}
