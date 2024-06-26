const readCSV = require('../../src/csvReader');
const {parseQuery, parseQueryWhere } = require('../../src/queryParser');
const {executeSELECTQuery,executeSELECTQueryfour,executeSELECTQuerywhere} =require('../../src/index');

// test('Read CSV File', async () => {
//     const data = await readCSV('./student.csv');
//     expect(data.length).toBeGreaterThan(0);
//     expect(data.length).toBe(3);
//     expect(data[0].name).toBe('John');
//     expect(data[0].age).toBe('30'); //ignore the string type here, we will fix this later
// });

// test('Parse SQL Query', () => {
//     const query = 'SELECT id, name FROM student';
//     const parsed = parseQueryWhere(query);
//     expect(parsed).toEqual({
//         fields: ['id', 'name'],
//         table: 'student',
//         whereClause: null
//     });
// });

// test('Execute SQL Query', async () => {
//     const query = 'SELECT id, name FROM student';
//     const result = await executeSELECTQuery(query);
//     expect(result.length).toBeGreaterThan(0);
//     expect(result[0]).toHaveProperty('id');
//     expect(result[0]).toHaveProperty('name');
//     expect(result[0]).not.toHaveProperty('age');
//     expect(result[0]).toEqual({ id: '1', name: 'John' });
// });

// test('Parse SQL Query with WHERE Clause', () => {
//     const query = 'SELECT id, name FROM student WHERE age = 25';
//     const parsed = parseQueryWhere(query);
//     expect(parsed).toEqual({
//         fields: ['id', 'name'],
//         table: 'student',
//         whereClause: 'age = 25'
//     });
// });

test('Execute SQL Query with WHERE Clause', async () => {
    const query = 'SELECT id, name FROM student WHERE age = 25';
    const result = await executeSELECTQuerywhere(query);
    expect(result.length).toBe(1);
    expect(result[0]).toHaveProperty('id');
    expect(result[0]).toHaveProperty('name');
    expect(result[0].id).toBe('2');
});