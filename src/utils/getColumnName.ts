export const getColumnName = (columnIndex: number): string => {
    const columnName = (() => {
      switch (columnIndex) {
        case 0: return "cause";
        case 1: return "description";
        case 2: return "process_number";
        case 3: return "process_name";
        case 4: return "resource";
        case 5: return "characteristic_number";
        case 6: return "characteristic_product";
        case 7: return "characteristic_process";
        case 8: return "classification";
        case 9: return "specification";
        case 10: return "evaluation";
        case 11: return "sample_size";
        case 12: return "sample_frequency";
        case 13: return "control_method";
        case 14: return "reaction_plan";
        default: return `Kolona ${columnIndex + 1}`;
      }
    })();
    return columnName;
  };
  