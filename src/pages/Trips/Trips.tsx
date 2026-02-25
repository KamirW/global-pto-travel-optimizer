import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../lib/supabaseClient";

export default function TripsPage() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<any[]>([]);

  // Load trips for the user on mount
  useEffect(() => {
    const loadTrips = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .eq("user_id", user.id)
        .order("start_date", { ascending: true });

      if (error) {
        console.error("Error loading trips:", error);
        return;
      }
      
      setTrips(data || []);
    };

    loadTrips();
  }, [user]);

  // Delete a trip
  const deleteTrip = async (id: string) => {
    const { error } = await supabase.from("trips").delete().eq("id", id);
    
    if (error) {
      console.error("Error deleting trip:", error);
      alert(`Failed to delete trip: ${error.message}`);
      return;
    }
    
    setTrips((prev: any[]) => prev.filter((trip) => trip.id !== id));
  };

  // Getting total cost by flattening the array
  const totalCost = trips.reduce((sum: number, t: any) => sum + (Number(t.estimated_cost) || 0), 0);

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-bold">Your trips</h1>

      <p className="text-lg">
        <strong>Total Estimated Cost:</strong> ${totalCost}
      </p>

      <div className="space-y-4">
        {trips.length === 0 && <p className="text-gray-600">No trips yet.</p>}
        {trips.map((trip: any) => (
          <div key={trip.id} className="p-4 border rounded shadow space-y-2">
            <p>
              <strong>Destination:</strong> {trip.destination}
            </p>
            <p>
              <strong>Dates:</strong> {trip.start_date} -{">"} {trip.end_date}
            </p>
            <p>
              <strong>Estimated Cost:</strong> {trip.estimated_cost}
            </p>

            <button
              onClick={() => deleteTrip(trip.id)}
              className="bg-red-600 text-white px-3 py-1 rounded "
            >
              Delete Trip
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
