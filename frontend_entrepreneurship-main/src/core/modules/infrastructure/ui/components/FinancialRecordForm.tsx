import { useState } from "react";
import { type FinancialRecord } from "../../../domain/entities/FinancialRecord"

// REFACTOR: Renamed to be more generic, as it handles "records" which could be costs, assets, etc.
export function FinancialRecordForm() {
  const [records, setRecords] = useState<FinancialRecord[]>([]);

  const total = records.reduce((sum, record) => {
    const amount = parseFloat(record.amount) || 0;
    return sum + amount;
  }, 0);

  const addRecord = () => {
    const newRecord = {
      id: Date.now(), // Unique ID based on timestamp
      name: "",
      amount: "",
      businessId: 1, 
      moduleId: 1,
      createdAt: new Date().toISOString(),
    };
    
    // Using the updater function ensures we have the latest state
    setRecords(prevRecords => [...prevRecords, newRecord]);
  };

  const removeRecord = (recordId: number) => {
    setRecords(prevRecords => prevRecords.filter(record => record.id !== recordId));
  };

  const updateRecord = (recordId: number, fieldName: string, value: number) => {
    setRecords(prevRecords => 
      prevRecords.map(record => 
        record.id === recordId 
          ? { ...record, [fieldName]: value }
          : record
      )
    );
  };

  return (
    <div className="space-y-4">
      {/* STYLE: Changed text for consistency with the new naming */}
      <button
        type="button"
        onClick={addRecord}
        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
      >
        Agregar Registro
      </button>

      {/* REFACTOR: Use conditional rendering for the entire container. 
          This is slightly cleaner than rendering a div with a 'hidden' class. */}
      {records.length > 0 && (
        <div id="records-container" className="space-y-3">
          {records.map((record) => (
            // BEST PRACTICE: Using the stable `record.id` as the key is perfect.
            <div key={record.id} className="flex gap-3 items-start">
              <div className="flex-1">
                <input
                  type="text"
                  // BEST PRACTICE: Use a more stable and accessible ID
                  id={`record-name-${record.id}`} 
                  placeholder="Nombre del registro (ej: Alquiler)"
                  value={record.name}
                  onChange={(e) => updateRecord(record.id, 'name', parseFloat(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 focus:outline-none"
                />
              </div>
              <div className="w-32">
                <input
                  type="number"
                  // BEST PRACTICE: Use a more stable and accessible ID
                  id={`record-amount-${record.id}`}
                  placeholder="Monto"
                  value={record.amount}
                  onChange={(e) => updateRecord(record.id, 'amount', parseFloat(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 focus:outline-none"
                />
              </div>
              <div className="flex items-center pt-3">
                <button 
                  type="button" 
                  onClick={() => removeRecord(record.id)}
                  // STYLE: Added an aria-label for better accessibility
                  aria-label="Remove record"
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* The total is now displayed whenever there are records */}
      {records.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-lg font-semibold text-gray-700">
            {/* The `total` variable is always up-to-date */}
            Total: ${total.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}