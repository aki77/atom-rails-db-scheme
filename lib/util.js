'use babel';

import inflection from 'inflection';

const MODEL_NAME_REGEXP = /class (\w+) < (?:Application|Active)Record/;

const getTableName = editor =>
  new Promise((resolve) => {
    let noMatch = true;
    editor.scan(MODEL_NAME_REGEXP, ({ match, stop }) => {
      stop();
      const [, modelName] = match;
      const tableName = inflection.tableize(modelName);
      resolve(tableName);
      noMatch = false;
    });

    if (noMatch) {
      resolve(null);
    }
  });

// eslint-disable-next-line import/prefer-default-export
export { getTableName };
