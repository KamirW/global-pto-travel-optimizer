import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { generateSuggestions } from "../../lib/suggestions";

export default function PTOPlanDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [plan, setPlan] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<any>(null);
  const [destination, setDestination] = useState("");
  const [estimatedCost, setEstimatedCost] = useState<number | "">("");

  // OnMount
  useEffect(() => {
    const loadPlan = async () => {
      const { data, error } = await supabase.from("ptoplans").select("*").eq("id", id).single();

      if (error) {
        console.error("Failed to load plan", error);
        return;
      }

      setPlan(data);
    };

    loadPlan();
  }, [id]);

  // ********** Handlers **********
  const handleGenerate = () => {
    if (!plan) return;

    const results = generateSuggestions(
      plan.country_code,
      plan.start_date,
      plan.end_date,
      plan.pto_days_available,
    );

    setSuggestions(results);
  };

  const openSaveModal = (suggestion: any) => {
    setSelectedSuggestion(suggestion);
    setShowModal(true);
  };

  // Function to save the trip suggestion to the database
  const saveTrip = async () => {
    try {
      const { error } = await supabase
        .from("trips")
        .insert({
          user_id: plan.user_id,
          pto_plan_id: plan.id,
          destination,
          start_date: selectedSuggestion.startDate,
          end_date: selectedSuggestion.endDate,
          estimated_cost: estimatedCost,
        })
        .select();

      if (error) {
        console.error("Error saving trip:", error);
        alert(`Failed to save trip: ${error.message}`);
        return;
      }

      // Reset states
      setShowModal(false);
      setDestination("");
      setEstimatedCost("");
    } catch (err) {
      console.error("Unexpected error saving trip:", err);
      alert("An unexpected error occurred while saving the trip");
    }
  };

  const deletePlan = async () => {
    const { error } = await supabase.from("ptoplans").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete plan", error);
      return;
    }
    navigate("/ptoplans");
  };

  if (!plan) return <div className="mt-10 text-center text-gray-600">Loading...</div>;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">PTO Plan Details</h1>

      <div className="p-4 sm:p-6 border rounded shadow space-y-2 sm:space-y-3">
        <p className="text-sm sm:text-base">
          <strong>Country:</strong> {plan.country_code}
        </p>
        <p className="text-sm sm:text-base">
          <strong>Dates:</strong> {plan.start_date} → {plan.end_date}
        </p>
        <p className="text-sm sm:text-base">
          <strong>PTO Days:</strong> {plan.pto_days_available}
        </p>
      </div>

      {/* Button container */}
      <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleGenerate}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2 sm:py-3 rounded text-sm sm:text-base font-medium transition duration-200"
          >
            Generate Suggestions
          </button>

          <button
            onClick={() => navigate("/ptoplans")}
            className="bg-gray-300 hover:bg-gray-400 active:bg-gray-500 px-4 py-2 sm:py-3 rounded text-sm sm:text-base font-medium transition duration-200"
          >
            Back
          </button>
        </div>

        {/* Delete Plan */}
        <button 
          onClick={deletePlan} 
          className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-4 py-2 sm:py-3 rounded text-sm sm:text-base font-medium transition duration-200"
        >
          Delete Plan
        </button>
      </div>

      {/* Suggestions */}
      <div className="space-y-3 sm:space-y-4">
        {suggestions.length === 0 ? (
          <p className="text-gray-600 text-center py-8 text-sm sm:text-base">
            Click "Generate Suggestions" to see travel options
          </p>
        ) : (
          suggestions.map((s, inx) => (
            <div key={inx} className="p-4 sm:p-6 border rounded shadow hover:shadow-md transition space-y-3">
              <p className="text-sm sm:text-base">
                <strong>Window:</strong> {s.startDate} → {s.endDate}
              </p>
              <p className="text-sm sm:text-base">
                <strong>PTO Used:</strong> {s.ptoUsed}
              </p>
              <p className="text-sm sm:text-base">
                <strong>Total Days Off:</strong> {s.totalDaysOff}
              </p>
              <button
                onClick={() => openSaveModal(s)}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 active:bg-green-800 text-white px-4 py-2 sm:py-3 rounded text-sm sm:text-base font-medium transition duration-200"
              >
                Save Trip
              </button>
            </div>
          ))
        )}
      </div>

      {/* Save Trip Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white p-4 sm:p-6 rounded shadow w-full max-w-sm space-y-4">
            <h2 className="text-lg sm:text-2xl font-bold">Save Trip</h2>

            <input
              type="text"
              placeholder="Destination"
              className="w-full border p-2 sm:p-3 rounded text-sm sm:text-base"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />

            <input
              type="number"
              placeholder="Estimated Cost"
              className="w-full border p-2 sm:p-3 rounded text-sm sm:text-base"
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(e.target.value === '' ? '' : Number(e.target.value))}
            />

            <button 
              onClick={saveTrip} 
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white p-2 sm:p-3 rounded font-medium text-sm sm:text-base transition duration-200"
            >
              Save Trip
            </button>

            <button 
              onClick={() => setShowModal(false)} 
              className="w-full bg-gray-300 hover:bg-gray-400 active:bg-gray-500 p-2 sm:p-3 rounded text-sm sm:text-base transition duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
