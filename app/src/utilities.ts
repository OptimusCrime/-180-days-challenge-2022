import differenceInDays from "date-fns/differenceInDays";
import {parse} from "date-fns";

export const formatNumber = (x: string): string =>
  x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

export const parseDate = (date: string): Date => parse(date, 'yyyy-MM-dd', new Date());

export const calculateTotalDays = (params: {
  startDate: string,
  endDate: string
}) => {
  const { startDate, endDate } = params;
  return differenceInDays(parseDate(endDate), parseDate(startDate)) + 1;  // Add one, inclusive count
}
