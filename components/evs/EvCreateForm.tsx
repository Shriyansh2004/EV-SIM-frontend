"use client";

import { useState, useEffect } from "react";
import { useEvPresets, apiPost } from "@/hooks/useInitialData";
import { EV_PRESETS } from "@/lib/evPresets";
import { useAppStore } from "@/store";
import { mapEv } from "@/types";
import type { EvType } from "@/types";
import { Plus } from "lucide-react";

export function EvCreateForm() {
  const presets = useEvPresets();
  const upsertEv = useAppStore((s) => s.upsertEv);

  const [id, setId] = useState("");
  const [presetId, setPresetId] = useState("generic-bev");
  const [vendor, setVendor] = useState("Generic");
  const [model, setModel] = useState("Standard BEV");
  const [evType, setEvType] = useState<EvType>("BEV");
  const [batteryKwh, setBatteryKwh] = useState(75);
  const [maxAcKw, setMaxAcKw] = useState(11);
  const [maxDcKw, setMaxDcKw] = useState(150);
  const [soc, setSoc] = useState(20);
  const [targetSoc, setTargetSoc] = useState(80);
  const [customMode, setCustomMode] = useState(false);

  function applyPreset(presetIdValue: string) {
    const list = presets.length > 0 ? presets : EV_PRESETS;
    setPresetId(presetIdValue);
    const preset = list.find((p) => p.id === presetIdValue);
    if (preset) {
      setVendor(preset.vendor);
      setModel(preset.model);
      setEvType(preset.evType);
      setBatteryKwh(preset.batteryCapacityKwh);
      setMaxAcKw(preset.maxAcChargePowerKw);
      setMaxDcKw(preset.maxDcChargePowerKw);
      setCustomMode(false);
    } else {
      setCustomMode(true);
    }
  }

  useEffect(() => {
    applyPreset("generic-bev");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id.trim()) return;
    try {
      const raw = await apiPost<Record<string, unknown>>("/api/evs", {
        id: id.trim(),
        vendor,
        model,
        ev_type: evType,
        battery_capacity_kwh: batteryKwh,
        max_ac_charge_power_kw: maxAcKw,
        max_dc_charge_power_kw: maxDcKw,
        soc_percent: soc,
        target_soc_percent: targetSoc,
      });
      upsertEv(mapEv(raw));
      setId("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create EV");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="panel p-5 shadow-card space-y-4">
      <h3 className="section-label">Create Virtual EV</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="scope-readout-label block mb-1">EV ID</label>
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="EV-001"
            className="matlab-input"
          />
        </div>
        <div>
          <label className="scope-readout-label block mb-1">Vehicle Preset</label>
          <select
            value={customMode ? "custom" : presetId}
            onChange={(e) => {
              if (e.target.value === "custom") {
                setCustomMode(true);
              } else {
                applyPreset(e.target.value);
              }
            }}
            className="matlab-select w-full"
          >
            {presets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
            <option value="custom">Custom vehicle</option>
          </select>
        </div>
        <div>
          <label className="scope-readout-label block mb-1">Vendor</label>
          <input
            value={vendor}
            onChange={(e) => {
              setVendor(e.target.value);
              setCustomMode(true);
            }}
            className="matlab-input"
          />
        </div>
        <div>
          <label className="scope-readout-label block mb-1">Model</label>
          <input
            value={model}
            onChange={(e) => {
              setModel(e.target.value);
              setCustomMode(true);
            }}
            className="matlab-input"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div>
          <label className="scope-readout-label block mb-1">Type</label>
          <select
            value={evType}
            onChange={(e) => {
              setEvType(e.target.value as EvType);
              setCustomMode(true);
            }}
            className="matlab-select w-full"
          >
            <option value="BEV">BEV</option>
            <option value="PHEV">PHEV</option>
            <option value="HEV">HEV</option>
          </select>
        </div>
        <div>
          <label className="scope-readout-label block mb-1">Battery (kWh)</label>
          <input
            type="number"
            value={batteryKwh}
            onChange={(e) => {
              setBatteryKwh(Number(e.target.value));
              setCustomMode(true);
            }}
            className="matlab-input"
          />
        </div>
        <div>
          <label className="scope-readout-label block mb-1">Max AC (kW)</label>
          <input
            type="number"
            value={maxAcKw}
            onChange={(e) => {
              setMaxAcKw(Number(e.target.value));
              setCustomMode(true);
            }}
            className="matlab-input"
          />
        </div>
        <div>
          <label className="scope-readout-label block mb-1">Max DC (kW)</label>
          <input
            type="number"
            value={maxDcKw}
            onChange={(e) => {
              setMaxDcKw(Number(e.target.value));
              setCustomMode(true);
            }}
            className="matlab-input"
          />
        </div>
        <div>
          <label className="scope-readout-label block mb-1">Start SoC (%)</label>
          <input
            type="number"
            min={0}
            max={100}
            value={soc}
            onChange={(e) => setSoc(Number(e.target.value))}
            className="matlab-input"
          />
        </div>
        <div>
          <label className="scope-readout-label block mb-1">Target SoC (%)</label>
          <input
            type="number"
            min={0}
            max={100}
            value={targetSoc}
            onChange={(e) => setTargetSoc(Number(e.target.value))}
            className="matlab-input"
          />
        </div>
      </div>

      <button type="submit" className="matlab-btn-primary flex items-center gap-2">
        <Plus className="w-4 h-4" />
        Add Electric Vehicle
      </button>
    </form>
  );
}
