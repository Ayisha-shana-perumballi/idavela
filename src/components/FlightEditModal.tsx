import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Plane, Save, RotateCcw } from 'lucide-react';
import { DEMO_FLIGHTS_BY_AIRPORT } from '../data/airports';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const FlightEditModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { demoFlight, updateDemoFlight, selectedAirportCode, selectedAirport } = useApp();

  const [origin, setOrigin] = useState(demoFlight.origin);
  const [originCode, setOriginCode] = useState(demoFlight.originCode);
  const [destination, setDestination] = useState(demoFlight.destination);
  const [destinationCode, setDestinationCode] = useState(demoFlight.destinationCode);
  const [flightNumber, setFlightNumber] = useState(demoFlight.flightNumber);
  const [nextFlightNumber, setNextFlightNumber] = useState(demoFlight.nextFlightNumber);
  const [terminal, setTerminal] = useState(demoFlight.terminal);
  const [gate, setGate] = useState(demoFlight.gate);
  const [layoverDurationMinutes, setLayoverDurationMinutes] = useState(demoFlight.layoverDurationMinutes);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateDemoFlight({
      origin,
      originCode: originCode.toUpperCase().slice(0, 3),
      destination,
      destinationCode: destinationCode.toUpperCase().slice(0, 3),
      flightNumber,
      nextFlightNumber,
      terminal,
      gate,
      layoverDurationMinutes,
      minutesRemaining: Math.min(demoFlight.minutesRemaining, layoverDurationMinutes)
    });
    onClose();
  };

  const handleReset = () => {
    const preset = DEMO_FLIGHTS_BY_AIRPORT[selectedAirportCode];
    if (preset) {
      setOrigin(preset.origin);
      setOriginCode(preset.originCode);
      setDestination(preset.destination);
      setDestinationCode(preset.destinationCode);
      setFlightNumber(preset.flightNumber);
      setNextFlightNumber(preset.nextFlightNumber);
      setTerminal(preset.terminal);
      setGate(preset.gate);
      setLayoverDurationMinutes(preset.layoverDurationMinutes);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
              <Plane className="w-5 h-5 rotate-45" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Customize Demo Boarding Pass
              </h3>
              <p className="text-xs text-slate-500">
                Set up your simulated flight connection via {selectedAirport.city} ({selectedAirportCode})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Origin & Connecting Flight */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block">Origin City</label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="e.g. Kochi (COK)"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block">Origin IATA Code</label>
              <input
                type="text"
                value={originCode}
                onChange={(e) => setOriginCode(e.target.value)}
                placeholder="COK"
                maxLength={3}
                className="w-full text-xs font-mono font-bold uppercase px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>
          </div>

          {/* Layover Hub (Read-only banner) */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="text-amber-800 font-bold block">Current Layover Hub:</span>
              <span className="text-amber-900">{selectedAirport.city} ({selectedAirportCode}) - {selectedAirport.country}</span>
            </div>
            <span className="text-xl">{selectedAirport.flag}</span>
          </div>

          {/* Destination */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block">Destination City</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. London Heathrow (LHR)"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block">Dest IATA Code</label>
              <input
                type="text"
                value={destinationCode}
                onChange={(e) => setDestinationCode(e.target.value)}
                placeholder="LHR"
                maxLength={3}
                className="w-full text-xs font-mono font-bold uppercase px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>
          </div>

          {/* Flights, Terminal, Gate */}
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block">Inbound Flight</label>
              <input
                type="text"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
                placeholder="EK 531"
                className="w-full text-xs font-mono px-2.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block">Connecting Flight</label>
              <input
                type="text"
                value={nextFlightNumber}
                onChange={(e) => setNextFlightNumber(e.target.value)}
                placeholder="EK 003"
                className="w-full text-xs font-mono px-2.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block">Departing Gate</label>
              <input
                type="text"
                value={gate}
                onChange={(e) => setGate(e.target.value)}
                placeholder="B18"
                className="w-full text-xs font-mono px-2.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Layover Duration */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-bold text-slate-700">
              <span>Total Layover Duration</span>
              <span className="text-sky-600 font-extrabold">{Math.floor(layoverDurationMinutes / 60)}h {layoverDurationMinutes % 60}m</span>
            </div>
            <input
              type="range"
              min={120}
              max={720}
              step={15}
              value={layoverDurationMinutes}
              onChange={(e) => setLayoverDurationMinutes(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-sky-600 hover:bg-sky-500 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-md flex items-center gap-1.5 transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Boarding Pass</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
