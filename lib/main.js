'use babel';

import fs from 'fs-plus';

import path from 'path';

import { getTableName } from './util';
import Provider from './provider';
import Schema from './schema';
import TablesView from './tables-view';

export default {
  async activate() {
    if (!fs.existsSync(this.getSchemaPath())) return;
    this.schema = new Schema(this.getSchemaPath());
    this.provider = new Provider(this.schema);
    await this.schema.load();
    this.subscription = atom.commands.add('atom-workspace', {
      'rails-db-scheme:open-scheme': () => this.openScheme(),
    });
  },

  deactivate() {
    if (this.subscription) {
      this.subscription.dispose();
      this.subscription = null;
    }

    if (this.schema) {
      this.schema.destroy();
      this.schema = null;
    }
  },

  getProvider() {
    return this.provider;
  },

  async getTableName() {
    const editor = atom.workspace.getActiveTextEditor();
    if (editor) {
      const currentTableName = await getTableName(editor);
      if (currentTableName) {
        return currentTableName;
      }
    }

    if (!this.tablesView) {
      this.tablesView = new TablesView(this.schema);
    }

    return new Promise((resolve) => {
      this.tablesView.toggle((tableName) => {
        resolve(tableName);
      });
    });
  },

  async openScheme() {
    const tableName = await this.getTableName();
    const schemaEditor = await atom.workspace.open(this.schema.getPath());
    schemaEditor.setCursorBufferPosition([this.schema.getRow(tableName), 0]);
    schemaEditor.scrollToCursorPosition();
  },

  getSchemaPath() {
    return path.join(atom.project.getPaths()[0], 'db', 'schema.rb');
  },
};
