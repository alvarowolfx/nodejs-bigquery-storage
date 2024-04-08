// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// ** This file is automatically generated by gapic-generator-typescript. **
// ** https://github.com/googleapis/gapic-generator-typescript **
// ** All changes to this file may be overwritten. **

'use strict';

const {assert} = require('chai');
const {describe, it, before, after} = require('mocha');
const uuid = require('uuid');
const cp = require('child_process');
const {BigQuery} = require('@google-cloud/bigquery');

const bigquery = new BigQuery();

const execSync = cmd => cp.execSync(cmd, {encoding: 'utf-8'});

const GCLOUD_TESTS_PREFIX = 'nodejs_bqstorage_samples_test';

const generateUuid = () =>
  `${GCLOUD_TESTS_PREFIX}_${uuid.v4()}`.replace(/-/gi, '_');

const datasetId = generateUuid();
const datasetIdEU = generateUuid();
const nonUSLocation = 'europe-west1';

describe('writeClient', () => {
  let projectId;

  before(async () => {
    await deleteDatasets();

    await bigquery.createDataset(datasetId);
    await bigquery.createDataset(datasetIdEU, {location: nonUSLocation});
  });

  after(async () => {
    await bigquery.dataset(datasetId).delete({force: true}).catch(console.warn);
  });

  it('should append rows', async () => {
    const schema = [
      {name: 'customer_name', type: 'STRING'},
      {name: 'row_num', type: 'INTEGER', mode: 'REQUIRED'},
    ];

    const tableId = generateUuid();

    const [table] = await bigquery
      .dataset(datasetId)
      .createTable(tableId, {schema});

    projectId = table.metadata.tableReference.projectId;

    const output = execSync(
      `node append_rows_pending ${projectId} ${datasetId} ${tableId}`
    );

    assert.match(output, /Stream created:/);
    assert.match(output, /Row count: 3/);

    let [rows] = await table.query(
      `SELECT * FROM \`${projectId}.${datasetId}.${tableId}\``
    );

    rows = rows.map(row => {
      if (row.customer_name !== null) {
        return row;
      }
    });

    assert.strictEqual(rows.length, 3);
    assert.deepInclude(rows, {customer_name: 'Octavia', row_num: 1});
    assert.deepInclude(rows, {customer_name: 'Turing', row_num: 2});
    assert.deepInclude(rows, {customer_name: 'Bell', row_num: 3});
  });

  it('should append rows to default stream', async () => {
    const schema = [
      {name: 'customer_name', type: 'STRING'},
      {name: 'row_num', type: 'INTEGER', mode: 'REQUIRED'},
    ];

    const tableId = generateUuid();

    const [table] = await bigquery
      .dataset(datasetId)
      .createTable(tableId, {schema});

    projectId = table.metadata.tableReference.projectId;

    execSync(
      `node append_rows_json_writer_default ${projectId} ${datasetId} ${tableId}`
    );

    let [rows] = await table.query(
      `SELECT * FROM \`${projectId}.${datasetId}.${tableId}\``
    );

    rows = rows.map(row => {
      if (row.customer_name !== null) {
        return row;
      }
    });

    assert.strictEqual(rows.length, 3);
    assert.deepInclude(rows, {customer_name: 'Octavia', row_num: 1});
    assert.deepInclude(rows, {customer_name: 'Turing', row_num: 2});
    assert.deepInclude(rows, {customer_name: 'Bell', row_num: 3});
  });

  it('should append rows buffered', async () => {
    const schema = [
      {name: 'customer_name', type: 'STRING'},
      {name: 'row_num', type: 'INTEGER', mode: 'REQUIRED'},
    ];

    const tableId = generateUuid();

    const [table] = await bigquery
      .dataset(datasetId)
      .createTable(tableId, {schema});

    projectId = table.metadata.tableReference.projectId;

    const output = execSync(
      `node append_rows_buffered ${projectId} ${datasetId} ${tableId}`
    );

    assert.match(output, /Stream created:/);
    assert.match(output, /Row count: 3/);

    let [rows] = await table.query(
      `SELECT * FROM \`${projectId}.${datasetId}.${tableId}\``
    );

    rows = rows.map(row => {
      if (row.customer_name !== null) {
        return row;
      }
    });

    assert.strictEqual(rows.length, 3);
    assert.deepInclude(rows, {customer_name: 'Octavia', row_num: 1});
    assert.deepInclude(rows, {customer_name: 'Turing', row_num: 2});
    assert.deepInclude(rows, {customer_name: 'Bell', row_num: 3});
  });

  it('should append rows committed', async () => {
    const schema = [
      {name: 'customer_name', type: 'STRING'},
      {name: 'row_num', type: 'INTEGER', mode: 'REQUIRED'},
    ];

    const tableId = generateUuid();

    const [table] = await bigquery
      .dataset(datasetId)
      .createTable(tableId, {schema});

    projectId = table.metadata.tableReference.projectId;

    const output = execSync(
      `node append_rows_json_writer_commited ${projectId} ${datasetId} ${tableId}`
    );

    assert.match(output, /Stream created:/);
    assert.match(output, /Row count: 3/);

    let [rows] = await table.query(
      `SELECT * FROM \`${projectId}.${datasetId}.${tableId}\``
    );

    rows = rows.map(row => {
      if (row.customer_name !== null) {
        return row;
      }
    });

    assert.strictEqual(rows.length, 3);
    assert.deepInclude(rows, {customer_name: 'Octavia', row_num: 1});
    assert.deepInclude(rows, {customer_name: 'Turing', row_num: 2});
    assert.deepInclude(rows, {customer_name: 'Bell', row_num: 3});
  });

  it('should append rows in non-US regions', async () => {
    const schema = [
      {name: 'customer_name', type: 'STRING'},
      {name: 'row_num', type: 'INTEGER', mode: 'REQUIRED'},
    ];

    const tableId = generateUuid();

    const [table] = await bigquery
      .dataset(datasetIdEU)
      .createTable(tableId, {schema, location: nonUSLocation});

    projectId = table.metadata.tableReference.projectId;

    const output = execSync(
      `node append_rows_pending ${projectId} ${datasetIdEU} ${tableId}`
    );

    assert.match(output, /Stream created:/);
    assert.match(output, /Row count: 3/);

    let [rows] = await table.query(
      `SELECT * FROM \`${projectId}.${datasetIdEU}.${tableId}\``
    );

    rows = rows.map(row => {
      if (row.customer_name !== null) {
        return row;
      }
    });

    assert.strictEqual(rows.length, 3);
    assert.deepInclude(rows, {customer_name: 'Octavia', row_num: 1});
    assert.deepInclude(rows, {customer_name: 'Turing', row_num: 2});
    assert.deepInclude(rows, {customer_name: 'Bell', row_num: 3});
  });

  describe('should append rows with multiple types', async () => {
    it('uses protofile generated stubs', async () => {
      return testAppendRowsMultipleType('append_rows_proto2');
    });

    it('adapts BQ Schema to Proto descriptor', async () => {
      return testAppendRowsMultipleType('append_rows_table_to_proto2');
    });
  });

  async function testAppendRowsMultipleType(testFile) {
    const schema = [
      {name: 'bool_col', type: 'BOOLEAN'},
      {name: 'bytes_col', type: 'BYTES'},
      {name: 'float64_col', type: 'FLOAT'},
      {name: 'int64_col', type: 'INTEGER'},
      {name: 'string_col', type: 'STRING'},
      {name: 'date_col', type: 'DATE'},
      {name: 'datetime_col', type: 'DATETIME'},
      {name: 'geography_col', type: 'GEOGRAPHY'},
      {name: 'numeric_col', type: 'NUMERIC'},
      {name: 'bignumeric_col', type: 'BIGNUMERIC'},
      {name: 'time_col', type: 'TIME'},
      {name: 'timestamp_col', type: 'TIMESTAMP'},
      {name: 'int64_list', type: 'INTEGER', mode: 'REPEATED'},
      {
        name: 'struct_col',
        type: 'RECORD',
        fields: [{name: 'sub_int_col', type: 'INTEGER'}],
      },
      {
        name: 'struct_list',
        type: 'RECORD',
        mode: 'REPEATED',
        fields: [{name: 'sub_int_col', type: 'INTEGER'}],
      },
      {
        name: 'range_col',
        type: 'RANGE',
        rangeElementType: {
          type: 'TIMESTAMP',
        },
      },
      {name: 'row_num', type: 'INTEGER', mode: 'REQUIRED'},
    ];

    const tableId = generateUuid();

    const [table] = await bigquery
      .dataset(datasetId)
      .createTable(tableId, {schema});

    projectId = table.metadata.tableReference.projectId;

    const output = execSync(
      `node ${testFile} ${projectId} ${datasetId} ${tableId}`
    );
    assert.match(output, /Stream created:/);
    assert.match(output, /Row count: 16/);

    let [rows] = await table.query(
      `SELECT * FROM \`${projectId}.${datasetId}.${tableId}\` order by row_num`
    );

    rows = rows.map(row => {
      return Object.entries(row)
        .filter(([, value]) => value !== null && value.length !== 0)
        .map(([name, value]) => {
          if (value.value) {
            value = value.value;
          }
          if (name === 'numeric_col' || name === 'bignumeric_col') {
            value = value.toNumber();
          }
          if (name === 'range_col') {
            // Parse range while not supported on @google-cloud/bigquery pkg
            console.log('Found range column', value);
            const [start, end] = value
              .replace('[', '')
              .replace(')', '')
              .split(',');
            value = {
              start: BigQuery.timestamp(start).value,
              end: BigQuery.timestamp(end).value,
            };
            console.log('Parsed range column', value);
          }
          return {[name]: value};
        });
    });

    assert.strictEqual(rows.length, 16);
    assert.deepInclude(rows, [
      {
        bool_col: true,
      },
      {bytes_col: Buffer.from('hello world')},
      {float64_col: 123.44999694824219},
      {int64_col: 123},
      {string_col: 'omg'},
      {row_num: 1},
    ]);
    assert.deepInclude(rows, [{bool_col: false}, {row_num: 2}]);
    assert.deepInclude(rows, [
      {bytes_col: Buffer.from('later, gator')},
      {row_num: 3},
    ]);
    assert.deepInclude(rows, [{float64_col: 987.6539916992188}, {row_num: 4}]);
    assert.deepInclude(rows, [{int64_col: 321}, {row_num: 5}]);
    assert.deepInclude(rows, [{string_col: 'octavia'}, {row_num: 6}]);
    assert.deepInclude(rows, [{date_col: '2019-02-07'}, {row_num: 7}]);
    assert.deepInclude(rows, [
      {datetime_col: '2019-02-17T11:24:00'},
      {row_num: 8},
    ]);
    assert.deepInclude(rows, [{geography_col: 'POINT(5 5)'}, {row_num: 9}]);
    assert.deepInclude(rows, [
      {numeric_col: 123456},
      {bignumeric_col: 1e29},
      {row_num: 10},
    ]);
    assert.deepInclude(rows, [{time_col: '18:00:00'}, {row_num: 11}]);
    assert.deepInclude(rows, [
      {timestamp_col: '2022-01-09T03:49:46.564Z'},
      {row_num: 12},
    ]);
    assert.deepInclude(rows, [{int64_list: [1999, 2001]}, {row_num: 13}]);
    assert.deepInclude(rows, [{struct_col: {sub_int_col: 99}}, {row_num: 14}]);
    assert.deepInclude(rows, [
      {struct_list: [{sub_int_col: 100}, {sub_int_col: 101}]},
      {row_num: 15},
    ]);
    console.log('Row 16', rows[15]);
    assert.deepInclude(rows, [
      {
        range_col: {
          start: '2022-01-09T03:49:46.564Z',
          end: '2022-01-09T04:49:46.564Z',
        },
      },
      {row_num: 16},
    ]);
  }

  // Only delete a resource if it is older than 24 hours. That will prevent
  // collisions with parallel CI test runs.
  function isResourceStale(creationTime) {
    const oneDayMs = 86400000;
    const now = new Date();
    const created = new Date(creationTime);
    return now.getTime() - created.getTime() >= oneDayMs;
  }

  async function deleteDatasets() {
    let [datasets] = await bigquery.getDatasets();
    datasets = datasets.filter(dataset =>
      dataset.id.includes(GCLOUD_TESTS_PREFIX)
    );

    for (const dataset of datasets) {
      const [metadata] = await dataset.getMetadata();
      const creationTime = Number(metadata.creationTime);

      if (isResourceStale(creationTime)) {
        try {
          await dataset.delete({force: true});
        } catch (e) {
          console.log(`dataset(${dataset.id}).delete() failed`);
          console.log(e);
        }
      }
    }
  }
});
