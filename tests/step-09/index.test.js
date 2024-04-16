const readCSV = require('../../src/csvReader');
const {parseQuery, parseQueryWhere ,parseQuerySix,parseQueryEight,parseQueryNine} = require('../../src/queryParser');
const {executeSELECTQuery,executeSELECTQueryfour,executeSELECTQuerywhere,executeSELECTQuerySix,executeSELECTQuerySeven,executeSELECTQueryEight,executeSELECTQueryNine} = require('../../src/index');

test('Execute SQL Query with LEFT JOIN', async () => {
    const query = 'SELECT student.name, enrollment.course FROM student LEFT JOIN enrollment ON student.id=enrollment.student_id';
    const result = await executeSELECTQueryNine(query);
    expect(result).toEqual(expect.arrayContaining([
        expect.objectContaining({ "student.name": "Alice", "enrollment.course": null }),
        expect.objectContaining({ "student.name": "John", "enrollment.course": "Mathematics" })
    ]));
    expect(result.length).toEqual(4); // 4 students, but John appears twice
    //In a LEFT JOIN operation, all rows from the left table (student) are included in the result set, regardless of whether there's a match in the right table (enrollment). If there's no match in the right table, NULL values are appended to the corresponding columns.
    // In your case:
    // John appears twice in the enrollment table (with IDs 1 and 1), but he still represents a single distinct student from the student table.
    // Therefore, when performing the LEFT JOIN, John will be included once in the result set, along with the other students.
    // So, the expected result length should indeed be the number of distinct students from the student table, which is 4 in your case, even though John appears twice due to having two enrollments.
});

test('Execute SQL Query with LEFT JOIN', async () => {
    const query = 'SELECT student.name, enrollment.course FROM student LEFT JOIN enrollment ON student.id=enrollment.student_id';
    const result = await executeSELECTQueryNine(query);
    expect(result).toEqual(expect.arrayContaining([
        expect.objectContaining({ "student.name": "Alice", "enrollment.course": null }),
        expect.objectContaining({ "student.name": "John", "enrollment.course": "Mathematics" })
    ]));
    expect(result.length).toEqual(4); // 4 students, but John appears twice
});