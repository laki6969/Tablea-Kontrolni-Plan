import React from 'react';
import './TableHeader.css';

interface TableHeaderProps {
  columns: number;
  selectedColumn: number | null;
  handleColumnHeaderClick: (colIndex: number) => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({ columns, selectedColumn, handleColumnHeaderClick }) => {
  return (
    <tr>
      <th></th>
      {Array.from({ length: columns }).map((_, i) => {
        // Merging columns E, F, G (i.e., indexes 4, 5, 6) under "Karakteristika"
        if (i === 5) {
          return (
            <th
              key={i}
              className={selectedColumn === i ? 'selected-column' : ''}
              onClick={() => handleColumnHeaderClick(i)}
              colSpan={3} // Merge columns E, F, G under "Karakteristika"
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span>Karakteristika</span>
              </div>
            </th>
          );
        } else if (i === 9) {
          // Merging columns I, J, K, L, M (i.e., indexes 8, 9, 10, 11, 12) under "Metode"
          return (
            <th
              key={i}
              className={selectedColumn === i ? 'selected-column' : ''}
              onClick={() => handleColumnHeaderClick(i)}
              colSpan={4} // Merge columns I, J, K, L, M under "Metode"
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span>Metode</span>
              </div>
            </th>
          );
        } else if (i === 5 || i === 6 || i === 9 || i === 10 || i === 11 || i === 12 || i === 13) {
          // Skip columns that are already merged (E, F, G and I, J, K, L, M)
          return null;
        } else {
          // For all other columns, render them normally
          return (
            <th
              key={i}
              className={selectedColumn === i ? 'selected-column' : ''}
              onClick={() => handleColumnHeaderClick(i)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span>{String.fromCharCode(65 + i)}</span>
              </div>
            </th>
          );
        }
      })}
    </tr>
  );
};

export default TableHeader;
