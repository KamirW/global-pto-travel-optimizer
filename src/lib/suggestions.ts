import { holidaysByCountry } from "./holidays";

export function generateSuggestions(
  countryCode: string,
  startDate: string,
  endDate: string,
  ptoDaysAvailable: number,
) {
  const holidays = holidaysByCountry[countryCode] || [];
  const suggestions: any[] = [];

  // Convert the dates to readable date objects
  const start = new Date(startDate);
  const end = new Date(endDate);

  for (let timeFrame = 5; timeFrame <= 10; timeFrame++) {
    let current = new Date(start);

    while (current <= end) {
      const windowStart = new Date(current);
      const windowEnd = new Date(current);

      windowEnd.setDate(windowEnd.getDate() + timeFrame);

      if (windowEnd > end) break;

      // Count the holidays in the window of time
      const holidayCount = holidays.filter((holiday) => {
        const d = new Date(holiday);

        return d >= windowStart && d <= windowEnd;
      }).length;

      // PTO days needed is the length of the window minus the holidays
      const ptoNeeded = timeFrame - holidayCount;

      if (ptoNeeded <= ptoDaysAvailable) {
        suggestions.push({
          startDate: windowStart.toISOString().slice(0, 10),
          startEnd: windowEnd.toISOString().slice(0, 10),
          ptoUsed: ptoNeeded,
          totalDaysOff: timeFrame,
        });
      }

      current.setDate(current.getDate() + 1);
    }
  }

  return suggestions;
}
