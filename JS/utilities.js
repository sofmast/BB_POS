// ========================================
// DATE OBJECT
// ========================================

function createDateObject() {

    const now = new Date();

    return {

        day:
            now.getDate(),

        month:
            now.getMonth() + 1,

        year:
            now.getFullYear(),

        hour:
            now.getHours(),

        minute:
            now.getMinutes(),

        second:
            now.getSeconds(),

        timestamp:
            now.getTime(),

        iso:
            now.toISOString()

    };

}

function getSaleDate(record) {

    if (
        typeof record.date ===
        "string"
    ) {

        const d =
            new Date(record.date);

        return {

            day:
                d.getDate(),

            month:
                d.getMonth() + 1,

            year:
                d.getFullYear()

        };

    }

    return record.date;

}