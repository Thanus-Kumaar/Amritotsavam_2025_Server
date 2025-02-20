export const convertDate = function (inputDate) {
    const dateMap = {
        "2025-03-03": "1",
        "2025-03-04": "2",
        "2025-03-05": "3",
        1: "2025-03-03",
        2: "2025-03-04",
        3: "2025-03-05",
    };

    return dateMap[inputDate];
};
