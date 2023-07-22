interface schicht {
    user: string,
    date: string,
    title: string,
    start: string,
    ende: string
};

const compareDateStrings = (datestring1: string, datestring2: string) =>  {
    const dateObj1 = new Date(datestring1);
    const dateObj2 = new Date(datestring2);

    return dateObj1.getFullYear() === dateObj2.getFullYear() && dateObj1.getMonth() === dateObj2.getMonth() && dateObj1.getDate() === dateObj2.getDate();
}

export const generateWeekFromOffset = (weekOffset: number) => {
    let dayInWeek = new Date();
    dayInWeek.setDate(dayInWeek.getDate() + weekOffset * 7);
    let firstDayOfWeek = dayInWeek;
    firstDayOfWeek.setDate(firstDayOfWeek.getDate() - dayInWeek.getDay() + 1)
    const weekDays: Date[]= [];
    for (let i = 0; i < 7; i++) {
        const myDate = new Date(firstDayOfWeek);
        myDate.setDate(myDate.getDate() + i)
        weekDays.push(myDate)
    }
    return weekDays;
};

export const formatDateForSchichten = (inputDate: Date) => {
    return `${inputDate.getFullYear().toString()}/${(inputDate.getMonth() + 1).toString().padStart(2, "0")}/${inputDate.getDate().toString().padStart(2, "0")}`;
}

export const findSchicht = (schichten: schicht[], user: string, inputDate: string) => {
    const userSchichten = schichten.filter(obj => obj.user === user);
    const dateSchichten = userSchichten.filter(obj => compareDateStrings(obj.date, inputDate));
    return dateSchichten;
};

export const calculatePlannedTime = (week: Date[], schichten: schicht[], user: string) => {
    const weekStrings = week.map(day => {
        return formatDateForSchichten(day);
    });
    const minutesThisWeek = schichten
        .filter(obj => weekStrings.includes(obj.date) && obj.user === user)
        .map(obj => {
            const startTime = new Date(0, 0, 0, Number(obj.start.split(":")[0]), Number(obj.start.split(":")[1]));
            const endeTime = new Date(0, 0, 0, Number(obj.ende.split(":")[0]), Number(obj.ende.split(":")[1]));
            return (endeTime - startTime) / 60000;            
        }).reduce((acc, curr) => acc + curr, 0);
    return minutesThisWeek / 60;
};

export const generateDatesBetween = (dateStart: Date, dateEnd: Date) => {
    const dates = [];
    let currentDate = new Date(dateStart);

    while (currentDate <= dateEnd) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    };

    return dates;
}