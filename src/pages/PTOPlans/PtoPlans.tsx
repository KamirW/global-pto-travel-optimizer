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
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-bold">Your PTO Plans</h1>

      <Link to="/ptoplans/new" className="inline-block bg-blue-600 text-white px-4 py-2 rounded">Create New PTO Plan</Link>

        {/* List of PTO Plans */}
      <div className="space-y-4">
        {plans.length === 0 && (<p className="text-gray-600">You haven't create any plans yet.</p>)}
        {plans.map((plan) => (
          <Link key={plan.id} to={`/ptoplans/${plan.id}`} className="block p-4 border rounded shadow bg-white hover:bg-gray-50 transition">
            <p>
              <strong>Country:</strong> {plan.country_code}
            </p>
            <p>
              <strong>Dates:</strong> {plan.start_date} -{">"} {plan.end_date}
            </p>
            <p>
              <strong>PTO Days:</strong> {plan.pto_days_available}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
