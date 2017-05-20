'use babel';

import path from 'path';
import fs from 'fs-plus';
import { CompositeDisposable } from 'atom';
import Schema from './schema';
import Provider from './provider';
import { getTableName } from './util';

export default {
  subscriptions: null,

  activate() {
    if (!fs.existsSync(this.getSchemaPath())) return;
    this.schema = new Schema(this.getSchemaPath());
    this.provider = new Provider(this.schema);

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(
      atom.commands.add('atom-text-editor', {
        'rails-db-scheme:open-scheme': ({ currentTarget }) =>
          this.openScheme(currentTarget.getModel()),
      }),
    );
  },

  deactivate() {
    if (this.subscriptions) {
      this.subscriptions.dispose();
      this.subscriptions = null;
    }

    if (this.schema) {
      this.schema.destroy();
      this.schema = null;
    }
  },

  getProvider() {
    return this.provider;
  },

  openScheme(editor) {
    getTableName(editor).then((tableName) => {
      atom.workspace.open(this.schema.getPath(), {
        initialLine: this.schema.getRow(tableName),
      });
    });
  },

  getSchemaPath() {
    return path.join(atom.project.getPaths()[0], 'db', 'schema.rb');
  },
};
