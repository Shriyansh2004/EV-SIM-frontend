import type { OcppMessage } from "@/types";

const CONNECTOR_SCOPED_ACTIONS = new Set([
  "StatusNotification",
  "TransactionEvent",
  "RequestStartTransaction",
  "RequestStopTransaction",
  "UnlockConnector",
  "MeterValues",
]);

export function getConnectorIdFromPayload(
  payload: Record<string, unknown>
): number | undefined {
  if (payload.connector_id != null) return Number(payload.connector_id);
  const evse = payload.evse as Record<string, unknown> | undefined;
  if (evse?.connector_id != null) return Number(evse.connector_id);
  return undefined;
}

export function filterOcppMessagesByConnector(
  messages: OcppMessage[],
  chargerId: string,
  connectorId: number,
  activeChargingConnectorId?: number
): OcppMessage[] {
  return messages.filter((message) => {
    if (message.chargerId !== chargerId) return false;

    const payloadConnectorId = getConnectorIdFromPayload(message.payload);
    if (payloadConnectorId !== undefined) {
      return payloadConnectorId === connectorId;
    }

    if (
      connectorId === activeChargingConnectorId &&
      CONNECTOR_SCOPED_ACTIONS.has(message.action)
    ) {
      return true;
    }

    return false;
  });
}
