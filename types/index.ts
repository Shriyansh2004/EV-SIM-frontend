export type ChargerStatus =
  | "Available"
  | "Preparing"
  | "Charging"
  | "SuspendedEV"
  | "SuspendedEVSE"
  | "Finishing"
  | "Reserved"
  | "Unavailable"
  | "Faulted";

export interface VirtualCharger {
  id: string;
  status: ChargerStatus;
  connectorCount: number;
  maxPowerKw: number;
  isConnected: boolean;
  currentSession?: Session;
  lastHeartbeat?: string;
  connectorStatuses?: ChargerStatus[];
}

export interface Session {
  id: string;
  chargerId: string;
  connectorId: number;
  startTime: string;
  endTime?: string;
  energyKwh: number;
  currentPowerKw: number;
  socPercent?: number;
  status: "active" | "completed" | "interrupted";
  meterValues: MeterValue[];
}

export interface MeterValue {
  timestamp: string;
  powerKw: number;
  energyKwh: number;
  socPercent?: number;
  voltageV?: number;
  currentA?: number;
}

export interface OcppMessage {
  id: string;
  timestamp: string;
  chargerId: string;
  direction: "CP_TO_CSMS" | "CSMS_TO_CP";
  messageType: "Request" | "Response" | "Error";
  action: string;
  payload: Record<string, unknown>;
  correlationId?: string;
}

export interface WsEvent {
  type: string;
  data: Record<string, unknown>;
}

// Snake_case to camelCase helpers for API responses
export function mapCharger(raw: Record<string, unknown>): VirtualCharger {
  const session = raw.current_session as Record<string, unknown> | undefined;
  return {
    id: raw.id as string,
    status: raw.status as ChargerStatus,
    connectorCount: raw.connector_count as number,
    maxPowerKw: raw.max_power_kw as number,
    isConnected: raw.is_connected as boolean,
    lastHeartbeat: raw.last_heartbeat as string | undefined,
    connectorStatuses: raw.connector_statuses as ChargerStatus[] | undefined,
    currentSession: session
      ? {
          id: session.id as string,
          chargerId: session.charger_id as string,
          connectorId: session.connector_id as number,
          startTime: session.start_time as string,
          endTime: session.end_time as string | undefined,
          energyKwh: session.energy_kwh as number,
          currentPowerKw: session.current_power_kw as number,
          socPercent: session.soc_percent as number | undefined,
          status: session.status as Session["status"],
          meterValues: ((session.meter_values as Record<string, unknown>[]) || []).map(
            mapMeterValue
          ),
        }
      : undefined,
  };
}

export function mapSession(raw: Record<string, unknown>): Session {
  return {
    id: raw.id as string,
    chargerId: raw.charger_id as string,
    connectorId: raw.connector_id as number,
    startTime: raw.start_time as string,
    endTime: raw.end_time as string | undefined,
    energyKwh: raw.energy_kwh as number,
    currentPowerKw: raw.current_power_kw as number,
    socPercent: raw.soc_percent as number | undefined,
    status: raw.status as Session["status"],
    meterValues: ((raw.meter_values as Record<string, unknown>[]) || []).map(mapMeterValue),
  };
}

export function mapMeterValue(raw: Record<string, unknown>): MeterValue {
  return {
    timestamp: raw.timestamp as string,
    powerKw: raw.power_kw as number,
    energyKwh: raw.energy_kwh as number,
    socPercent: raw.soc_percent as number | undefined,
    voltageV: raw.voltage_v as number | undefined,
    currentA: raw.current_a as number | undefined,
  };
}

export function mapOcppMessage(raw: Record<string, unknown>): OcppMessage {
  return {
    id: raw.id as string,
    timestamp: raw.timestamp as string,
    chargerId: raw.charger_id as string,
    direction: raw.direction as OcppMessage["direction"],
    messageType: raw.message_type as OcppMessage["messageType"],
    action: raw.action as string,
    payload: raw.payload as Record<string, unknown>,
    correlationId: raw.correlation_id as string | undefined,
  };
}

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws/updates";

export const OCPP_FIELD_DESCRIPTIONS: Record<string, string> = {
  BootNotification:
    "Sent by the charge point on startup to register with the CSMS and negotiate heartbeat interval.",
  Heartbeat: "Periodic keep-alive message to confirm the charge point is still connected.",
  StatusNotification:
    "Reports connector or EVSE status changes (Available, Occupied, Faulted, etc.).",
  Authorize: "Requests authorization for an idToken before starting a charging session.",
  TransactionEvent:
    "OCPP 2.0.1 unified message for session lifecycle: Started, Updated, or Ended events.",
  MeterValues: "Reports energy, power, SoC and other measurands during charging.",
  RequestStartTransaction: "CSMS command to remotely start a charging session.",
  RequestStopTransaction: "CSMS command to remotely stop an active session.",
  Reset: "CSMS command to reset the charge point (Immediate or OnIdle).",
  ChangeAvailability: "CSMS command to set a connector or EVSE operative/inoperative.",
  UnlockConnector: "CSMS command to unlock a connector cable.",
};
