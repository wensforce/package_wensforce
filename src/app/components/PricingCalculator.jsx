'use client';

import { useState } from 'react';
import { Gem, Crown, Users, Car } from 'lucide-react';

export default function PricingCalculator() {
  const [selectedPlan, setSelectedPlan] = useState('elite');
  const [addOns, setAddOns] = useState({
    extraTrips: 0,
    premiumVehicles: false,
    familyAccess: false,
  });

  const plans = {
    essential: { name: 'Essential', basePrice: 49999, trips: 12 },
    executive: { name: 'Executive', basePrice: 74999, trips: 18 },
    premium: { name: 'Premium', basePrice: 99999, trips: 24 },
    elite: { name: 'Elite', basePrice: 149999, trips: 36, recommended: true },
    sovereign: { name: 'Sovereign', basePrice: 299999, trips: 'Unlimited' },
  };

  const currentPlan = plans[selectedPlan];
  let totalPrice = currentPlan.basePrice;

  // Calculate add-ons
  if (addOns.extraTrips > 0) {
    totalPrice += addOns.extraTrips * 2500; // ₹2,500 per extra trip
  }
  if (addOns.premiumVehicles) {
    totalPrice += 15000; // ₹15,000 for premium vehicle access
  }
  if (addOns.familyAccess) {
    totalPrice += 25000; // ₹25,000 for extended family access
  }

  const monthlyPrice = Math.round(totalPrice / 12);

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-[#F1F3F5] to-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#BF9F00] text-xs tracking-[0.3em] uppercase font-semibold mb-3">
            Customize Your Membership
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
            Interactive Price Calculator
          </h2>
          <p className="text-gray-500 text-lg font-light">
            Build your perfect membership. See the price update in real-time.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Plan Selector */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-6">1. Choose Your Base Plan</h3>

            <div className="space-y-3">
              {Object.entries(plans).map(([key, plan]) => (
                <label
                  key={key}
                  className={`flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedPlan === key
                      ? 'border-[#BF9F00] bg-[#BF9F00]/5'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="plan"
                    value={key}
                    checked={selectedPlan === key}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                    className="w-4 h-4 accent-[#BF9F00] cursor-pointer"
                  />
                  <div className="flex-1 ml-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{plan.name}</span>
                      {plan.recommended && (
                        <span className="text-[10px] bg-[#BF9F00] text-black font-bold px-2 py-0.5 rounded-full">
                          RECOMMENDED
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {typeof plan.trips === 'number' ? `${plan.trips} trips included` : 'Unlimited trips'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">₹{plan.basePrice.toLocaleString('en-IN')}</div>
                    <div className="text-xs text-gray-500">per year</div>
                  </div>
                </label>
              ))}
            </div>

            {/* Add-ons */}
            <h3 className="text-lg font-bold text-gray-900 mt-10 mb-6">2. Add Optional Services</h3>

            <div className="space-y-4">
              {/* Extra Trips */}
              <div className="p-4 bg-white border border-gray-200 rounded-2xl">
                <label className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-900">Extra Trips</span>
                  <span className="text-sm text-gray-500">₹2,500 each</span>
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      setAddOns({ ...addOns, extraTrips: Math.max(0, addOns.extraTrips - 1) })
                    }
                    className="w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    −
                  </button>
                  <span className="text-lg font-bold text-gray-900 flex-1 text-center">
                    {addOns.extraTrips}
                  </span>
                  <button
                    onClick={() => setAddOns({ ...addOns, extraTrips: addOns.extraTrips + 1 })}
                    className="w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Premium Vehicles */}
              <label className="flex items-center p-4 bg-white border border-gray-200 rounded-2xl cursor-pointer hover:border-gray-300 transition-all">
                <input
                  type="checkbox"
                  checked={addOns.premiumVehicles}
                  onChange={(e) =>
                    setAddOns({ ...addOns, premiumVehicles: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#BF9F00] rounded"
                />
                <div className="flex-1 ml-4">
                  <div className="font-medium text-gray-900">Premium Vehicle Access</div>
                  <p className="text-sm text-gray-500">Add one-time premium vehicle booking</p>
                </div>
                <span className="font-semibold text-gray-900">+₹15,000</span>
              </label>

              {/* Family Access */}
              <label className="flex items-center p-4 bg-white border border-gray-200 rounded-2xl cursor-pointer hover:border-gray-300 transition-all">
                <input
                  type="checkbox"
                  checked={addOns.familyAccess}
                  onChange={(e) =>
                    setAddOns({ ...addOns, familyAccess: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#BF9F00] rounded"
                />
                <div className="flex-1 ml-4">
                  <div className="font-medium text-gray-900">Extended Family Access</div>
                  <p className="text-sm text-gray-500">Add 2 additional family members</p>
                </div>
                <span className="font-semibold text-gray-900">+₹25,000</span>
              </label>
            </div>
          </div>

          {/* Right: Price Summary */}
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Your Total</h3>

            {/* Price Box */}
            <div className="sticky top-32 p-8 bg-gradient-to-br from-white to-[#F1F3F5] border-2 border-[#BF9F00]/30 rounded-3xl shadow-lg mb-6">
              {/* Plan Summary */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Your Selected Plan</p>
                <p className="text-2xl font-bold text-gray-900">{currentPlan.name}</p>
              </div>

              {/* Breakdown */}
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Plan</span>
                  <span className="font-medium text-gray-900">
                    ₹{currentPlan.basePrice.toLocaleString('en-IN')}
                  </span>
                </div>
                {addOns.extraTrips > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">{addOns.extraTrips} Extra trips</span>
                    <span className="font-medium text-gray-900">
                      +₹{(addOns.extraTrips * 2500).toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
                {addOns.premiumVehicles && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Premium vehicles</span>
                    <span className="font-medium text-gray-900">+₹15,000</span>
                  </div>
                )}
                {addOns.familyAccess && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Family access</span>
                    <span className="font-medium text-gray-900">+₹25,000</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="p-4 bg-[#BF9F00]/10 border border-[#BF9F00]/20 rounded-2xl mb-6">
                <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Annual Cost</p>
                <p className="text-4xl font-bold text-[#BF9F00] mb-1">
                  ₹{totalPrice.toLocaleString('en-IN')}
                </p>
                <p className="text-sm text-gray-600">₹{monthlyPrice.toLocaleString('en-IN')} per month</p>
              </div>

              {/* CTA Button */}
              <a
                href={`#plans`}
                className="w-full bg-[#BF9F00] text-black font-semibold py-3.5 px-6 rounded-xl hover:bg-[#a88a00] transition-all text-center"
              >
                Proceed to Checkout
              </a>

              {/* Guarantee */}
              <p className="text-xs text-gray-600 text-center mt-4">
                ✓ 15-day money-back guarantee • No hidden charges
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
              <p className="text-sm text-blue-900 font-light">
                <span className="font-semibold">💡 Pro Tip:</span> Elite plan users save ₹15,000/year vs. manually booking vehicles. Most customers upgrade to Elite within their first renewal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
