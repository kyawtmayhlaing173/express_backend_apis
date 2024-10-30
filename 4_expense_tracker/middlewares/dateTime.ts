import dayjs from 'dayjs';

export function getDateRange(timeFilter: string | undefined, startDate: string | undefined, endDate: string | undefined) {
    const now = new Date();
    let filterStartDate, filterEndDate;
    
    switch (timeFilter) {
        case 'past-week':
            filterStartDate = dayjs().subtract(7, "day").toDate();
            filterEndDate = now;
            break;
        case 'last-month':
            filterStartDate = dayjs().subtract(1, "month").toDate();
            filterEndDate = now;
            break;
        case 'last-three-month':
            filterStartDate = dayjs().subtract(3, "month").toDate();
            filterEndDate = now;
            break;
        case 'custom':
            if (!startDate || !endDate) {
                throw new Error("startDate and endDate are required for custom filter");
            }
            if (startDate > endDate) {
                throw new Error("startDate should not be greater than endDate");
            }
            filterStartDate = new Date(startDate);
            filterEndDate = new Date(endDate);
            break;
        default:
            filterStartDate = dayjs().subtract(10, "year").toDate();
            filterEndDate = now;
    }
    return { filterStartDate, filterEndDate }
}