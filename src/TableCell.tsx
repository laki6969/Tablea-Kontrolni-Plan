import React, { useRef, useEffect, useCallback, useState } from 'react';
import { TextSegment, useToolContext  } from './Context/ToolContext';
import { useUpdateContext } from './Context/UpdateContext';
import { useColumnContext } from './Context/ColumnContext';
import DropdownRiskMeasurements from './components/DropDown/DropdownRiskMeasurements'; // Import Dropdown2 for column 3
import { useNewRowsContext } from './Context/NewRowsContext';
import DropDownRisk from './components/DropDown/DropDownRisk';


interface TableCellProps {
  col: number;
  row: number;
  content: TextSegment[];
  isSelected?: boolean; // Prop to indicate if the cell is part of a selected column
  onCellClick?: () => void; // New prop to handle cell click
  onCellUpdate?: (row: number, col: number, content: TextSegment[]) => void; // Prop for handling updates when focus is lost
}

const TableCell: React.FC<TableCellProps> = ({
  col,
  row,
  content,
  onCellUpdate = () => {}, // Default empty function for update logic
}) => {
  const { 
    setCellContent,
    setActiveCell,  // Iz ToolContext-a koristimo setActiveCell ovde
    isBoldActive,
    isItalicActive,
    isUnderlineActive,
    activeFontColor,
    activeBackgroundColor,
    activeTextAlign
  } = useToolContext(); // Dobijamo podatke iz ToolContext-a
  const {isSelected, onCellClick} = useColumnContext(); // Ovim menjaš ime colIndex u col
  const readOnlyColumns = [0, 1, 2, 3, 8]; // Primer: Kolone 0 i 1 su read-only
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [hasChanged, setHasChanged] = useState(false);
  const { setUpdateDataBase } = useUpdateContext();
  const { newRows } = useNewRowsContext(); // Get the newRows context
  //const [dropdown2Type, setDropdown2Type] = useState(''); // State to store type for Dropdown2

  // Proveri da li je trenutna kolona read-only
const isReadOnly = readOnlyColumns.includes(col);
  
  useEffect(() => {
    if (textareaRef.current) {
      adjustTextareaHeight(textareaRef.current);
    }
  }, [content]);

  const adjustTextareaHeight = useCallback((textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, []);

  const updateCellContent = (selectedText: string) => {
    const updatedContent: TextSegment[] = [
      {
        text: selectedText,
        isBold: isBoldActive,
        isItalic: isItalicActive,
        isUnderline: isUnderlineActive,
        fontColor: activeFontColor,
        backgroundColor: activeBackgroundColor,
        textAlign: activeTextAlign,
      },
    ];
    setCellContent(row, col, updatedContent);
    onCellUpdate(row, col, updatedContent); // Trigger update for backend
    setHasChanged(true);
  };
  

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isReadOnly) return; // Ne dozvoljava promene ako je polje read-only
    const value = event.target.value;
    let updatedContent = splitTextIntoSegments(
      value,
      isBoldActive,
      isItalicActive,
      isUnderlineActive,
      activeFontColor,
      content[0]?.backgroundColor || activeBackgroundColor,
      activeTextAlign
    );
    setCellContent(row, col, updatedContent);
    setHasChanged(true);
    adjustTextareaHeight(event.target);
  };

  const handleBlur = () => {
    if (hasChanged) {
      onCellUpdate(row, col, content); // Pozovi update funkciju za slanje podataka na backend
      setHasChanged(false); // Resetovanje indikatora promena
      setUpdateDataBase({ rowIndex: row }); // Setuj samo red koji je menjan
    }
  };
  
  const splitTextIntoSegments = (
    text: string, bold: boolean, italic: boolean, underline: boolean,
    fontColor: string, backgroundColor: string, textAlign: 'left' | 'center' | 'right' | 'justify'
  ): TextSegment[] => {
    if (!text) return [{
      text: '',
      isBold: bold,
      isItalic: italic,
      isUnderline: underline,
      fontColor,
      backgroundColor,
      textAlign,
    }];
    
    return [{
      text,
      isBold: bold,
      isItalic: italic,
      isUnderline: underline,
      fontColor,
      backgroundColor,
      textAlign,
    }];
  };

  const handleFocus = () => {
    setActiveCell({ row, col });
    onCellClick(); // Poziva funkciju za brisanje selekcije kolone
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Delete') {
      // Clear the cell content
      setCellContent(row, col, [{
        text: '',
        isBold: false,
        isItalic: false,
        isUnderline: false,
        fontColor: activeFontColor,
        backgroundColor: activeBackgroundColor,
        textAlign: activeTextAlign,
      }]);
    }
  };

  const backgroundColor = content[0]?.backgroundColor || activeBackgroundColor;

  return (
    <td className={isSelected ? 'selected' : ''}>
    {col === 0 && newRows[row] ? (
      <DropDownRisk onSelect={updateCellContent} />
    ) : col === 1 && newRows[row] ? (
      <DropdownRiskMeasurements onSelect={updateCellContent} />
    ) :
     (
      <textarea
        value={content.map(segment => segment.text).join('')}
        ref={textareaRef}
        onChange={handleTextChange}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        readOnly={isReadOnly} // Ako je read-only, onemogući unos
        rows={1}
        style={{
          resize: 'none',
          overflow: 'hidden',
          fontWeight: content.some(segment => segment.isBold) ? 'bold' : 'normal',
          fontStyle: content.some(segment => segment.isItalic) ? 'italic' : 'normal',
          textDecoration: content.some(segment => segment.isUnderline) ? 'underline' : 'none',
          color: content[0]?.fontColor || '#000000',
          backgroundColor: backgroundColor,
          textAlign: content[0]?.textAlign || 'left',
          border: isSelected ? '2px solid #4A90E2' : undefined,
        }}
      />
    )}
  </td>
  );
};

export default TableCell;
