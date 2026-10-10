import React from 'react';
import { useApp } from '../context/AppContext';
import { RUNNER_SKINS } from '../data/skins';
import { X, ShoppingBag, Check, Lock, Sparkles, Coins } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DutyFreeShopModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { userStats, unlockSkin, selectSkin } = useApp();

  if (!isOpen) return null;

  const unlockedIds = userStats.unlockedSkinIds || ['skin-default'];
  const activeSkinId = userStats.selectedSkinId || 'skin-default';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 space-y-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl">
              🛍️
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">
                Transit Duty-Free Wardrobe
              </h3>
              <p className="text-xs text-slate-500">
                Unlock stylish traveler skins for Dubai Dash Run with your virtual coins!
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

        {/* Current wallet balance banner */}
        <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-center justify-between text-xs">
          <span className="font-bold text-amber-800">Your Shared Coin Balance:</span>
          <span className="font-black text-base text-amber-900 flex items-center gap-1">
            <span>🪙</span>
            <span>{userStats.coins} Coins</span>
          </span>
        </div>

        {/* Skins Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
          {RUNNER_SKINS.map((skin) => {
            const isUnlocked = unlockedIds.includes(skin.id);
            const isSelected = activeSkinId === skin.id;
            const canAfford = userStats.coins >= skin.priceCoins;

            return (
              <div
                key={skin.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-sky-500 bg-sky-50/40 ring-2 ring-sky-200'
                    : isUnlocked
                    ? 'border-emerald-200 bg-white hover:bg-slate-50'
                    : 'border-slate-200 bg-slate-50/60'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{skin.icon}</span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">
                          {skin.name}
                        </h4>
                        <span className="text-[10px] text-slate-500 block">
                          {skin.priceCoins === 0 ? 'Default Outfit' : `${skin.priceCoins} Coins`}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="text-[10px] font-black text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                        EQUIPPED
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {skin.description}
                  </p>

                  {/* Color preview dots */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-400">Palette:</span>
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-slate-300"
                      style={{ backgroundColor: skin.jacketColor }}
                      title="Jacket / Upper"
                    />
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-slate-300"
                      style={{ backgroundColor: skin.pantsColor }}
                      title="Pants / Bottom"
                    />
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-slate-300"
                      style={{ backgroundColor: skin.bagColor }}
                      title="Luggage / Pack"
                    />
                  </div>
                </div>

                {/* Action button */}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  {isSelected ? (
                    <button
                      disabled
                      className="w-full py-1.5 text-xs font-bold text-sky-700 bg-sky-100 rounded-xl cursor-default"
                    >
                      Currently Equipped
                    </button>
                  ) : isUnlocked ? (
                    <button
                      onClick={() => selectSkin(skin.id)}
                      className="w-full py-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-colors"
                    >
                      Equip Outfit
                    </button>
                  ) : (
                    <button
                      onClick={() => unlockSkin(skin.id)}
                      disabled={!canAfford}
                      className={`w-full py-1.5 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 ${
                        canAfford
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-sm'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Lock className="w-3 h-3" />
                      <span>Unlock ({skin.priceCoins} 🪙)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl text-xs transition-colors"
          >
            Close Duty-Free Shop
          </button>
        </div>
      </div>
    </div>
  );
};
