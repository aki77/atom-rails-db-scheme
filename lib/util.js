'use babel';

import inflection from 'inflection';

const MODEL_NAME_REGEXP = /class (\w+) < (?:Application|Active)Record/;

const getTableName = editor =>
  new Promise((resolve, reject) => {
    let noMatch = true;
    editor.scan(MODEL_NAME_REGEXP, ({ match, stop }) => {
      stop();
      const [, modelName] = match;
      const tableName = inflection.tableize(modelName);
      resolve(tableName);
      noMatch = false;
    });

    if (noMatch) {
      reject();
    }
  });

export { getTableName };
