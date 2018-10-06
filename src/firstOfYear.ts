import subDays from "date-fns/sub_days";
import getDayOfYear from "date-fns/get_day_of_year";

const firstOfYear = (date: string | Date) => {
  return subDays(date, getDayOfYear(date) - 1);
};

export default firstOfYear;
