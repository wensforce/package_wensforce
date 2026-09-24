"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import CountryCodeSelect from "../../components/CountryCodeSelect";
import DatePicker from "../../components/DatePicker";
import { plans as membershipPlans } from "../../data/plans";
import { plans as welcomeIndiaPlans } from "../../data/welcomeIndia";
import { plans as airportConciergePlans } from "../../data/airportConcierge";
import {
  User,
  Phone,
  Mail,
  CalendarDays,
  Wallet,
  MapPin,
  Hash,
  ShieldCheck,
  Car,
  PlaneTakeoff,
  Users,
  FileText,
  Check,
  Send,
  Loader2,
  Sparkles,
  ChevronDown,
  CircleAlert,
  RotateCcw,
} from "lucide-react";
import api from "../../axios/axios";

/* Matches enquiry links: plan.name.toLowerCase().replace(/ /g, "-") */
function toServiceTypeSlug(value) {
  return String(value).toLowerCase().replace(/ /g, "-");
}

function resolveServiceType(packages, plans, param) {
  if (!param) return "";
  const slug = param.toLowerCase();
  if (slug === "customised" || slug === "customized") return "Customised";

  const byName = packages.find((pkg) => toServiceTypeSlug(pkg) === slug);
  if (byName) return byName;

  const byId = plans.find((p) => p.id === slug);
  if (byId && packages.includes(byId.name)) return byId.name;

  return "";
}

/* App-owned query keys — not campaign attribution */
const APP_SEARCH_PARAMS = new Set(["serviceType"]);

const CAMPAIGN_PARAM_KEYS = new Set([
  "gclid",
  "gbraid",
  "wbraid",
  "dclid",
  "gclsrc",
  "fbclid",
  "msclkid",
  "ttclid",
  "twclid",
  "li_fat_id",
  "campaignid",
  "adgroupid",
  "creative",
  "keyword",
  "matchtype",
  "network",
  "device",
  "placement",
  "adposition",
]);

/** Pull gclid / UTMs / click ids from the URL when the enquiry is from a campaign. */
function collectCampaignParams(searchParams) {
  if (!searchParams) return null;
  const campaign = {};
  for (const [key, value] of searchParams.entries()) {
    if (!value || APP_SEARCH_PARAMS.has(key)) continue;
    const lower = key.toLowerCase();
    if (lower.startsWith("utm_") || CAMPAIGN_PARAM_KEYS.has(lower)) {
      campaign[key] = value;
    }
  }
  return Object.keys(campaign).length > 0 ? campaign : null;
}

/* ---------------------------------------------------------------------- *
 * Route → package configuration
 * ---------------------------------------------------------------------- */
const ROUTE_CONFIG = {
  "welcome-india": {
    label: "Welcome India",
    tagline: "Arrival reception & protection packages",
    packages: welcomeIndiaPlans.map((p) => p.name),
    plans: welcomeIndiaPlans,
  },
  membership: {
    label: "Membership",
    tagline: "Ongoing protection membership plans",
    packages: membershipPlans.map((p) => p.name),
    plans: membershipPlans,
  },
  "airport-concierge": {
    label: "Airport Concierge",
    tagline: "Meet & assist packages for a seamless airport experience",
    packages: airportConciergePlans.map((p) => p.name),
    plans: airportConciergePlans,
  },
};

const FALLBACK_ROUTE = {
  label: "General enquiry",
  tagline: "Tell us what you need and we'll take it from there",
  packages: [],
  plans: [],
};

