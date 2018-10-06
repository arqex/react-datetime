import addDays from "date-fns/add_days";
import getDay from "date-fns/get_day";
import getDaysInMonth from "date-fns/get_days_in_month";

const lastOfMonth = (date: string | Date) => {
  return addDays(date, getDaysInMonth(date) - getDay(date));
};

export default lastOfMonth;
