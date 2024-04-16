// src/index.js
const { parseQuery, parseQueryWhere,parseQuerySix,parseQuerySeven,parseQueryEight,parseQueryNine,parseQueryTen}  = require('./queryParser');
const readCSV = require('./csvReader');

async function executeSELECTQuery(query) {
    const { fields, table, whereClauses } = parseQuery(query);
    const data = await readCSV(`${table}.csv`);

    // Apply WHERE clause filtering
    const filteredData = whereClauses.length > 0
        ? data.filter(row => whereClauses.every(clause => {
            // You can expand this to handle different operators
            return row[clause.field] === clause.value;
        }))
        : data;

    // Select the specified fields
    return filteredData.map(row => {
        const selectedRow = {};
        fields.forEach(field => {
            selectedRow[field] = row[field];
        });
        return selectedRow;
    });
}
async function executeSELECTQueryfour(query) {
    const { fields, table } = parseQuery(query);
    const data = await readCSV(`${table}.csv`);
    
    // Filter the fields based on the query
    return data.map(row => {
        const filteredRow = {};
        fields.forEach(field => {
            filteredRow[field] = row[field];
        });
        return filteredRow;
    });
}

async function executeSELECTQuerywhere(query) {
    const { fields, table, whereClause } = parseQueryWhere(query);
    const data = await readCSV(`${table}.csv`);
    
    // Filtering based on WHERE clause
    const filteredData = whereClause
        ? data.filter(row => {
            const [field, value] = whereClause.split('=').map(s => s.trim());
            return row[field] === value;
        })
        : data;

    // Selecting the specified fields
    return filteredData.map(row => {
        const selectedRow = {};
        fields.forEach(field => {
            selectedRow[field] = row[field];
        });
        return selectedRow;
    });
}
async function executeSELECTQuerySix(query) {
    const { fields, table, whereClauses } = parseQuerySix(query);
    const data = await readCSV(`${table}.csv`);

    // Apply WHERE clause filtering
    const filteredData = whereClauses.length > 0
        ? data.filter(row => whereClauses.every(clause => {
            // You can expand this to handle different operators
            return row[clause.field] === clause.value;
        }))
        : data;

    // Select the specified fields
    return filteredData.map(row => {
        const selectedRow = {};
        fields.forEach(field => {
            selectedRow[field] = row[field];
        });
        return selectedRow;
    });
}
function evaluateCondition(row, clause) {
    const { field, operator, value } = clause;
    switch (operator) {
        case '=': return row[field] === value;
        case '!=': return row[field] !== value;
        case '>': return row[field] > value;
        case '<': return row[field] < value;
        case '>=': return row[field] >= value;
        case '<=': return row[field] <= value;
        default: throw new Error(`Unsupported operator: ${operator}`);
    }
}
async function executeSELECTQuerySeven(query) {
     const { fields, table, whereClauses } = parseQuerySeven(query);
     const data = await readCSV(`${table}.csv`);

    // Apply WHERE clause filtering
    const filteredData = whereClauses.length > 0
        ? data.filter(row => whereClauses.every(clause => evaluateCondition(row, clause)))
        : data;

    // Select the specified fields
    return filteredData.map(row => {
        const selectedRow = {};
        fields.forEach(field => {
            selectedRow[field] = row[field];
        });
        return selectedRow;
    });
}

