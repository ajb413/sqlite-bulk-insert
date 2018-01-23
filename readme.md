# Bulk Insert
Wrapper for [`sqlite`](https://www.npmjs.com/package/sqlite) npm package. The bulk insert has no limit on how many rows it will attempt to insert. Careful, or `RangeError: Invalid string length` will occur because the insert becomes a long `string`. Returns an ES6 promise.

```javascript
const sqlite = require('sqlite');
const SqliteWrapper = require('./sqlite-wrapper');

const demonstrateBulkInsert = async () => {

  const dbPromise = await sqlite.open('./database.sqlite', Promise);
  const sqliteWrapper = new SqliteWrapper(dbPromise);

  // Make a table if it doesn't already exist
  await dbPromise.all(`
    CREATE TABLE IF NOT EXISTS TableName (
      id INTEGER PRIMARY KEY,
      name TEXT,
      age INTEGER
    );`
  );

  // Object with JS type representation to validate input before bulk insert
  const tableColumns = {
    'id': 'number',
    'name': 'string',
    'age': 'number'
  };

  // DB table rows
  let toBulkInsert = [
    {
      'id': 1,
      'name': 'Alice',
      'age': 28
    },
    {
      'id': 2,
      'name': 'Bob',
      'age': 22
    },
    {
      'id': 3,
      'name': 'Carol',
      'age': 49
    }
  ];

  // Bulk Insert
  try {
    await sqliteWrapper.bulkInsert(toBulkInsert, 'TableName', tableColumns);
  } catch (e) {
    console.log(e)
  }

  console.log('done');

};

demonstrateBulkInsert();
```