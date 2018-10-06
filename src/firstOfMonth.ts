import subDays from "date-fns/sub_days";
import getDate from "date-fns/get_date";

const firstOfMonth = (date: string | Date) => {
  return subDays(date, getDate(date) - 1);
};

export default firstOfMonth;