async function executeSELECTQueryEight(query) {
            // Now we will have joinTable, joinCondition in the parsed query
        const { fields, table, whereClauses, joinTable, joinCondition } = parseQueryEight(query);
        let data = await readCSV(`${table}.csv`);

        // Perform INNER JOIN if specified
        if (joinTable && joinCondition) {
            const joinData = await readCSV(`${joinTable}.csv`);
            data = data.flatMap(mainRow => {
                return joinData
                    .filter(joinRow => {
                        const mainValue = mainRow[joinCondition.left.split('.')[1]];
                        const joinValue = joinRow[joinCondition.right.split('.')[1]];
                        return mainValue === joinValue;
                    })
                    .map(joinRow => {
                        return fields.reduce((acc, field) => {
                            const [tableName, fieldName] = field.split('.');
                            acc[field] = tableName === table ? mainRow[fieldName] : joinRow[fieldName];
                            return acc;
                        }, {});
                    });
            });
        }

        // Apply WHERE clause filtering after JOIN (or on the original data if no join)
        const filteredData = whereClauses.length > 0
            ? data.filter(row => whereClauses.every(clause => evaluateCondition(row, clause)))
            : data;

        return filteredData.map(row => {
                const selectedRow = {};
                fields.forEach(field => {
                    // Assuming 'field' is just the column name without table prefix
                    selectedRow[field] = row[field];
                });
                return selectedRow;

});
}

function performInnerJoin(data, joinData, joinCondition, fields, table) {
    // Logic for INNER JOIN
    return data.flatMap(mainRow => {
        return joinData
            .filter(joinRow => {
                const mainValue = mainRow[joinCondition.left.split('.')[1]];
                const joinValue = joinRow[joinCondition.right.split('.')[1]];
                return mainValue === joinValue;
            })
            .map(joinRow => {
                return fields.reduce((acc, field) => {
                    const [tableName, fieldName] = field.split('.');
                    acc[field] = tableName === table ? mainRow[fieldName] : joinRow[fieldName];
                    return acc;
                }, {});
            });
    });
    // ...
}

function performLeftJoin(data, joinData, joinCondition, fields, table) {
    return data.map(mainRow => {
        const matchingRows = joinData.filter(joinRow => mainRow[joinCondition.left.split('.')[1]] === joinRow[joinCondition.right.split('.')[1]]);
        if (matchingRows.length > 0) {
            return fields.reduce((acc, field) => {
                const [tableName, fieldName] = field.split('.');
                acc[field] = tableName === table ? mainRow[fieldName] : matchingRows[0][fieldName];
                return acc;
            }, {});
        } else {
            return fields.reduce((acc, field) => {
                const [tableName, fieldName] = field.split('.');
                acc[field] = tableName === table ? mainRow[fieldName] : null;
                return acc;
            }, {});
        }
    });
    // ...
}

function performRightJoin(data, joinData, joinCondition, fields, table) {
    // Logic for RIGHT JOIN
    return joinData.map(joinRow => {
        const matchingRows = data.filter(mainRow => mainRow[joinCondition.left.split('.')[1]] === joinRow[joinCondition.right.split('.')[1]]);
        if (matchingRows.length > 0) {
            return fields.reduce((acc, field) => {
                const [tableName, fieldName] = field.split('.');
                acc[field] = tableName === table ? matchingRows[0][fieldName] : joinRow[fieldName];
                return acc;
            }, {});
        } else {
            return fields.reduce((acc, field) => {
                const [tableName, fieldName] = field.split('.');
                acc[field] = tableName === table ? null : joinRow[fieldName];
                return acc;
            }, {});
        }
    });
    // ...
}

async function executeSELECTQueryNine(query) {
    const { fields, table, whereClauses, joinType, joinTable, joinCondition } = parseQueryNine(query);
    let data = await readCSV(`${table}.csv`);

    // Logic for applying JOINs
    if (joinTable && joinCondition) {
        const joinData = await readCSV(`${joinTable}.csv`);
        switch (joinType.toUpperCase()) {
            case 'INNER':
                data = performInnerJoin(data, joinData, joinCondition, fields, table);
                break;
            case 'LEFT':
                data = performLeftJoin(data, joinData, joinCondition, fields, table);
                break;
            case 'RIGHT':
                data = performRightJoin(data, joinData, joinCondition, fields, table);
                break;
            // Handle default case or unsupported JOIN types
            default:
                throw new Error(`Unsupported JOIN type: ${joinType}`);
        }
    }

    // Apply WHERE clause filtering after JOIN (or on the original data if no join)
    const filteredData = whereClauses.length > 0
    ? data.filter(row => whereClauses.every(clause => evaluateCondition(row, clause)))
    : data;

    return filteredData.map(row => {
        const selectedRow = {};
        fields.forEach(field => {
            // Assuming 'field' is just the column name without table prefix
            selectedRow[field] = row[field];
        });
        return selectedRow;
});
}

