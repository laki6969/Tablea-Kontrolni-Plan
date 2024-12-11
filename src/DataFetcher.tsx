import React, { useState, useEffect, useRef } from 'react';
import { getControlPlanifo } from './requests/tabledata';
import { useNavigate } from 'react-router-dom';
import { useRowIdsContext } from './Context/RowIdsContext';
import { useToolContext } from './Context/ToolContext';
import Loader from './components/Loader/Loader';
import { useRefreshContext } from './Context/RefreshContext';
import { usePaginationContext } from './Context/PaginationContext';
import { useColumnNameContext } from './Context/ColumnNameContext';

interface DataFetcherProps {
  columns: number;
  setRowIds: React.Dispatch<React.SetStateAction<Map<number, number>>>;
  refresh: number;
}

const DataFetcher: React.FC<DataFetcherProps> = ({
  columns,
  setRowIds,
  refresh,
}) => {
  const navigate = useNavigate();
  const { setCellContent } = useToolContext();
  const { setRowIds: setRowIdsContext } = useRowIdsContext();
  const { setRowCount } = useRefreshContext();
  const {
    currentPage,
    pageSize,
    setTotalRows,
    setCurrentPage,
    totalRows,
  } = usePaginationContext();
  const { columnName, selectedValues, refetchTrigger } = useColumnNameContext();
  const [isLoading, setIsLoading] = useState(false);
  const loadedPages = useRef<number[]>([]);

  const fetchData = async (page: number, direction: 'forward' | 'backward', mode: 'filter' | 'default') => {
    if (mode === 'filter') {
      // Clear table content for filter mode
      //setCellContent(new Map());
      setRowIds(new Map());
    }

    if (loadedPages.current.includes(page) && mode === 'default') {
      const nextPage = direction === 'backward' ? page - 1 : page + 1;
      if (
        nextPage > 0 &&
        nextPage <= Math.ceil(totalRows / pageSize) &&
        !loadedPages.current.includes(nextPage)
      ) {
        fetchData(nextPage, direction, 'default');
      }
      return;
    }

    setIsLoading(true);
    try {
      const selectedValuesArray = Array.from(selectedValues);

      const data = await getControlPlanifo(navigate, page, columnName, selectedValuesArray);

      if (data && Array.isArray(data.data) && data.data.length > 0) {
        setTotalRows(data.total);

        const updatedRowIds = new Map();
        data.data.forEach((item, rowIndex) => {
          const absoluteRowIndex = (page - 1) * pageSize + rowIndex + 1;
          updatedRowIds.set(absoluteRowIndex, item.id);

          for (let colIndex = 0; colIndex < columns; colIndex++) {
            const textValue = (() => {
              switch (colIndex) {
                case 0: return item.measurement ? item.measurement.risk.cause : 'N/A';
                case 1: return item.measurement ? item.measurement.description : 'N/A';
                case 2: return item.process_number || 'N/A';
                case 3: return item.process_name || 'N/A';
                case 4: return item.resource || 'N/A';
                case 5: return item.characteristic_number || 'N/A';
                case 6: return item.characteristic_product || 'N/A';
                case 7: return item.characteristic_process || 'N/A';
                case 8: return item.classification || 'N/A';
                case 9: return item.specification || 'N/A';
                case 10: return item.evaluation || 'N/A';
                case 11: return item.sample_size || 'N/A';
                case 12: return item.sample_frequency || 'N/A';
                case 13: return item.control_method || 'N/A';
                case 14: return item.reaction_plan || 'N/A';
                default: return '';
              }
            })();

            setCellContent(absoluteRowIndex, colIndex, [
              {
                text: textValue,
                isBold: false,
                isItalic: false,
                isUnderline: false,
                fontColor: '',
                backgroundColor: '',
                textAlign: 'left',
              },
            ]);
          }
        });

        setRowIds((prev) => {
          let allRows = Array.from(prev);
          if (direction === 'backward') {
            allRows = [...updatedRowIds, ...allRows].slice(0, 2 * pageSize);
          } else {
            allRows = [...allRows, ...updatedRowIds].slice(-2 * pageSize);
          }
          allRows.sort(([a], [b]) => a - b);
          const newMap = new Map(allRows);
          setRowIdsContext(newMap);
          return newMap;
        });

        setRowCount((prevCount) => prevCount + data.data.length);

        loadedPages.current = direction === 'backward'
          ? [page, ...loadedPages.current].slice(0, 2)
          : [...loadedPages.current, page].slice(-2);
      }
    } catch (error) {
      console.error('Greška prilikom preuzimanja podataka:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = (event: Event) => {
    const target = event.target as HTMLDivElement;
    const { scrollTop, scrollHeight, clientHeight } = target;

    if (scrollTop === 0 && currentPage > 1) {
      const previousPage = currentPage - 1;
      setCurrentPage(previousPage);
      fetchData(previousPage, 'backward', 'default');
    }

    if (scrollTop + clientHeight >= scrollHeight && currentPage * pageSize < totalRows) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchData(nextPage, 'forward', 'default');
    }
  };

  useEffect(() => {
    fetchData(currentPage, 'forward', 'default');

    const scrollContainer = document.getElementById('scrollableDiv');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [currentPage, refresh]);

  useEffect(() => {
    fetchData(currentPage, 'forward', 'filter');
  }, [refetchTrigger]);

  return (
    <>
      {isLoading && <Loader delay={0} />}
    </>
  );
};

export default DataFetcher;
