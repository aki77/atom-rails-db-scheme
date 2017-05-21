'use babel';

import { TextBuffer } from 'atom';
import inflection from 'inflection';

const CREATE_TABLE_REGEXP = /\screate_table\s"(\w+)"[\s\S]*?\send/g;
const COLUMN_REGEXP = /t\.(\w+)\s+"(\w+)".*?(?:,\s+comment:\s+"([^"]*)")?\n/g;

export default class Schema {
  constructor(filePath) {
    this.filePath = filePath;
    this.buffer = new TextBuffer({
      filePath: this.filePath,
      load: true,
    });
    this.tables = new Map();
    this.subscription = this.buffer.onDidReload(this.parse.bind(this));
  }

  destroy() {
    this.subscription.dispose();
    this.subscription = null;
    this.buffer.destroy();
    this.buffer = null;
    this.tables.clear();
    this.tables = null;
  }

  getPath() {
    return this.filePath;
  }

  getRow(tableName) {
    return this.tables.get(tableName).row;
  }

  getColumns(tableName) {
    return this.tables.get(tableName).columns;
  }

  getTable(tableName) {
    return this.tables.get(tableName);
  }

  hasTable(tableName) {
    return this.tables.has(tableName);
  }

  parse() {
    this.tables.clear();
    this.buffer.scan(CREATE_TABLE_REGEXP, ({ match, range }) => {
      const [body, tableName] = match;
      const columns = new Map();
      let matches;
      while ((matches = COLUMN_REGEXP.exec(body)) !== null) {
        const [, type, name, comment] = matches;
        columns.set(name, {
          comment: comment || null,
          type,
        });
      }
      this.tables.set(tableName, {
        row: range.start.row,
        className: inflection.classify(tableName),
        columns,
      });
    });
  }
}
