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
    <div>
      <h1>Your PTO Plans</h1>

      <Link to="/ptopplans/new">Create New PTO Plan</Link>

      <div>
        {plans.map((plan) => (
          <Link key={plan.id} to={`/ptoplans/${plan.id}`}>
            <p>
              <strong>Country:</strong> {plan.country}
            </p>
            <p>
              <strong>Dates:</strong> {plan.startDate} -{">"} {plan.endDate}
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
