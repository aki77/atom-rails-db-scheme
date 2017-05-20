'use babel';

import inflection from 'inflection';
import { getTableName } from './util';

const SELECTOR = ['.source.ruby'];
const SELECTOR_DISABLE = ['.comment', '.string'];
const LINE_REGEXP = /(?:(\w+)\.)?\w*$/;

export default class Provider {
  constructor(schema) {
    this.schema = schema;

    this.selector = SELECTOR.join(', ');
    this.disableForSelector = SELECTOR_DISABLE.join(', ');
    this.filterSuggestions = true;
    this.suggestionPriority = 5;
  }

  getSuggestions({ bufferPosition, editor, scopeDescriptor }) {
    const line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
    const matches = line.match(LINE_REGEXP);
    if (!matches) {
      return [];
    }
    const [, parent] = matches;

    if (!parent || parent === 'self') {
      if (scopeDescriptor.getScopesArray().includes('meta.rails.model')) {
        return getTableName(editor).then(this.getColumnsSuggestions.bind(this));
      }
      return [];
    }

    const tableName = inflection.tableize(parent);
    return this.getColumnsSuggestions(tableName);
  }

  getColumnsSuggestions(tableName) {
    const table = this.schema.getTable(tableName);
    if (!table) {
      return [];
    }

    return Array.from(table.columns).map(([col, { comment, type }]) => ({
      text: col,
      type: 'function',
      leftLabel: table.className,
      rightLabel: type,
      description: comment,
    }));
  }
}
