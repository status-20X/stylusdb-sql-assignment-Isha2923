const readCSV = require('../../src/csvReader');
const {parseQuery, parseQueryWhere ,parseQuerySix,pparseQuerySeven}= require('../../src/queryParser');
const {executeSELECTQuery,executeSELECTQueryfour,executeSELECTQuerywhere,executeSELECTQuerySix,executeSELECTQuerySeven} = require('../../src/index');

test('Read CSV File', async () => {
    const data = await readCSV('./student.csv');
    expect(data.length).toBeGreaterThan(0);
    expect(data.length).toBe(4);
   // expect(data[0].name).toBe('John');
    //expect(data[0].age).toBe('30'); //ignore the string type here, we will fix this later
});

test('Execute SQL Query with Greater Than', async () => {
    const queryWithGT = 'SELECT id FROM student WHERE age > 22';
    const result = await executeSELECTQuerySeven(queryWithGT);
   // expect(result.length).toEqual(4);
    expect(result[0]).toHaveProperty('id');
});

test('Execute SQL Query with Not Equal to', async () => {
    const queryWithGT = 'SELECT name FROM student WHERE age != 25';
    const result = await executeSELECTQuerySeven(queryWithGT);
    //expect(result.length).toEqual(2);
    expect(result[0]).toHaveProperty('name');
});

