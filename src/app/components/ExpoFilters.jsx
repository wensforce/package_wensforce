'use client';

import { ChevronDown } from 'lucide-react';

export default function ExpoFilters({
  cities = [],
  months = [],
  selectedCity = null,
  selectedMonth = null,
  onCityChange = () => {},
  onMonthChange = () => {},
}) {
  return (
    <>
      <style>{`
        .filters-container {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          align-items: center;
        }

        .filter-group {
          flex: 1;
          min-width: 200px;
        }

        .filter-label {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #5C6270;
          margin-bottom: 8px;
          display: block;
        }

        .filter-select {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #E4E1D8;
          border-radius: 8px;
          background: #fff;
          color: #0B1F3A;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          appearance: none;
          padding-right: 32px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%230B1F3A' d='M4 6l4 4 4-4'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 10px center;
          background-size: 16px;
          transition: all 0.2s ease;
        }

        .filter-select:hover {
          border-color: #C9A227;
          box-shadow: 0 4px 12px rgba(201, 162, 39, 0.15);
        }

        .filter-select:focus {
          outline: none;
          border-color: #C9A227;
          box-shadow: 0 4px 12px rgba(201, 162, 39, 0.25);
        }

        .filter-select option {
          background: #fff;
          color: #0B1F3A;
          padding: 8px;
        }

        @media (max-width: 640px) {
          .filters-container {
            gap: 12px;
          }

          .filter-group {
            flex: 1;
            min-width: 150px;
          }
        }
      `}</style>

      <div className="filters-container">
        <div className="filter-group">
          <label className="filter-label">City</label>
          <select
            value={selectedCity || ''}
            onChange={(e) => onCityChange(e.target.value || null)}
            className="filter-select"
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Month</label>
          <select
            value={selectedMonth ? selectedMonth.key : ''}
            onChange={(e) => {
              if (!e.target.value) {
                onMonthChange(null);
              } else {
                const selected = months.find((m) => m.key === e.target.value);
                onMonthChange(selected);
              }
            }}
            className="filter-select"
          >
            <option value="">All Months</option>
            {months.map((month) => (
              <option key={month.key} value={month.key}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}
