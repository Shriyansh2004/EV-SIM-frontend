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
  pluggedEvs?: Record<string, string | null>;
}

export type EvStatus = "idle" | "plugged" | "charging" | "full" | "fault";
export type EvType = "BEV" | "PHEV" | "HEV";

export interface VirtualEv {
  id: string;
  name: string;
  vendor: string;
  model: string;
  evType: EvType;
  batteryCapacityKwh: number;
  maxChargePowerKw: number;
  maxAcChargePowerKw: number;
  maxDcChargePowerKw: number;
  socPercent: number;
  targetSocPercent: number;
  status: EvStatus;
  chargerId?: string;
  connectorId?: number;
  sessionId?: string;
  energyChargedKwh: number;
  currentPowerKw: number;
  voltageV: number;
  currentA: number;
  createdAt: string;
}

export interface EvPreset {
  id: string;
  name: string;
  vendor: string;
  model: string;
  evType: EvType;
  batteryCapacityKwh: number;
  maxAcChargePowerKw: number;
  maxDcChargePowerKw: number;
}

export interface Session {
  id: string;
  chargerId: string;
  evId?: string;
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
    pluggedEvs: raw.plugged_evs as Record<string, string | null> | undefined,
    currentSession: session
      ? {
          id: session.id as string,
          chargerId: session.charger_id as string,
          evId: session.ev_id as string | undefined,
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
    evId: raw.ev_id as string | undefined,
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

export function mapEv(raw: Record<string, unknown>): VirtualEv {
  return {
    id: raw.id as string,
    name: raw.name as string,
    vendor: raw.vendor as string,
    model: raw.model as string,
    evType: raw.ev_type as EvType,
    batteryCapacityKwh: raw.battery_capacity_kwh as number,
    maxChargePowerKw: raw.max_charge_power_kw as number,
    maxAcChargePowerKw: raw.max_ac_charge_power_kw as number,
    maxDcChargePowerKw: raw.max_dc_charge_power_kw as number,
    socPercent: raw.soc_percent as number,
    targetSocPercent: raw.target_soc_percent as number,
    status: raw.status as EvStatus,
    chargerId: raw.charger_id as string | undefined,
    connectorId: raw.connector_id as number | undefined,
    sessionId: raw.session_id as string | undefined,
    energyChargedKwh: raw.energy_charged_kwh as number,
    currentPowerKw: raw.current_power_kw as number,
    voltageV: raw.voltage_v as number,
    currentA: raw.current_a as number,
    createdAt: raw.created_at as string,
  };
}

export function mapEvPreset(raw: Record<string, unknown>): EvPreset {
  return {
    id: raw.id as string,
    name: raw.name as string,
    vendor: raw.vendor as string,
    model: raw.model as string,
    evType: raw.ev_type as EvType,
    batteryCapacityKwh: raw.battery_capacity_kwh as number,
    maxAcChargePowerKw: raw.max_ac_charge_power_kw as number,
    maxDcChargePowerKw: raw.max_dc_charge_power_kw as number,
  };
}

export { API_BASE, WS_URL, DEMO_ID_TOKEN } from "@/lib/env";

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
