import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { generateSuggestions } from "../../lib/suggestions";

export default function PTOPlanDetailPage() {
  const { id } = useParams();

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
    await supabase.from("trips").insert({
      user_id: plan.user_id,
      pto_plan_id: plan.id,
      destination,
      start_date: selectedSuggestion.startDate,
      end_date: selectedSuggestion.endDate,
      estimatedCost: estimatedCost,
    });

    setShowModal(false);
    setDestination("");
    setEstimatedCost("");
  };

  if (!plan) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-4">
      <h1 className="text-2xl font-bold">PTO Plan Details</h1>

      <p>
        <strong>Country</strong> {plan.country_code}
      </p>
      <p>
        <strong>Dates</strong> {plan.start_date} -{">"} {plan.end_date}
      </p>
      <p>
        <strong>PTO Days</strong> {plan.pto_days_available}
      </p>

      <button onClick={handleGenerate} className="bg-blue-600 text-white px-4 py-2 rounded">
        Generate Suggestions
      </button>

      <div className="space-y-3">
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

            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-gray-300 p-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
