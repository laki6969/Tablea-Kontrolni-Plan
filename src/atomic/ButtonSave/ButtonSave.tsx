import React from 'react';
import './ButtonSave.css'; // Importuj CSS za stilove
import { useNavigate } from 'react-router-dom';
import { TextSegment, useToolContext } from '../../Context/ToolContext';
import { insertControlPlanInfo } from '../../requests/tabledata';
import { useRowIdsContext } from '../../Context/RowIdsContext';

interface ButtonSaveProps {
  disabled?: boolean;
}

const ButtonSave: React.FC<ButtonSaveProps> = ({ disabled = false }) => {
  const navigate = useNavigate();
  const { cellContent, activeCell } = useToolContext();
  const { columns } = useRowIdsContext();
  const row = activeCell ? activeCell.row : null;
  //console.log("CELIJA U FOKUSU: ", row);
  const sendCellData = async () => {
    if (row === null) {
      console.error("Greška: Nije izabrana ćelija za slanje podataka.");
      return;
    }

    try {
      const rowData: string[] = [];
      for (let i = 0; i < columns; i++) {
        const key = `${row}-${i}`;
        const cellSegments = cellContent.get(key) as TextSegment[];
        rowData.push(cellSegments ? cellSegments.map(segment => segment.text).join('') : '');
      }

      console.log("Prikupljeni podaci iz ćelija (rowData):", rowData);

      const createControlPlanInfo = {
        control_plan_baseline_id: 1, // Hardkodovan fmea_id kao broj 1
        risk_measurement_id: rowData[1] || '', // Polje za mere prevencije/ detekacije broj
        characteristic_number: rowData[5] || '', // Polje za karakteristični broj
        characteristic_product: rowData[6] || '', // Polje za karakteristični proizvod
        characteristic_process: rowData[7] || '', // Polje za karakteristični proces
        specification: rowData[9] || '', // Polje za specifikaciju
        evaluation: rowData[10] || '', // Polje za evaluaciju
        sample_size: rowData[11] || '', // Polje za veličinu uzorka
        sample_frequency: rowData[12] || '', // Polje za frekvenciju uzorkovanja
        control_method: rowData[13] || '', // Polje za metodu kontrole
        reaction_plan: rowData[14] || '', // Polje za plan reakcije
      };

      console.log("Kreirani podaci (createdControlPlanInfo):", createControlPlanInfo);

      console.log('Slanje podataka za Control Plan:', createControlPlanInfo);
      const response = await insertControlPlanInfo(navigate, createControlPlanInfo);
      console.log("Odgovor backend-a:", response);
      alert("Podaci su uspešno poslati.");      

    } catch (error) {
      console.error(`Greška pri ažuriranju podataka za red ${row}:`, error);
      alert("Došlo je do greške prilikom slanja podataka.");
    }
  };

  return (
    <button className="button-save" onClick={sendCellData} disabled={disabled}>
      <i className="fa fa-floppy-o" aria-hidden="true"></i> Sačuvaj
    </button>
  );
};

export default ButtonSave;
