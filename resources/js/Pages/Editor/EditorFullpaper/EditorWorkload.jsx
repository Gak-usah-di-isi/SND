import { editorLayout } from '../../../Components/ui/shared/EditorPageLayout';
import { DataTable } from '../../../Components/ui/DataTable';

const CELL = { fontSize: 13, fontFamily: 'Manrope,sans-serif' };

/* Pill angka — pola badge yang sama dipakai di Admin/Summary/Index.jsx */
function CountPill({ value, bg, color }) {
  return (
    <span className="inline-block px-3 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: bg, color }}>
      {value}
    </span>
  );
}

export default function EditorFullpaperWorkloadPage({ workloads = [], badgeCounts }) {
  return (
    <>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2A3D', marginBottom: 4, fontFamily: 'Manrope,sans-serif' }}>
        Review Workload
      </h1>
      <p style={{ fontSize: 14, color: '#6B7280', fontFamily: 'Manrope,sans-serif', margin: '0 0 20px' }}>
        Beban review full paper per reviewer
      </p>

      <DataTable
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'in_review', label: 'In Review' },
          { key: 'completed', label: 'Completed' },
          { key: 'assigned', label: 'Assigned' },
        ]}
        empty={<p className="font-medium text-gray-500">No reviewers found</p>}
      >
        {workloads.map((w, i) => (
          <tr key={i} className="hover:bg-gray-50 transition-colors border-b border-gray-100">
            <td className="px-6 py-4">
              <span style={{ ...CELL, fontWeight: 600, color: '#1F2A3D' }}>{w.name}</span>
            </td>
            <td className="px-6 py-4">
              <CountPill value={w.in_review} bg="rgba(239,68,68,0.1)" color="#EF4444" />
            </td>
            <td className="px-6 py-4">
              <CountPill value={w.completed} bg="rgba(19,222,185,0.1)" color="#10B981" />
            </td>
            <td className="px-6 py-4">
              <CountPill value={w.assigned} bg="rgba(1,82,234,0.1)" color="#0152EA" />
            </td>
          </tr>
        ))}
      </DataTable>
    </>
  );
}

EditorFullpaperWorkloadPage.layout = editorLayout;