const COUNTRY_CODES = [
  { code: "+91", flag: "🇮🇳", name: "India" },
  { code: "+1", flag: "🇺🇸", name: "United States" },
  { code: "+1", flag: "🇨🇦", name: "Canada" },
  { code: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+61", flag: "🇦🇺", name: "Australia" },
  { code: "+971", flag: "🇦🇪", name: "UAE" },
  { code: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "+65", flag: "🇸🇬", name: "Singapore" },
  { code: "+60", flag: "🇲🇾", name: "Malaysia" },
  { code: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "+33", flag: "🇫🇷", name: "France" },
  { code: "+81", flag: "🇯🇵", name: "Japan" },
  { code: "+86", flag: "🇨🇳", name: "China" },
  { code: "+92", flag: "🇵🇰", name: "Pakistan" },
  { code: "+880", flag: "🇧🇩", name: "Bangladesh" },
  { code: "+94", flag: "🇱🇰", name: "Sri Lanka" },
  { code: "+977", flag: "🇳🇵", name: "Nepal" },
  { code: "+27", flag: "🇿🇦", name: "South Africa" },
  { code: "+55", flag: "🇧🇷", name: "Brazil" },
  { code: "+7", flag: "🇷🇺", name: "Russia" },
];

const BUDGET_RANGES = [
  "5K–10K",
  "10K–20K",
  "20K–50K",
  "50K–1L",
  "No Budget Issue",
];
const CUSTOMISED_TYPES = [
  "Bodyguard",
  "Car",
  "Car + Bodyguard",
  "Airport Transfer",
];
const TRANSFER_MODES = ["Only Car", "Car + Bodyguard"];
const CAR_TYPES = ["Standard", "Luxury", "Both"];
const BODYGUARD_TYPES = ["Armed", "Unarmed", "Both"];
const CAR_CATEGORIES = [
  "SUV",
  "Sedan",
  "Hatchback",
  "Limousine",
  "Saloon",
  "Lounge",
];
const CITY_SUGGESTIONS = [
  "Mumbai",
  "Delhi NCR",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Goa",
];

const INITIAL_STATE = {
  name: "",
  countryCode: "+91",
  phone: "",
  email: "",
  serviceDate: "",
  budgetRange: "",
  serviceCity: "",
  noOfDays: "",
  serviceType: "",
  customisedType: "",
  transferMode: "",
  pickupLocation: "",
  dropLocation: "",
  carType: "",
  bodyguardType: "",
  carCategoryStandard: [],
  carCategoryLuxury: [],
  noOfStandardCars: "",
  noOfLuxuryCars: "",
  noOfArmed: "",
  noOfUnarmed: "",
  additionalFacilities: "",
};

/* ---------------------------------------------------------------------- *
 * Small shared UI primitives
 * ---------------------------------------------------------------------- */
const inputClass =
  "w-full rounded-md border border-[var(--color-border)] bg-white px-3.5 py-2.5 text-[15px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] outline-none transition focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[var(--color-gold-light)]";

function FieldLabel({ icon: Icon, children, required }) {
  return (
    <label className="mb-2 flex items-center gap-2 text-[13.5px] font-medium text-[var(--color-text-secondary)]">
      <Icon
        size={15}
        className="text-[var(--color-gold-dark)]"
        strokeWidth={1.75}
      />
      {children}
      {required && <span className="text-[var(--color-gold-dark)]">*</span>}
    </label>
  );
}

function ErrorText({ message }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs text-[var(--color-error)]">
      <CircleAlert size={12} /> {message}
    </p>
  );
}

function Select({ value, onChange, children }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} appearance-none pr-9`}
      >
        {children}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]"
      />
    </div>
  );
}

function SectionHeading({ icon: Icon, title, description }) {
  return (
    <div className="mb-6 flex items-start gap-3.5">
      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--color-navy)]/15 bg-[var(--color-navy)] text-[var(--color-gold-light)]">
        <Icon size={17} strokeWidth={1.75} />
      </div>
      <div>
        <h2
          className="text-[1.35rem] font-semibold leading-snug text-[var(--color-navy)]"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {title}
        </h2>
        {description && (
          <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

function CategoryPills({ selected, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {CAR_CATEGORIES.map((cat) => {
        const active = selected.includes(cat);
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onToggle(cat)}
            className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] transition ${
              active
                ? "border-[var(--color-gold)] bg-[var(--color-gold-light)] text-[var(--color-navy)]"
                : "border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:border-[var(--color-navy)]/30"
            }`}
          >
            {active && <Check size={13} />}
            {cat}
          </button>
        );
      })}
    </div>
  );
}

