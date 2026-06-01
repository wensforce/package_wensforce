export const POPULAR_CODES = ["IN", "US", "GB", "AE", "SG", "AU", "CA", "NZ"];

export const COUNTRIES = [
  { code: "IN", dial: "+91",  name: "India" },
  { code: "US", dial: "+1",   name: "United States" },
  { code: "GB", dial: "+44",  name: "United Kingdom" },
  { code: "AE", dial: "+971", name: "UAE" },
  { code: "SG", dial: "+65",  name: "Singapore" },
  { code: "AU", dial: "+61",  name: "Australia" },
  { code: "CA", dial: "+1",   name: "Canada" },
  { code: "NZ", dial: "+64",  name: "New Zealand" },
  { code: "AF", dial: "+93",  name: "Afghanistan" },
  { code: "BD", dial: "+880", name: "Bangladesh" },
  { code: "BH", dial: "+973", name: "Bahrain" },
  { code: "CN", dial: "+86",  name: "China" },
  { code: "DE", dial: "+49",  name: "Germany" },
  { code: "EG", dial: "+20",  name: "Egypt" },
  { code: "FR", dial: "+33",  name: "France" },
  { code: "HK", dial: "+852", name: "Hong Kong" },
  { code: "ID", dial: "+62",  name: "Indonesia" },
  { code: "IL", dial: "+972", name: "Israel" },
  { code: "IT", dial: "+39",  name: "Italy" },
  { code: "JP", dial: "+81",  name: "Japan" },
  { code: "KE", dial: "+254", name: "Kenya" },
  { code: "KW", dial: "+965", name: "Kuwait" },
  { code: "LK", dial: "+94",  name: "Sri Lanka" },
  { code: "MU", dial: "+230", name: "Mauritius" },
  { code: "MY", dial: "+60",  name: "Malaysia" },
  { code: "NP", dial: "+977", name: "Nepal" },
  { code: "NG", dial: "+234", name: "Nigeria" },
  { code: "OM", dial: "+968", name: "Oman" },
  { code: "PH", dial: "+63",  name: "Philippines" },
  { code: "PK", dial: "+92",  name: "Pakistan" },
  { code: "QA", dial: "+974", name: "Qatar" },
  { code: "RU", dial: "+7",   name: "Russia" },
  { code: "SA", dial: "+966", name: "Saudi Arabia" },
  { code: "TH", dial: "+66",  name: "Thailand" },
  { code: "TR", dial: "+90",  name: "Turkey" },
  { code: "TZ", dial: "+255", name: "Tanzania" },
  { code: "VN", dial: "+84",  name: "Vietnam" },
  { code: "ZA", dial: "+27",  name: "South Africa" },
];

export const DEFAULT_COUNTRY = COUNTRIES.find((c) => c.code === "IN");

export const popular = COUNTRIES.filter((c) => POPULAR_CODES.includes(c.code));
export const others  = COUNTRIES
  .filter((c) => !POPULAR_CODES.includes(c.code))
  .sort((a, b) => a.name.localeCompare(b.name));
