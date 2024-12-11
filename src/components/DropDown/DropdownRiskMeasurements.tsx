// Dropdown2.tsx
import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTypeValueContext } from '../../Context/TypeValueContext';
import './DropdownStyles.css';
import { fetchCausesForRiskMeasurmentsItem } from '../../requests/tabledata';

interface DropdownRiskMeasurementsProps {
  onSelect: (value: string) => void;
}

const DropdownRiskMeasurements: React.FC<DropdownRiskMeasurementsProps> = ({ onSelect }) => {
  const [options, setOptions] = useState<{ description: string; id: number }[]>([]);
  const [value, setValue] = useState<string>('');
  const navigate = useNavigate();
  const { typeValue: type } = useTypeValueContext(); // Koristimo vrednost iz context-a

  useEffect(() => {
    if (type) {
      const fetchOptions = async () => {
        try {
          const data = await fetchCausesForRiskMeasurmentsItem(navigate, type); // Koristimo type za upit
          setOptions(data);
        } catch (error) {
          console.error("Error fetching options for DropdownRiskMeasurements:", error);
        }
      };
      fetchOptions();
    }
  }, [type, navigate]); // Ponovo pozivamo funkciju kada se `type` promeni

  const handleChange = (selectedValue: string) => {
    setValue(selectedValue);
    onSelect(selectedValue); // Trigger onSelect when an option is selected
  };

  return (
    <Select
      value={value || undefined}
      onChange={handleChange}
      size="small"
      placeholder="Odaberi mere prevencije/ detekcije"
    >
      {options.map(option => (
        <Select.Option key={option.id} value={option.id}>
          {option.description}
        </Select.Option>
      ))}
    </Select>
  );
};

export default DropdownRiskMeasurements;
