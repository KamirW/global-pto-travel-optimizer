import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { generateSuggestions } from "../../lib/suggestions";

export default function PTOPlanDetailPage() {
  const { id } = useParams();

  const [plan, setPlan] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);

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

  // Handlers
  const handleGenerate = () => {
    const results = generateSuggestions(
      plan.country_code,
      plan.start_date,
      plan.end_date,
      plan.pto_days_available,
    );

    setSuggestions(results);
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
          </div>
        ))}
      </div>
    </div>
  );
}
