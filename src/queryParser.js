// src/queryParser.js

function parseQuery(query) {
    const selectRegex = /SELECT (.+) FROM (.+)/i;
    const match = query.match(selectRegex);

    if (match) {
        const [, fields, table] = match;
        return {
            fields: fields.split(',').map(field => field.trim()),
            table: table.trim()
        };
    } else {
        throw new Error('Invalid query format');
    }
}

function parseQueryWhere(query) {
    const selectRegex = /SELECT (.+?) FROM (.+?)(?: WHERE (.*))?$/i;
    const match = query.match(selectRegex);

    if (match) {
        const [, fields, table, whereClause] = match;
        return {
            fields: fields.split(',').map(field => field.trim()),
            table: table.trim(),
            whereClause: whereClause ? whereClause.trim() : null
        };
    } else {
        throw new Error('Invalid query format');
    }
}

function parseQuerySix(query) {
    const selectRegex = /SELECT (.+?) FROM (.+?)(?: WHERE (.*))?$/i;
    const match = query.match(selectRegex);

    if (match) {
        const [, fields, table, whereString] = match;
        const whereClauses = whereString ? parseWhereClauseSix(whereString) : [];
        return {
            fields: fields.split(',').map(field => field.trim()),
            table: table.trim(),
            whereClauses
        };
    } else {
        throw new Error('Invalid query format');
    }
}
function parseWhereClauseSix(whereString) {
    const conditions = whereString.split(/ AND | OR /i);
    return conditions.map(condition => {
        const [field, operator, value] = condition.split(/\s+/);
        return { field, operator, value };
    });
}
function parseQuerySeven(query) {
    const selectRegex = /SELECT (.+?) FROM (.+?)(?: WHERE (.*))?$/i;
    const match = query.match(selectRegex);

    if (match) {
        const [, fields, table, whereString] = match;
        const whereClauses = whereString ? parseWhereClauseSeven(whereString) : [];
        return {
            fields: fields.split(',').map(field => field.trim()),
            table: table.trim(),
            whereClauses
        };
    } else {
        throw new Error('Invalid query format');
    }
}

function parseWhereClauseSeven(whereString) {
    const conditionRegex = /(.*?)(=|!=|>|<|>=|<=)(.*)/;
    return whereString.split(/ AND | OR /i).map(conditionString => {
        const match = conditionString.match(conditionRegex);
        if (match) {
            const [, field, operator, value] = match;
            return { field: field.trim(), operator, value: value.trim() };
        }
        throw new Error('Invalid WHERE clause format');

    });
}

function parseQueryEight(query) {
    // First, let's trim the query to remove any leading/trailing whitespaces
    query = query.trim();

    // Initialize variables for different parts of the query
    let selectPart, fromPart;

    // Split the query at the WHERE clause if it exists
    const whereSplit = query.split(/\sWHERE\s/i);
    query = whereSplit[0]; // Everything before WHERE clause

    // WHERE clause is the second part after splitting, if it exists
    const whereClause = whereSplit.length > 1 ? whereSplit[1].trim() : null;

    // Split the remaining query at the JOIN clause if it exists
    const joinSplit = query.split(/\sINNER JOIN\s/i);
    selectPart = joinSplit[0].trim(); // Everything before JOIN clause

    // JOIN clause is the second part after splitting, if it exists
    const joinPart = joinSplit.length > 1 ? joinSplit[1].trim() : null;

    // Parse the SELECT part
    const selectRegex = /^SELECT\s(.+?)\sFROM\s(.+)/i;
    const selectMatch = selectPart.match(selectRegex);
    if (!selectMatch) {
        throw new Error('Invalid SELECT format');
    }

    const [, fields, table] = selectMatch;

    // Parse the JOIN part if it exists
    let joinTable = null, joinCondition = null;
    if (joinPart) {
        const joinRegex = /^(.+?)\sON\s([\w.]+)\s*=\s*([\w.]+)/i;
        const joinMatch = joinPart.match(joinRegex);
        if (!joinMatch) {
            throw new Error('Invalid JOIN format');
        }

        joinTable = joinMatch[1].trim();
        joinCondition = {
            left: joinMatch[2].trim(),
            right: joinMatch[3].trim()
        };
    }

    // Parse the WHERE part if it exists
    let whereClauses = [];
    if (whereClause) {
        whereClauses = parseWhereClauseSeven(whereClause);
    }
    return {
        fields: fields.split(',').map(field => field.trim()),
        table: table.trim(),
        whereClauses,
        joinTable,
        joinCondition
    };
}
// function parseJoinClauseNine(query) {
//     const joinRegex = /\s(INNER|LEFT|RIGHT) JOIN\s(.+?)\sON\s([\w.]+)\s*=\s*([\w.]+)/i;
//     const joinMatch = query.match(joinRegex);

//     if (joinMatch) {
//         return {
//             joinType: joinMatch[1].trim(),
//             joinTable: joinMatch[2].trim(),
//             joinCondition: {
//                 left: joinMatch[3].trim(),
//                 right: joinMatch[4].trim()
//             }
//         };
//     }

