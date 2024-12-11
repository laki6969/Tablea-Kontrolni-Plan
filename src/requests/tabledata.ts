import { NavigateFunction } from 'react-router-dom';
import createAgent from '../API/agent'; 
// tabledata.ts
import { ControlPlanInfoResponse } from './types';

//import { useFmeaidContext } from '../Context/FmeaidContext';

// Funkcija za Fetchovanje FMEA Informacija
export const getControlPlanifo = async (
  navigate: NavigateFunction,
  currentPage: number,
  columnName: string,
  selectedValues: string[],
): Promise<ControlPlanInfoResponse> => {
  try {
    const agent = createAgent(navigate);

    // Kreiranje query parametara
    const params = new URLSearchParams();
    params.append("page", currentPage.toString()); // Dodavanje parametra za stranicu

    // Dodavanje filtera sa nazivom kolone
    selectedValues.forEach(filter => {
      params.append(`${columnName}[]`, filter); // Dodavanje filtera u uglastim zagradama
    });

    console.log("Kreirani query parametri:", params.toString()); // Provera kreiranih parametara

    // Slanje GET zahteva sa query parametrima
    const response = await agent.api.get(`/getControlPlansForFmea/1`, 
      params, // Prosleđujemo query parametre
    );

    console.log(`API odgovor za stranicu ${currentPage}:`, response.data);
    return response.data as ControlPlanInfoResponse;
  } catch (error) {
    console.error(`Greška prilikom preuzimanja podataka za stranicu ${currentPage}:`, error);
    throw error;
  }
};




// Funkcija za brisanje postojećeg FmeaInfo po ID-u
export const deleteControlPlanInfo = async (
  navigate: NavigateFunction,
  controlPlanInfoId: number
): Promise<void> => {
  try {
    const agent = createAgent(navigate);
    await agent.api.delete(`/controlPlan/${controlPlanInfoId}`);
  } catch (error) {
    console.error(`Greška prilikom brisanja FmeaInfo sa ID-jem ${controlPlanInfoId}:`, error);
    throw error;
  }
};

// Funkcija za ažuriranje postojećeg ControlPlanInfo po ID-u koristeći PATCH
export const updateControlPlanInfo = async (
  navigate: NavigateFunction,
  controlPlanInfoId: number, 
  updatedControlPlanInfo: Partial<ControlPlanInfoResponse>
): Promise<ControlPlanInfoResponse> => {
  try {
    const agent = createAgent(navigate);
    const response = await agent.api.patch(`/controlPlan/${controlPlanInfoId}`, updatedControlPlanInfo);
    return response.data as ControlPlanInfoResponse;
  } catch (error) {
    console.error(`Greška prilikom ažuriranja ControlPlanInfo sa ID-jem ${controlPlanInfoId}:`, error);
    throw error;
  }
};

export const insertControlPlanInfo = async (
  navigate: NavigateFunction,
  controlPlanInfoData: Record<string, any>
): Promise<void> => {
  try {
    const agent = createAgent(navigate);
    console.log("Podaci za slanje:", controlPlanInfoData); // Dodato za proveru
    const response = await agent.api.post('/controlPlan', controlPlanInfoData);
    console.log("Odgovor sa servera:", response); // Dodato za proveru odgovora
  } catch (error) {
    console.error('Greška prilikom umetanja novog FmeaInfo:', error);
    throw error;
  }
};


export const fetchCausesForRiskItem = async (
  navigate: NavigateFunction,
  selectedItem: string
) => {
  try {
    const agent = createAgent(navigate);
    const response = await agent.api.get(`/getRisks/1${selectedItem}`);
    return response.data as { cause: string; id: number }[];
  } catch (error) {
    console.error("Error fetching causes for selected item:", error); 
    throw error;
  }
};

export const fetchCausesForRiskMeasurmentsItem = async (
  navigate: NavigateFunction,
  selectedItem: string
) => {
  try {
    const agent = createAgent(navigate);
    const response = await agent.api.get(`/risk/${selectedItem}/riskMeasurements`);

    // Proveravamo da li `response.data` sadrži niz
    if (Array.isArray(response.data)) {
      return response.data;  // Vraćamo niz iz `response.data`
    } else {
      console.error("API odgovor nije niz ili je prazan:", response.data);
      return [];  // Ako nije niz, vraćamo prazan niz
    }
  } catch (error) {
    console.error("Greška pri preuzimanju podataka:", error);
    throw error;
  }
};

export const fetchCausesForColumnValuesItem = async (
  navigate: NavigateFunction,
  columnName: string
): Promise<string[]> => {
  try {
    const agent = createAgent(navigate);

    // Kreiraj URL sa query parametrom
    const params = new URLSearchParams();
    params.append("column", columnName); // Dodaj columnName kao query parametar
    console.log("Ime kolone: ", columnName);
    // Pošalji GET zahtev sa query parametrima
    const response = await agent.api.get(`/controlPlan/getColumnValues`, params);

    // Proveri da li je odgovor validan niz
    if (Array.isArray(response.data)) {
      return response.data; // Vrati niz podataka
    } else {
      console.error("API odgovor nije niz ili je prazan:", response.data);
      return []; // Vrati prazan niz ako podaci nisu validni
    }
  } catch (error) {
    console.error("Greška prilikom preuzimanja podataka:", error);
    throw error; // Ponovo izbaci grešku za rukovanje na višem nivou
  }
};






