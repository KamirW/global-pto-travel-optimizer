import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function PTOPlansPage() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    const loadPlans = async () => {
      const { data, error } = await supabase.from("ptoplans").select("*").eq("user_id", user.id);

      if (!error) setPlans(data || []);
    };

    loadPlans();
  }, [user]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Your PTO Plans</h1>

      <Link to="/ptoplans/new" className="inline-block bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-3 sm:px-4 py-2 sm:py-3 rounded hover:text-white text-sm sm:text-base font-medium transition duration-200">
        Create New PTO Plan
      </Link>

      {/* List of PTO Plans */}
      <div className="space-y-3 sm:space-y-4">
        {plans.length === 0 && (
          <p className="text-gray-600 text-sm sm:text-base">You haven't created any plans yet.</p>
        )}
        {plans.map((plan) => (
          <Link 
            key={plan.id} 
            to={`/ptoplans/${plan.id}`} 
            className="block p-4 sm:p-6 border rounded shadow bg-white hover:bg-gray-50 hover:shadow-md transition active:bg-gray-100 active:shadow-lg"
          >
            <p className="text-sm sm:text-base">
              <strong>Country:</strong> {plan.country_code}
            </p>
            <p className="text-sm sm:text-base">
              <strong>Dates:</strong> {plan.start_date} → {plan.end_date}
            </p>
            <p className="text-sm sm:text-base">
              <strong>PTO Days:</strong> {plan.pto_days_available}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
