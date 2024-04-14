const readCSV = require('../../src/csvReader');
const {parseQuery, parseQueryWhere ,parseQuerySix,parseWhereClauseSeven}= require('../../src/queryParser');
const {executeSELECTQuery,executeSELECTQueryfour,executeSELECTQuerywhere,executeSELECTQuerySix,executeSELECTQuerySeven} = require('../../src/index');

test('Read CSV File', async () => {
    const data = await readCSV('./student.csv');
    expect(data.length).toBeGreaterThan(0);
    expect(data.length).toBe(3);
    expect(data[0].name).toBe('John');
    expect(data[0].age).toBe('30'); //ignore the string type here, we will fix this later
});

// test('Parse SQL Query with Greater Than', () => {
//     //const query = 'SELECT id FROM student WHERE age > 22';
//     // const parsed = parseWhereClauseSeven(query);
//     // expect(parsed.length).toBe(1); // Check if only one object is returned
//     // expect(parsed[0]).toEqual({
//     //     field: "age",
//     //     operator: ">",
//     //     value: "22",
//     // });
//     const query = 'SELECT id FROM student WHERE age > 22';
//     const parsed = parseWhereClauseSeven(query);
//     expect(parsed).toEqual({
//         fields: ['id'],
//         table: 'student',
//         whereClauses: [{
//           field: "age",
//           operator: ">",
//           value: "22",
//         }],
//     });
// });
test('Parse SQL Query with Greater Than', () => {
    const query = 'SELECT id FROM student WHERE age > 22';
    const parsed = parseWhereClauseSeven(query);
    expect(parsed.length).toBe(1); // Check if only one object is returned
    expect(parsed[0]).toEqual({
        field: "age",
        operator: ">",
        value: "22",
    });
});

test('Execute SQL Query with Greater Than', async () => {
    const queryWithGT = 'SELECT id FROM student WHERE age > 22';
    const result = await executeSELECTQuerySeven(queryWithGT);
    expect(result.length).toEqual(1);
    expect(result[0]).toHaveProperty('id');
});

test('Execute SQL Query with Not Equal to', async () => {
    const queryWithGT = 'SELECT name FROM student WHERE age != 25';
    const result = await executeSELECTQuerySeven(queryWithGT);
    expect(result.length).toEqual(2);
    expect(result[0]).toHaveProperty('name');
});