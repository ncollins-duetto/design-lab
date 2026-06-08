import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMockCosts, toggleMockCostActive, deleteMockCost } from '../mockAdvancedCosts';

const COST_TYPE: Record<string, string> = {
  guest_acquisition: 'Guest Acquisition',
  variable_room_cleaning: 'Variable Room Cleaning',
  revenue_category: 'Revenue Category',
};
const AFFILIATION: Record<string, string> = {
  stay_date: 'Stay Date', booking_date: 'Booking Date', arrival_date: 'Arrival Date',
};

export default function ListPage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState(getMockCosts);

  const handleToggle = useCallback((id: string) => {
    toggleMockCostActive(id);
    setRecords(getMockCosts());
  }, []);

  const handleDelete = useCallback((id: string) => {
    deleteMockCost(id);
    setRecords(getMockCosts());
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <h1 className="page-title" style={{ margin: 0, flex: 'none' }}>Advanced Costs</h1>
        <button
          onClick={() => navigate('/new')}
          style={{
            marginLeft: 24, display: 'flex', alignItems: 'center', gap: 6,
            background: '#006461', color: '#fff', border: 'none', borderRadius: 4,
            padding: '8px 16px', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', height: 36,
          }}
        >
          <span className="material-icons" style={{ fontSize: 18 }}>add</span>
          New
        </button>
        <div style={{ flex: 1 }} />
        <button className="btn-ghost" title="Download">⬇</button>
      </div>

      <div className="filter-bar">
        <button className="filter-btn">Add Filters</button>
        <span className="no-filters">No filters applied</span>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Cost Type</th>
              <th>Affiliation</th>
              <th>Last Updated</th>
              <th>Active</th>
              <th style={{ width: 48 }} />
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td>
                  <span className="name-link" onClick={() => navigate(`/edit/${r.id}`)}>
                    {r.name}
                  </span>
                </td>
                <td>{COST_TYPE[r.costType] ?? r.costType}</td>
                <td>{AFFILIATION[r.affiliation] ?? r.affiliation}</td>
                <td>{r.lastUpdated}</td>
                <td>
                  <label className="toggle">
                    <input type="checkbox" checked={r.active} onChange={() => handleToggle(r.id)} />
                    <span className="slider" />
                  </label>
                </td>
                <td style={{ textAlign: 'center', width: 48 }}>
                  <button
                    className="btn-del"
                    onClick={() => handleDelete(r.id)}
                    title="Delete"
                    style={{ fontSize: 16 }}
                  >
                    <span className="material-icons" style={{ fontSize: 18, verticalAlign: 'middle' }}>delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