function ChoicePills({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`rounded-full border px-4 py-2 text-[13px] transition ${
              active
                ? "border-[var(--color-navy)] bg-[var(--color-navy)] text-[var(--color-gold-light)]"
                : "border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:border-[var(--color-navy)]/30"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------------- *
 * Main component
 * ---------------------------------------------------------------------- */
export default function EnquiryForm({ routeOverride }) {
  const params = useParams();
  const searchParams = useSearchParams();
  const routeSlug =
    routeOverride ??
    (Array.isArray(params?.category) ? params.category[0] : params?.category) ??
    "";
  const route = ROUTE_CONFIG[routeSlug] ?? FALLBACK_ROUTE;
  const serviceTypeParam = searchParams.get("serviceType");
  const campaignParams = collectCampaignParams(searchParams);

  const [form, setForm] = useState(() => ({
    ...INITIAL_STATE,
    serviceType: resolveServiceType(
      route.packages,
      route.plans ?? [],
      serviceTypeParam,
    ),
  }));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Preselect when the option becomes available (e.g. route packages load / URL changes)
  useEffect(() => {
    const resolved = resolveServiceType(
      route.packages,
      route.plans ?? [],
      serviceTypeParam,
    );
    if (!resolved) return;
    setForm((prev) =>
      prev.serviceType === resolved ? prev : { ...prev, serviceType: resolved },
    );
  }, [route.packages, route.plans, serviceTypeParam]);

  const isCustomised = form.serviceType === "Customised";
  const airportWithBodyguard =
    form.customisedType === "Airport Transfer" &&
    form.transferMode === "Car + Bodyguard";
  const showAirportFields =
    isCustomised && form.customisedType === "Airport Transfer";
  const showCarType =
    isCustomised &&
    (form.customisedType === "Car" ||
      form.customisedType === "Car + Bodyguard" ||
      airportWithBodyguard);
  const showBodyguardType =
    isCustomised &&
    (form.customisedType === "Bodyguard" ||
      form.customisedType === "Car + Bodyguard" ||
      airportWithBodyguard);
  const showStandardCar =
    showCarType && (form.carType === "Standard" || form.carType === "Both");
  const showLuxuryCar =
    showCarType && (form.carType === "Luxury" || form.carType === "Both");
  const showArmed =
    showBodyguardType &&
    (form.bodyguardType === "Armed" || form.bodyguardType === "Both");
  const showUnarmed =
    showBodyguardType &&
    (form.bodyguardType === "Unarmed" || form.bodyguardType === "Both");

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function toggleCategory(list, value) {
    setForm((prev) => {
      const current = prev[list];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [list]: next };
    });
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Enter the enquirer's name";
    if (!form.phone.trim()) next.phone = "Enter a phone number";
    if (!form.serviceDate) next.serviceDate = "Pick a service date";
    if (!form.serviceCity.trim()) next.serviceCity = "Enter the service city";
    if (!form.noOfDays || Number(form.noOfDays) < 1)
      next.noOfDays = "Enter the number of days";
    if (!form.serviceType) next.serviceType = "Select a service";

    if (isCustomised) {
      if (!form.budgetRange) next.budgetRange = "Select a budget range";
      if (!form.customisedType)
        next.customisedType = "Select what you'd like to customise";
      if (showAirportFields) {
        if (!form.transferMode) next.transferMode = "Select a transfer mode";
        if (!form.pickupLocation.trim())
          next.pickupLocation = "Enter a pickup location";
        if (!form.dropLocation.trim())
          next.dropLocation = "Enter a drop location";
      }
      if (showCarType && !form.carType) next.carType = "Select a car type";
      if (showBodyguardType && !form.bodyguardType)
        next.bodyguardType = "Select a bodyguard type";
      if (showStandardCar) {
        if (form.carCategoryStandard.length === 0)
          next.carCategoryStandard = "Pick at least one category";
        if (!form.noOfStandardCars || Number(form.noOfStandardCars) < 1)
          next.noOfStandardCars = "Enter a number";
      }
      if (showLuxuryCar) {
        if (form.carCategoryLuxury.length === 0)
          next.carCategoryLuxury = "Pick at least one category";
        if (!form.noOfLuxuryCars || Number(form.noOfLuxuryCars) < 1)
          next.noOfLuxuryCars = "Enter a number";
      }
      if (showArmed && (!form.noOfArmed || Number(form.noOfArmed) < 1))
        next.noOfArmed = "Enter a number";
      if (showUnarmed && (!form.noOfUnarmed || Number(form.noOfUnarmed) < 1))
        next.noOfUnarmed = "Enter a number";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      route: routeSlug || null,
      name: form.name,
      phone: `${form.countryCode}${form.phone}`,
      email: form.email || null,
      serviceDate: form.serviceDate,
      serviceCity: form.serviceCity,
      noOfDays: Number(form.noOfDays),
      serviceType: form.serviceType,
      ...(isCustomised && {
        customisation: {
          budgetRange: form.budgetRange,
          customisedType: form.customisedType,
          ...(showAirportFields && {
            transferMode: form.transferMode,
            pickupLocation: form.pickupLocation,
            dropLocation: form.dropLocation,
          }),
          ...(showCarType && {
            carType: form.carType,
            ...(showStandardCar && {
              standard: {
                categories: form.carCategoryStandard,
                count: Number(form.noOfStandardCars),
              },
            }),
            ...(showLuxuryCar && {
              luxury: {
                categories: form.carCategoryLuxury,
                count: Number(form.noOfLuxuryCars),
              },
            }),
          }),
          ...(showBodyguardType && {
            bodyguardType: form.bodyguardType,
            ...(showArmed && { armedCount: Number(form.noOfArmed) }),
            ...(showUnarmed && { unarmedCount: Number(form.noOfUnarmed) }),
          }),
        },
      }),
      additionalFacilities: form.additionalFacilities || null,
      ...(campaignParams && {
        fromCampaign: true,
        campaign: campaignParams,
      }),
    };

    try {
      setSubmitting(true);
      const response = await api.post("/enquiry", payload);
      if (response.status === 200) {
        setSubmitted(true);
      } else {
        throw new Error("Failed to submit enquiry");
      }
    } catch (error) {
      console.error("[WENS Force — Enquiry submit error]", error);
      setErrors({
        general: "Failed to submit enquiry. Please try again later.",
      });
    } finally {
      setSubmitting(false);
    }
    // ----------------------------------------------------------------------
  }

  return (
    <div
      className="min-h-screen antialiased"
      style={{
        background: "var(--color-cream)",
        color: "var(--color-text-primary)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <div className="mx-auto grid max-w-8xl grid-cols-1 lg:grid-cols-[420px_1fr]">
        {/* Left rail */}
        <aside
          className="relative overflow-hidden px-8 py-14 lg:sticky lg:top-0 lg:h-screen lg:px-10 lg:py-16"
          style={{ background: "var(--color-navy)" }}
        >
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-px"
            style={{
              background:
                "linear-gradient(to bottom, transparent, var(--color-gold), transparent)",
            }}
          />

          <div className="flex items-center gap-2.5">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full border"
              style={{
                borderColor: "var(--color-gold)",
                color: "var(--color-gold)",
              }}
            >
              <ShieldCheck size={17} strokeWidth={1.75} />
            </div>
            <span
              className="text-[15px] tracking-wide text-[var(--color-gold-light)]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              WENS Force
            </span>
          </div>

          <h1
            className="mt-10 text-[2.15rem] font-semibold leading-[1.15] text-white lg:text-[2.4rem]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {route.label}
          </h1>
          <div
            className="mt-4 h-px w-12"
            style={{ background: "var(--color-gold)" }}
          />
          <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-white/60">
            {route.tagline}
          </p>

          <div className="mt-12 space-y-4 border-t border-white/10 pt-8 lg:absolute lg:bottom-16 lg:left-10 lg:right-10 lg:mt-0 lg:border-t lg:pt-8">
            <p className="flex items-start gap-2.5 text-sm leading-relaxed text-white/50">
              <ShieldCheck
                size={15}
                className="mt-0.5 shrink-0"
                style={{ color: "var(--color-gold)" }}
              />
              Every enquiry is reviewed by our operations desk directly — no
              forwarding, no spam.
            </p>
          </div>
        </aside>

        {/* Form */}
        <div className="px-6 py-14 sm:px-10 lg:px-16 lg:py-20">
          {submitted ? (
            <SuccessPanel
              onReset={() => {
                setForm({
                  ...INITIAL_STATE,
                  serviceType: resolveServiceType(
                    route.packages,
                    route.plans ?? [],
                    serviceTypeParam,
                  ),
                });
                setSubmitted(false);
              }}
            />
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="mx-auto max-w-2xl space-y-12"
            >
              {/* Contact details */}
              <section>
                <SectionHeading icon={User} title="Your details" />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <FieldLabel icon={User} required>
                      Name
                    </FieldLabel>
                    <input
                      className={inputClass}
                      placeholder="Full name"
                      value={form.name}
                      onChange={(e) => setField("name", e.target.value)}
                    />
                    <ErrorText message={errors.name} />
                  </div>

                  <div>
                    <FieldLabel icon={Phone} required>
                      Phone
                    </FieldLabel>
                    <div className="flex gap-2">
                      <CountryCodeSelect
                        countries={COUNTRY_CODES}
                        value={form.countryCode}
                        onChange={(code) => setField("countryCode", code)}
                      />
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        className={inputClass}
                        placeholder="98765 43210"
                        value={form.phone}
                        onChange={(e) =>
                          setField(
                            "phone",
                            e.target.value.replace(/\D/g, "").slice(0, 10),
                          )
                        }
                      />
                    </div>
                    <ErrorText message={errors.phone} />
                  </div>

                  <div className="sm:col-span-2">
                    <FieldLabel icon={Mail}>Email</FieldLabel>
                    <input
                      type="email"
                      className={inputClass}
                      placeholder="name@example.com"
                      value={form.email}
                      onChange={(e) => setField("email", e.target.value)}
                    />
                  </div>
                </div>
              </section>

              {/* Service details */}
              <section
                className="pt-10"
                style={{ borderTop: "1px solid var(--color-border)" }}
              >
                <SectionHeading icon={Sparkles} title="Service details" />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <FieldLabel icon={CalendarDays} required>
                      Service date
                    </FieldLabel>
                    <DatePicker
                      value={form.serviceDate}
                      onChange={(v) => setField("serviceDate", v)}
                      minDate={new Date()}
                    />
                    <ErrorText message={errors.serviceDate} />
                  </div>

                  <div>
                    <FieldLabel icon={Hash} required>
                      No. of days
                    </FieldLabel>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={1}
                      className={inputClass}
                      placeholder="e.g. 3"
                      value={form.noOfDays}
                      onChange={(e) =>
                        setField(
                          "noOfDays",
                          e.target.value.replace(/\D/g, "").slice(0, 2),
                        )
                      }
                    />
                    <ErrorText message={errors.noOfDays} />
                  </div>

                  <div>
                    <FieldLabel icon={MapPin} required>
                      Service city
                    </FieldLabel>
                    <input
                      list="wens-city-suggestions"
                      className={inputClass}
                      placeholder="e.g. Mumbai"
                      value={form.serviceCity}
                      onChange={(e) => setField("serviceCity", e.target.value)}
                    />
                    <datalist id="wens-city-suggestions">
                      {CITY_SUGGESTIONS.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                    <ErrorText message={errors.serviceCity} />
                  </div>

                  <div>
                    <FieldLabel icon={ShieldCheck} required>
                      Service type
                    </FieldLabel>
                    <Select
                      value={form.serviceType}
                      onChange={(v) => setField("serviceType", v)}
                    >
                      <option value="">Select a package</option>
                      {route.packages.map((pkg) => (
                        <option key={pkg} value={pkg}>
                          {pkg}
                        </option>
                      ))}
                      <option value="Customised">Customised</option>
                    </Select>
                    {route.packages.length === 0 && (
                      <p className="mt-1.5 text-xs text-[var(--color-text-tertiary)]">
                        No fixed packages for this link — choose Customised to
                        build one below.
                      </p>
                    )}
                    <ErrorText message={errors.serviceType} />
                  </div>
                </div>
              </section>

              {/* Customisation */}
              {isCustomised && (
                <section
                  className="pt-10"
                  style={{ borderTop: "1px solid var(--color-border)" }}
                >
                  <SectionHeading
                    icon={Car}
                    title="Customise your service"
                    description="Tell us exactly what protection or transport you need"
                  />

                  <div className="space-y-8">
                    <div>
                      <FieldLabel icon={Wallet} required>
                        Budget range
                      </FieldLabel>
                      <Select
                        value={form.budgetRange}
                        onChange={(v) => setField("budgetRange", v)}
                      >
                        <option value="">Select a range</option>
                        {BUDGET_RANGES.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </Select>
                      <ErrorText message={errors.budgetRange} />
                    </div>

                    <div>
                      <FieldLabel icon={Sparkles} required>
                        What do you need?
                      </FieldLabel>
                      <ChoicePills
                        options={CUSTOMISED_TYPES}
                        value={form.customisedType}
                        onChange={(v) =>
                          setForm((prev) => ({
                            ...prev,
                            customisedType: v,
                            transferMode: "",
                            carType: "",
                            bodyguardType: "",
                            carCategoryStandard: [],
                            carCategoryLuxury: [],
                          }))
                        }
                      />
                      <ErrorText message={errors.customisedType} />
                    </div>

                    {showAirportFields && (
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <FieldLabel icon={PlaneTakeoff} required>
                            Transfer mode
                          </FieldLabel>
                          <ChoicePills
                            options={TRANSFER_MODES}
                            value={form.transferMode}
                            onChange={(v) => setField("transferMode", v)}
                          />
                          <ErrorText message={errors.transferMode} />
                        </div>
                        <div>
                          <FieldLabel icon={MapPin} required>
                            Pickup location
                          </FieldLabel>
                          <input
                            className={inputClass}
                            placeholder="e.g. Terminal 2, CSMIA"
                            value={form.pickupLocation}
                            onChange={(e) =>
                              setField("pickupLocation", e.target.value)
                            }
                          />
                          <ErrorText message={errors.pickupLocation} />
                        </div>
                        <div>
                          <FieldLabel icon={MapPin} required>
                            Drop location
                          </FieldLabel>
                          <input
                            className={inputClass}
                            placeholder="e.g. Hotel / residence address"
                            value={form.dropLocation}
                            onChange={(e) =>
                              setField("dropLocation", e.target.value)
                            }
                          />
                          <ErrorText message={errors.dropLocation} />
                        </div>
                      </div>
                    )}

                    {showCarType && (
                      <div>
                        <FieldLabel icon={Car} required>
                          Car type
                        </FieldLabel>
                        <ChoicePills
                          options={CAR_TYPES}
                          value={form.carType}
                          onChange={(v) => setField("carType", v)}
                        />
                        <ErrorText message={errors.carType} />
                      </div>
                    )}

                    {showBodyguardType && (
                      <div>
                        <FieldLabel icon={ShieldCheck} required>
                          Bodyguard type
                        </FieldLabel>
                        <ChoicePills
                          options={BODYGUARD_TYPES}
                          value={form.bodyguardType}
                          onChange={(v) => setField("bodyguardType", v)}
                        />
                        <ErrorText message={errors.bodyguardType} />
                      </div>
                    )}

                    {showStandardCar && (
                      <div
                        className="rounded-xl p-5"
                        style={{
                          background: "var(--color-white)",
                          border: "1px solid var(--color-border)",
                        }}
                      >
                        <p className="mb-4 text-sm font-medium text-[var(--color-navy)]">
                          Standard cars
                        </p>
                        <div className="space-y-4">
                          <div>
                            <FieldLabel icon={Car} required>
                              Car category
                            </FieldLabel>
                            <CategoryPills
                              selected={form.carCategoryStandard}
                              onToggle={(v) =>
                                toggleCategory("carCategoryStandard", v)
                              }
                            />
                            <ErrorText message={errors.carCategoryStandard} />
                          </div>
                          <div className="max-w-[200px]">
                            <FieldLabel icon={Hash} required>
                              No. of standard cars
                            </FieldLabel>
                            <input
                              type="number"
                              min={1}
                              className={inputClass}
                              value={form.noOfStandardCars}
                              onChange={(e) =>
                                setField("noOfStandardCars", e.target.value)
                              }
                            />
                            <ErrorText message={errors.noOfStandardCars} />
                          </div>
                        </div>
                      </div>
                    )}

                    {showLuxuryCar && (
                      <div
                        className="rounded-xl p-5"
                        style={{
                          background: "var(--color-white)",
                          border: "1px solid var(--color-border)",
                        }}
                      >
                        <p className="mb-4 text-sm font-medium text-[var(--color-navy)]">
                          Luxury cars
                        </p>
                        <div className="space-y-4">
                          <div>
                            <FieldLabel icon={Car} required>
                              Car category
                            </FieldLabel>
                            <CategoryPills
                              selected={form.carCategoryLuxury}
                              onToggle={(v) =>
                                toggleCategory("carCategoryLuxury", v)
                              }
                            />
                            <ErrorText message={errors.carCategoryLuxury} />
                          </div>
                          <div className="max-w-[200px]">
                            <FieldLabel icon={Hash} required>
                              No. of luxury cars
                            </FieldLabel>
                            <input
                              type="number"
                              min={1}
                              className={inputClass}
                              value={form.noOfLuxuryCars}
                              onChange={(e) =>
                                setField("noOfLuxuryCars", e.target.value)
                              }
                            />
                            <ErrorText message={errors.noOfLuxuryCars} />
                          </div>
                        </div>
                      </div>
                    )}

                    {(showArmed || showUnarmed) && (
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        {showArmed && (
                          <div>
                            <FieldLabel icon={Users} required>
                              No. of armed
                            </FieldLabel>
                            <input
                              type="number"
                              inputMode="numeric"
                              min={1}
                              className={inputClass}
                              value={form.noOfArmed}
                              onChange={(e) =>
                                setField(
                                  "noOfArmed",
                                  e.target.value.replace(/\D/g, "").slice(0, 3),
                                )
                              }
                            />
                            <ErrorText message={errors.noOfArmed} />
                          </div>
                        )}
                        {showUnarmed && (
                          <div>
                            <FieldLabel icon={Users} required>
                              No. of unarmed
                            </FieldLabel>
                            <input
                              type="number"
                              inputMode="numeric"
                              min={1}
                              className={inputClass}
                              value={form.noOfUnarmed}
                              onChange={(e) =>
                                setField(
                                  "noOfUnarmed",
                                  e.target.value.replace(/\D/g, "").slice(0, 3),
                                )
                              }
                            />
                            <ErrorText message={errors.noOfUnarmed} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Additional facilities */}
              <section
                className="pt-10"
                style={{ borderTop: "1px solid var(--color-border)" }}
              >
                <SectionHeading icon={FileText} title="Anything else?" />
                <FieldLabel icon={FileText}>Additional facilities</FieldLabel>
                <textarea
                  className={`${inputClass} min-h-[110px] resize-y`}
                  placeholder="Any special requirements we should know about"
                  value={form.additionalFacilities}
                  onChange={(e) =>
                    setField("additionalFacilities", e.target.value)
                  }
                />
              </section>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-md px-6 py-3.5 text-[15px] font-medium transition disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-10"
                style={{
                  background: "var(--color-gold)",
                  color: "var(--color-navy)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--color-gold-dark)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "var(--color-gold)")
                }
              >
                {submitting ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Sending enquiry…
                  </>
                ) : (
                  <>
                    <Send size={17} />
                    Submit enquiry
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function SuccessPanel({ onReset }) {
  return (
    <div
      className="mx-auto max-w-2xl rounded-xl p-10 text-center sm:p-14"
      style={{
        background: "var(--color-white)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div
        className="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
        style={{
          background: "var(--color-navy)",
          color: "var(--color-gold-light)",
        }}
      >
        <Check size={24} />
      </div>
      <h2
        className="mt-6 text-2xl font-semibold text-[var(--color-navy)]"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        Enquiry received
      </h2>
      <div
        className="mx-auto mt-3 h-px w-10"
        style={{ background: "var(--color-gold)" }}
      />
      <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-[var(--color-text-secondary)]">
        Our operations desk has your details and will get back to you shortly.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-8 inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium transition"
        style={{
          border: "1px solid var(--color-navy)",
          color: "var(--color-navy)",
        }}
      >
        <RotateCcw size={15} />
        Submit another enquiry
      </button>
    </div>
  );
}
