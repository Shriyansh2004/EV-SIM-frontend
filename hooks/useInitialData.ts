"use client";

import useSWR from "swr";
import { mapCharger, mapEv, mapEvPreset, mapOcppMessage, mapSession } from "@/types";
import { useAppStore } from "@/store";
import { useEffect } from "react";
import { API_BASE } from "@/lib/env";
import { EV_PRESETS } from "@/lib/content";
import { fetcher } from "@/lib/api";

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
