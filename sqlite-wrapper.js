module.exports = class {

  constructor (sqliteObject) {
    if (!sqliteObject || typeof sqliteObject !== 'object') {
      throw Error('[BulkInsert] must be passed a "sqlite" connection on init');
      return;
    }

    this.db = sqliteObject;

  }

/**
 * Bulk inserts rows into an existing SQLite DB table. No maximum row 
 *     restriction.
 *
 * @param {Array} rows Array of Objects that contain all row data.
 *     The keys and values must correspond with the JS types in 'tableColumns'.
 *
 * @param {string} table Table name that must already exist in DB.
 *     serve.
 *
 * @param {Object} tableColumns Object that contains keys that correspond to the
 *     table column names and values that correspond to the JS type of the row
 *     value passed in a row object in 'rows' array.
 *
 * @return {Promise}
 */
  bulkInsert (rows, table, tableColumns) {
    return new Promise(async (resolve, reject) => {

      if (!Array.isArray(rows)) {
        reject('[bulkInsert] "rows" not of type array');
      }

      if (rows.length < 1) {
        reject('[bulkInsert] "rows" no rows to insert');
      }

      if (!table || typeof table !== 'string') {
        reject('[bulkInsert] "table" must be a string');
      }

      if (!tableColumns || 
          typeof tableColumns !== 'object' ||
          Array.isArray(tableColumns)) {
        reject('[bulkInsert] "tableColumns" not of type Object');
      }

      const columns = Object.keys(tableColumns);

      let query = `INSERT INTO ${table} ('${columns.join("', '")}') VALUES `;

      for (let row of rows) {

        if (!row || typeof row !== 'object' || Array.isArray(row)) {
          reject('[bulkInsert] "rows" object in rows is not valid');
        }

        let keys = Object.keys(row);

        if (!keys.length) {
          reject('[bulkInsert] "rows" cannot insert empty row object');
        }

        for (let column of keys) {
          if (tableColumns[column] !== typeof row[column]) {
            console.log(typeof tableColumns[column], row[column]);
            reject(
              '[bulkInsert] "rows" object in rows contains an incorrect type'
            );
          }
        }

        let values = Object.values(row);

        query += `('${values.join("', '")}'),`;

      }

      query = query.substring(0, query.length-1) + ';';

      try {
        await this.db.all(query);
      } catch (e) {
        reject(e);
      }

      resolve();

    });

  };

};
