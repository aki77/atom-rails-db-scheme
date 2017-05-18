'use babel';

import path from 'path';
import inflection from 'inflection';
import fs from 'fs-plus';
import { CompositeDisposable, TextBuffer } from 'atom';

const CREATE_TABLE_REGEXP = /\screate_table\s"(\w+)"[\s\S]*?\send/g;
const MODEL_NAME_REGEXP = /class (\w+) < ApplicationRecord/;

export default {
  subscriptions: null,

  activate() {
    if (!fs.existsSync(this.getSchemaPath())) return;

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(
      atom.commands.add('atom-text-editor', {
        'rails-db-scheme:open-scheme': ({ currentTarget }) =>
          this.openScheme(currentTarget.getModel()),
      }),
    );

    this.tables = new Map();
    this.loadSchema();
  },

  deactivate() {
    this.subscriptions.dispose();
    this.tables = null;
  },

  openScheme(editor) {
    editor.scan(MODEL_NAME_REGEXP, ({ match, stop }) => {
      stop();
      const [, modelName] = match;
      const tableName = inflection.tableize(modelName);
      if (this.tables.has(tableName)) {
        atom.workspace.open(this.getSchemaPath(), { initialLine: this.tables.get(tableName).row });
      }
    });
  },

  getSchemaPath() {
    return path.join(atom.project.getPaths()[0], 'db', 'schema.rb');
  },

  loadSchema() {
    this.tables.clear();
    const buffer = new TextBuffer({
      filePath: this.getSchemaPath(),
      load: true,
    });
    buffer.onDidChangeModified(() => {
      buffer.scan(CREATE_TABLE_REGEXP, ({ match, range }) => {
        const [body, tableName] = match;
        const columns = new Map();
        const columnRegexp = /t\.(\w+)\s+"(\w+)"/g;
        let matches;
        while ((matches = columnRegexp.exec(body)) !== null) {
          const [, type, name] = matches;
          columns.set(name, { type });
        }
        this.tables.set(tableName, { row: range.start.row, columns });
      });
    });
  },
};