//     return {
//         joinType: null,
//         joinTable: null,
//         joinCondition: null
//     };
// }

function parseQueryNine(query) {
    // First, let's trim the query to remove any leading/trailing whitespaces
    query = query.trim();

    // Initialize variables for different parts of the query
    let selectPart, fromPart;

    // Split the query at the WHERE clause if it exists
    const whereSplit = query.split(/\sWHERE\s/i);
    query = whereSplit[0]; // Everything before WHERE clause

    // WHERE clause is the second part after splitting, if it exists
    const whereClause = whereSplit.length > 1 ? whereSplit[1].trim() : null;

    // Split the remaining query at the JOIN clause if it exists
    const joinSplit = query.split(/\sINNER\sJOIN\s|\sLEFT\sJOIN\s|\sRIGHT\sJOIN\s/i);
    selectPart = joinSplit[0].trim(); // Everything before JOIN clause

    // // JOIN clause is the second part after splitting, if it exists
    const joinPart = joinSplit.length > 1 ? joinSplit[1].trim() : null;

    // Parse the SELECT part
    const selectRegex = /^SELECT\s(.+?)\sFROM\s(.+)/i;
    const selectMatch = selectPart.match(selectRegex);
    if (!selectMatch) {
        throw new Error('Invalid SELECT format');
    }

    const [, fields, table] = selectMatch;

    // Parse the JOIN part if it exists
    let joinTable = null, joinCondition = null, joinType = null;
    if (joinPart) {
        
        const joinRegex = /\s(INNER|LEFT|RIGHT) JOIN\s(.+?)\sON\s([\w.]+)\s*=\s*([\w.]+)/i;
        const joinMatch = query.match(joinRegex);

        if (joinMatch) {
           
            joinType =joinMatch[1].trim(),
            joinTable =joinMatch[2].trim(),
                joinCondition = {
                    left: joinMatch[3].trim(),
                    right: joinMatch[4].trim()
                }
        
        }
    }

    // Parse the WHERE part if it exists
    let whereClauses = [];
    if (whereClause) {
        whereClauses = parseWhereClauseSeven(whereClause);
    }
    return {
        fields: fields.split(',').map(field => field.trim()),
        table: table.trim(),
        whereClauses,
        joinType,
        joinTable,
        joinCondition
    };
}

function parseQueryTen(query) {
    query = query.trim();

    // Initialize variables for different parts of the query
    let selectPart, fromPart;

    // Split the query at the WHERE clause if it exists
    const whereSplit = query.split(/\sWHERE\s/i);
    query = whereSplit[0]; // Everything before WHERE clause

    // WHERE clause is the second part after splitting, if it exists
    const whereClause = whereSplit.length > 1 ? whereSplit[1].trim() : null;

    // Split the remaining query at the JOIN clause if it exists
    const joinSplit = query.split(/\sINNER\sJOIN\s|\sLEFT\sJOIN\s|\sRIGHT\sJOIN\s/i);
    selectPart = joinSplit[0].trim(); // Everything before JOIN clause

    // // JOIN clause is the second part after splitting, if it exists
    const joinPart = joinSplit.length > 1 ? joinSplit[1].trim() : null;
    let joinTable = null, joinCondition = null, joinType = null;
    if (joinPart) {
        
        const joinRegex = /\s(INNER|LEFT|RIGHT) JOIN\s(.+?)\sON\s([\w.]+)\s*=\s*([\w.]+)/i;
        const joinMatch = query.match(joinRegex);

        if (joinMatch) {
           
            joinType =joinMatch[1].trim(),
            joinTable =joinMatch[2].trim(),
                joinCondition = {
                    left: joinMatch[3].trim(),
                    right: joinMatch[4].trim()
                }
        
        }
    }

    // Parse the SELECT part
    const selectRegex = /^SELECT\s(.+?)\sFROM\s(.+)/i;
    const selectMatch = selectPart.match(selectRegex);
    if (!selectMatch) {
        throw new Error('Invalid SELECT format');
    }

    const [, fields, table] = selectMatch;

  
    const groupByRegex = /\sGROUP BY\s(.+)/i;
    const groupByMatch = query.match(groupByRegex);

    let groupByFields = null;
    if (groupByMatch) {
        groupByFields = groupByMatch[1].split(',').map(field => field.trim());
    }
    let whereClauses = [];
    if (whereClause) {
        whereClauses = parseWhereClauseSeven(whereClause);
    }
    return {
        fields: fields.split(',').map(field => field.trim()),
        table: table.trim(),
        whereClauses,
        joinTable,
        joinType,
        joinCondition,
        groupByFields
    };

    
}

module.exports = {
   parseQuery,
   parseQueryWhere,
   parseQuerySix,
   parseQuerySeven,
   parseQueryEight,
   parseQueryNine,
   parseQueryTen
};