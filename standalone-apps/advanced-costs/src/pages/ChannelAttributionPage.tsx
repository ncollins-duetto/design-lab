import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

type ChannelRow = {
  id: string;
  channel: string;
  ruleDefinition: string | null; // null = no rules defined
  active: boolean;
};

const INITIAL_ROWS: ChannelRow[] = [
  { id: '1',  channel: 'Direct Web',                  ruleDefinition: 'Include Rate Codes containing 123AB, 234BD, 345GH', active: true },
  { id: '2',  channel: 'Direct App',                  ruleDefinition: null,                                                 active: false },
  { id: '3',  channel: 'Direct Phone',                ruleDefinition: 'Include Rate Codes containing 123AB, 234BD, 345GH', active: true },
  { id: '4',  channel: 'Direct Walk In',              ruleDefinition: 'Include Rate Codes containing 123AB, 234BD, 345GH', active: true },
  { id: '5',  channel: 'OTA Retail',                  ruleDefinition: 'Include Source Codes containing 456AP',             active: true },
  { id: '6',  channel: 'OTA Opaque',                  ruleDefinition: 'Include Source Codes containing "opaque"',          active: true },
  { id: '7',  channel: 'Metasearch',                  ruleDefinition: 'Include Source Codes containing "metasearch"',      active: true },
  { id: '8',  channel: 'Wholesale/Tour Operator',     ruleDefinition: 'Include Source Codes containing "wholesale"',       active: true },
  { id: '9',  channel: 'GDS/Travel Agent',            ruleDefinition: null,                                                 active: false },
  { id: '10', channel: 'Corporate Direct Portal/API', ruleDefinition: null,                                                 active: false },
  { id: '11', channel: 'Group Direct',                ruleDefinition: 'Group Direct',                                       active: true },
];

function NoRulesCell({ channelId }: { channelId: string }) {
  const navigate = useNavigate();
  return (
    <span style={{ fontSize: 14 }}>
      <span style={{ color: '#d32f2f' }}>No rules defined.</span>
      {' '}
      <span
        style={{ color: '#006461', cursor: 'pointer' }}
        onClick={() => navigate(`/channel-attribution/edit/${channelId}`)}
      >
        Create rules to track channel costs &gt;
      </span>
    </span>
  );
}

export default function ChannelAttributionPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState(INITIAL_ROWS);
  const handleToggle = useCallback((id: string) => {
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, active: !r.active } : r));
  }, []);

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <h1 className="page-title" style={{ margin: 0, flex: 'none' }}>Channels</h1>
          <span className="material-icons" style={{ fontSize: 18, color: '#757575', cursor: 'help' }}
            title="Configure channel cost attribution rules for revenue tracking">info_outline</span>
        </div>
        <p style={{ margin: 0, fontSize: 12, color: '#4f5b60' }}>Last updated 12/01/2023 at 12:12 pm</p>
      </div>

      {/* Table */}
      <div style={{
        border: '1px solid #e0e0e0', borderRadius: 4, overflow: 'hidden',
        boxShadow: '0px 1px 3px rgba(0,0,0,0.2), 0px 1px 1px rgba(0,0,0,0.14), 0px 2px 1px rgba(0,0,0,0.12)',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, background: '#fff' }}>
          <thead>
            <tr style={{ background: '#f8f9fd' }}>
              <th style={{ textAlign: 'left', padding: '11px 16px', fontWeight: 400, color: '#1c1c1c', width: 210, borderBottom: 'none' }}>
                Channel
              </th>
              <th style={{ textAlign: 'left', padding: '11px 16px', fontWeight: 400, color: '#1c1c1c', borderBottom: 'none' }}>
                Rule Definition
              </th>
              <th style={{ width: 50, borderBottom: 'none' }} />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td style={{ padding: '14px 16px', borderBottom: '1px solid #e0e0e0', width: 210, verticalAlign: 'middle' }}>
                  <span
                    className="name-link"
                    style={{ fontSize: 14 }}
                    onClick={() => navigate(`/channel-attribution/edit/${row.id}`)}
                  >
                    {row.channel}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', borderBottom: '1px solid #e0e0e0', verticalAlign: 'middle' }}>
                  {row.ruleDefinition ? (
                    <span style={{ fontSize: 14, color: '#1c1c1c' }}>{row.ruleDefinition}</span>
                  ) : (
                    <NoRulesCell channelId={row.id} />
                  )}
                </td>
                <td style={{ padding: '14px 16px', borderBottom: '1px solid #e0e0e0', width: 50, textAlign: 'center', verticalAlign: 'middle' }}>
                  <label className="toggle">
                    <input type="checkbox" checked={row.active} onChange={() => handleToggle(row.id)} />
                    <span className="slider" />
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