function applyGroupBy(data, groupByFields, aggregateFunctions) {
    // Implement logic to group data and calculate aggregates
     const groupedData = data.reduce((groups, row) => {
        // Generate a key for the group based on the values of groupByFields
        const key = groupByFields.map(field => row[field]).join(',');

        // Initialize the group if it doesn't exist
        if (!groups[key]) {
            groups[key] = [];
        }

        // Add the row to the group
        groups[key].push(row);

        return groups;
    }, {});

    // Apply aggregate functions to each group
    const aggregatedData = Object.keys(groupedData).map(key => {
        const group = groupedData[key];
        const aggregatedRow = {};

        // Add group by fields to the aggregated row
        groupByFields.forEach(field => {
            aggregatedRow[field] = group[0][field];
        });

        // Calculate aggregates for each aggregate function
        aggregateFunctions.forEach(aggregateFunction => {
            const { field, operation } = aggregateFunction;
            switch (operation.toUpperCase()) {
                case 'COUNT':
                    aggregatedRow[`COUNT(${field})`] = group.length;
                    break;
                case 'SUM':
                    aggregatedRow[`SUM(${field})`] = group.reduce((sum, row) => sum + parseFloat(row[field] || 0), 0);
                    break;
                // Add cases for other aggregate functions like AVG, MAX, MIN
                case 'AVG':
                    aggregatedRow[`AVG(${field})`] = group.reduce((sum, row) => sum + parseFloat(row[field] || 0), 0) / group.length;
                    break;
                case 'MAX':
                    aggregatedRow[`MAX(${field})`] = Math.max(...group.map(row => parseFloat(row[field] || 0)));
                    break;
                case 'MIN':
                    aggregatedRow[`MIN(${field})`] = Math.min(...group.map(row => parseFloat(row[field] || 0)));
                    break;
                default:
                    throw new Error(`Unsupported aggregate function: ${operation}`);
            }
        });

        return aggregatedRow;
    });

    return aggregatedData;
    // ...
}
async function executeSELECTQueryTen(query) {
    const { fields, table, whereClauses, joinType, joinTable, joinCondition, groupByFields } = parseQueryTen(query);
    let data = await readCSV(`${table}.csv`);

    // ...existing logic for JOINs and WHERE clause...
    if (joinTable && joinCondition) {
        const joinData = await readCSV(`${joinTable}.csv`);
        switch (joinType.toUpperCase()) {
            case 'INNER':
                data = performInnerJoin(data, joinData, joinCondition, fields, table);
                break;
            case 'LEFT':
                data = performLeftJoin(data, joinData, joinCondition, fields, table);
                break;
            case 'RIGHT':
                data = performRightJoin(data, joinData, joinCondition, fields, table);
                break;
            // Handle default case or unsupported JOIN types
            default:
                throw new Error(`Unsupported JOIN type: ${joinType}`);
        }
    }

    // Apply WHERE clause filtering after JOIN (or on the original data if no join)
    const filteredData = whereClauses.length > 0
    ? data.filter(row => whereClauses.every(clause => evaluateCondition(row, clause)))
    : data;

    if (groupByFields) {
        data = applyGroupBy(data, groupByFields, fields);
    }

    // ...existing logic for field selection...
    return filteredData.map(row => {
        const selectedRow = {};
        fields.forEach(field => {
            // Assuming 'field' is just the column name without table prefix
            selectedRow[field] = row[field];
        });
        return selectedRow;
});
}


module.exports = {
    executeSELECTQuery,
    executeSELECTQueryfour,
    executeSELECTQuerywhere,
    executeSELECTQuerySix,
    executeSELECTQuerySeven,
    executeSELECTQueryEight,
    executeSELECTQueryNine,
    executeSELECTQueryTen
};
