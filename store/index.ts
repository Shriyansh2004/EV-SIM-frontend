import { create } from "zustand";
import type { OcppMessage, Session, VirtualCharger } from "@/types";
import { mapCharger, mapOcppMessage, mapSession } from "@/types";

interface AppState {
  chargers: VirtualCharger[];
  sessions: Session[];
  ocppMessages: OcppMessage[];
  wsConnected: boolean;
  setChargers: (chargers: VirtualCharger[]) => void;
  upsertCharger: (charger: VirtualCharger) => void;
  removeCharger: (id: string) => void;
  setSessions: (sessions: Session[]) => void;
  upsertSession: (session: Session) => void;
  addOcppMessage: (msg: OcppMessage) => void;
  setOcppMessages: (msgs: OcppMessage[]) => void;
  setWsConnected: (connected: boolean) => void;
  handleWsEvent: (type: string, data: Record<string, unknown>) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  chargers: [],
  sessions: [],
  ocppMessages: [],
  wsConnected: false,

  setChargers: (chargers) => set({ chargers }),
  upsertCharger: (charger) =>
    set((s) => {
      const idx = s.chargers.findIndex((c) => c.id === charger.id);
      if (idx >= 0) {
        const next = [...s.chargers];
        next[idx] = { ...next[idx], ...charger };
        return { chargers: next };
      }
      return { chargers: [...s.chargers, charger] };
    }),
  removeCharger: (id) =>
    set((s) => ({ chargers: s.chargers.filter((c) => c.id !== id) })),

  setSessions: (sessions) => set({ sessions }),
  upsertSession: (session) =>
    set((s) => {
      const idx = s.sessions.findIndex((x) => x.id === session.id);
      if (idx >= 0) {
        const next = [...s.sessions];
        next[idx] = session;
        return { sessions: next };
      }
      return { sessions: [session, ...s.sessions] };
    }),

  addOcppMessage: (msg) =>
    set((s) => ({
      ocppMessages: [...s.ocppMessages.slice(-199), msg],
    })),
  setOcppMessages: (msgs) => set({ ocppMessages: msgs }),
  setWsConnected: (connected) => set({ wsConnected: connected }),

  handleWsEvent: (type, data) => {
    const store = get();
    switch (type) {
      case "ocpp_message":
        store.addOcppMessage(mapOcppMessage(data));
        break;
      case "charger_update": {
        const id = data.charger_id as string;
        const existing = store.chargers.find((c) => c.id === id);
        if (existing) {
          store.upsertCharger({
            ...existing,
            status: (data.status as VirtualCharger["status"]) || existing.status,
            lastHeartbeat: (data.last_heartbeat as string) || existing.lastHeartbeat,
            currentSession: existing.currentSession
              ? {
                  ...existing.currentSession,
                  currentPowerKw:
                    (data.current_power_kw as number) ??
                    existing.currentSession.currentPowerKw,
                  energyKwh:
                    (data.energy_kwh as number) ?? existing.currentSession.energyKwh,
                  socPercent:
                    (data.soc_percent as number) ?? existing.currentSession.socPercent,
                }
              : existing.currentSession,
          });
        }
        break;
      }
      case "charger_connected":
      case "charger_disconnected": {
        const id = data.charger_id as string;
        const existing = store.chargers.find((c) => c.id === id);
        if (existing) {
          store.upsertCharger({
            ...existing,
            isConnected: type === "charger_connected",
          });
        }
        break;
      }
      case "session_started":
        store.upsertSession(mapSession(data));
        break;
      case "session_updated":
        store.upsertSession(mapSession(data));
        break;
      case "session_ended":
        store.upsertSession(mapSession(data));
        break;
    }
  },
}));
