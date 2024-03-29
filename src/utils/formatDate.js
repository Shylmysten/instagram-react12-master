import { format, isThisYear, formatDistanceStrict, formatDistanceToNow } from "date-fns";

export function formatPostDate(date) {
    // current year
    const formatShort = format(new Date(date), 'MMMM d').toUpperCase();
    // last year/before current year
    const formatLong = format(new Date(date), 'MMMM d, yyy').toUpperCase();

    return isThisYear(new Date(date))  ? formatShort : formatLong;
}

export function formatDateToNow(date) {
    return formatDistanceToNow(new Date(date), { addSuffix: true }).toUpperCase();
}

export function formatDateToNowShort(date) {
    // 5 days ago -> 5 days -> ['5', 'days'] -> ['5', 'd'] -> 5d
    // 7 weeks ago -> 7w
    return formatDistanceStrict(new Date(date), new Date(Date.now()))
    .split(' ')
    .map((s, i) => i === 1 ? s[0] : s)
    .join('');
}