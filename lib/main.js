'use babel';

import path from 'path';
import fs from 'fs-plus';
import Schema from './schema';
import Provider from './provider';
import { getTableName } from './util';

export default {
  activate() {
    if (!fs.existsSync(this.getSchemaPath())) return;
    this.schema = new Schema(this.getSchemaPath());
    this.provider = new Provider(this.schema);

    this.subscription = atom.commands.add('atom-text-editor[data-grammar~="ruby"]:not([mini])', {
      'rails-db-scheme:open-scheme': ({ currentTarget }) =>
        this.openScheme(currentTarget.getModel()),
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

  async openScheme(editor) {
    const tableName = await getTableName(editor);
    const schemaEditor = await atom.workspace.open(this.schema.getPath());
    schemaEditor.setCursorBufferPosition([this.schema.getRow(tableName), 0]);
    schemaEditor.scrollToCursorPosition();
  },

  getSchemaPath() {
    return path.join(atom.project.getPaths()[0], 'db', 'schema.rb');
  },
};
