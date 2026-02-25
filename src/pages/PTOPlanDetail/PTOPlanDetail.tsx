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

  if (!plan) return <div className="mt-10 text-center">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-bold">PTO Plan Details</h1>

      <div className="p-4 border rounded shadow space-y-2">
        <p>
          <strong>Country: </strong> {plan.country_code}
        </p>
        <p>
          <strong>Dates: </strong> {plan.start_date} -{">"} {plan.end_date}
        </p>
        <p>
          <strong>PTO Days: </strong> {plan.pto_days_available}
        </p>
      </div>

      {/* Button container (two buttons glued to the left and the delete button to the right ) */}
      <div className="mt-4 flex justify-between items-center">
        <div>
          <button
            onClick={handleGenerate}
            className="bg-blue-600 text-white px-4 py-2 rounded mr-4 hover:bg-blue-700"
          >
            Generate Suggestions
          </button>

          <button
            onClick={() => navigate("/ptoplans")}
            className="bg-gray-300 p-2 rounded min-w-16 hover:bg-gray-400"
          >
            Back
          </button>
        </div>

        {/* Delete Plan */}
        <button onClick={deletePlan} className="bg-red-600 p-2 rounded min-w-16 hover:bg-red-700">
          Delete Plan
        </button>
      </div>

      {/* Suggestions */}
      <div className="space-y-4">
        {suggestions.map((s, inx) => (
          <div key={inx} className="p-4 border rounded shadow">
            <p>
              <strong>Window:</strong> {s.startDate} -{">"} {s.endDate}
            </p>
            <p>
              <strong>PTO Used:</strong> {s.ptoUsed}
            </p>
            <p>
              <strong>Total Days Off:</strong> {s.totalDaysOff}
            </p>
            <button
              onClick={() => openSaveModal(s)}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Save Trip
            </button>
          </div>
        ))}
      </div>

      {/* Save Trip Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow max-w-sm w-full space-y-4">
            <h2 className="text-xl font-bold">Save Trip</h2>

            <input
              type="text"
              placeholder="Destination"
              className="w-full border p-2 rounded"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />

            <input
              type="text"
              placeholder="Estimated Cost"
              className="w-full border p-2 rounded"
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(Number(e.target.value))}
            />

            <button onClick={saveTrip} className="w-full bg-blue-600 text-white p-2 rounded">
              Save Trip
            </button>

            <button onClick={() => setShowModal(false)} className="w-full bg-gray-300 p-2 rounded">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
