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
    <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Your Trips</h1>

      <div className="bg-blue-50 border border-blue-200 p-4 sm:p-6 rounded">
        <p className="text-base sm:text-lg">
          <strong>Total Estimated Cost:</strong> ${totalCost.toFixed(2)}
        </p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {trips.length === 0 && <p className="text-gray-600 text-sm sm:text-base">No trips yet.</p>}
        {trips.map((trip: any) => (
          <div key={trip.id} className="p-4 sm:p-6 border rounded shadow hover:shadow-md transition space-y-3">
            <p className="text-sm sm:text-base">
              <strong>Destination:</strong> {trip.destination}
            </p>
            <p className="text-sm sm:text-base">
              <strong>Estimated Cost:</strong> ${Number(trip.estimated_cost || 0).toFixed(2)}
            </p>

            <button
              onClick={() => deleteTrip(trip.id)}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded text-sm sm:text-base font-medium transition duration-200"
            >
              Delete Trip
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
