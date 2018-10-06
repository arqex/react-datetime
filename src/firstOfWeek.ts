import subDays from "date-fns/sub_days";
import getDay from "date-fns/get_day";

const firstOfWeek = (date: string | Date) => {
  return subDays(date, getDay(date));
};

export default firstOfWeek;
