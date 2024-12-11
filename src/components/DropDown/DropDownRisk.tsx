// DropDownVerifier.tsx
import React, { useState, useCallback } from 'react';
import { Select } from 'antd';
import { fetchCausesForRiskItem } from '../../requests/tabledata';
import { useNavigate } from 'react-router-dom';
import { useTypeValueContext } from '../../Context/TypeValueContext'; // Dodajemo ovaj import
import './DropdownStyles.css';

interface DropDownRiskProps {
  onSelect: (value: string) => void;
}

const DropDownRisk: React.FC<DropDownRiskProps> = ({ onSelect }) => {
  const [options, setOptions] = useState<{ cause: string; id: number }[]>([]);
  const [value, setValue] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setTypeValue } = useTypeValueContext(); // Pristupamo funkciji za postavljanje vrednosti u context

  const loadOptions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchCausesForRiskItem(navigate, "");
      setOptions(data || []);
    } catch (error) {
      console.error("Error loading verifier options:", error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleChange = (selectedValue: string) => {
    setValue(selectedValue);
    onSelect(selectedValue); // Trigger onSelect when an option is selected
    setTypeValue(selectedValue); // Postavljamo vrednost u context kada korisnik izabere opciju
  };

  return (
    <Select
      value={value}
      onChange={handleChange}
      onDropdownVisibleChange={(open) => open && loadOptions()}
      size="small"
      placeholder="Odaberi rizik"
      loading={loading}
    >
      {options.map(option => (
        <Select.Option key={option.id} value={option.id}>
          {option.cause}
        </Select.Option>
      ))}
    </Select>
  );
};

export default DropDownRisk;
