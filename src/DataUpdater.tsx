import React, { useState, useEffect } from 'react';
import { updateControlPlanInfo as updateControlPlanInfoRequest } from './requests/tabledata'; // Renamed function import
import { TextSegment, useToolContext } from './Context/ToolContext'; 
import { useNavigate } from 'react-router-dom';
import { useUpdateContext } from './Context/UpdateContext';
import Loader from './components/Loader/Loader'; 
import { useRowIdsContext } from './Context/RowIdsContext';

interface DataUpdaterProps {
  rowIndex: number;
}

const DataUpdater: React.FC<DataUpdaterProps> = ({
  rowIndex,
}) => {
  const navigate = useNavigate();
  const { cellContent } = useToolContext();
  const { updateDataBase } = useUpdateContext();
  const { rowIds } = useRowIdsContext(); 
  
  const [isLoading, setIsLoading] = useState(false); // Lokalno stanje za loader 

  const updateCellData = async () => {
    setIsLoading(true);
    try {
      const rowData: string[] = [];
      for (let i = 0; i < 15; i++) {  // Assumes 15 columns
        const key = `${rowIndex}-${i}`;
        const cellSegments = cellContent.get(key) as TextSegment[];
        rowData.push(cellSegments ? cellSegments.map(segment => segment.text).join('') : '');
      }
  
      const updatedControlPlanInfo = {
        characteristic_number: rowData[5] || '',
        characteristic_process: rowData[7] || '',
        specification: rowData[9] || '',
        evaluation: rowData[10] || '',
        sample_size: rowData[11] || '',
        sample_frequency: rowData[12] || '',
        control_method: rowData[13] || '',
        reaction_plan: rowData[14] || '',
      }; 

      const id = rowIds.get(rowIndex);
      if (typeof id === 'number' && !isNaN(id)) {
        console.log('Updating Control Plan row with ID:', id, updatedControlPlanInfo);
        // Call the function to update the control plan info in the backend
        await updateControlPlanInfoRequest(navigate, id, updatedControlPlanInfo);
      }
    } catch (error) {
      console.error(`Error while updating data for row ${rowIndex}:`, error);
    } finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    if (updateDataBase.rowIndex === rowIndex) {
      console.log(`Triggering data update for row: ${rowIndex}`);
      updateCellData();
    }
  }, [updateDataBase]);

  return (
    <>
      {isLoading && <Loader />} {/* Show loader when data is loading */}
    </>
  );
};

export default DataUpdater;
