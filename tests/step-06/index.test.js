const readCSV = require('../../src/csvReader');
const {parseQuery, parseQueryWhere ,parseQuerySix}=  require('../../src/queryParser');
const {executeSELECTQuery,executeSELECTQueryfour,executeSELECTQuerywhere,executeSELECTQuerySix}= require('../../src/index');

test('Read CSV File', async () => {
    const data = await readCSV('./student.csv');
    expect(data.length).toBeGreaterThan(0);
    expect(data.length).toBe(4);
    expect(data[0].name).toBe('John');
    expect(data[0].age).toBe('30'); //ignore the string type here, we will fix this later
});

test('Parse SQL Query with Multiple WHERE Clauses', () => {
    const query = 'SELECT id, name FROM student WHERE age = 30 AND name = John';
    const parsed = parseQuerySix(query);
    expect(parsed).toEqual({
        fields: ['id', 'name'],
        table: 'student',
        whereClauses: [{
            "field": "age",
            "operator": "=",
            "value": "30",
        }, {
            "field": "name",
            "operator": "=",
            "value": "John",
        }]
    });
});

test('Execute SQL Query with Multiple WHERE Clause', async () => {
    const query = 'SELECT id, name FROM student WHERE age = 30 AND name = John';
    const result = await executeSELECTQuerySix(query);
    expect(result.length).toBe(1);
    expect(result[0]).toEqual({ id: '1', name: 'John' });
});