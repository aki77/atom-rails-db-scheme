'use babel';

import inflection from 'inflection';
import { getTableName } from './util';

const SELECTOR = ['.source.ruby'];
const SELECTOR_DISABLE = ['.comment', '.string'];

const LINE_PETTERNS = [/(\w+)\.human_attribute_name\s:\w*/, /(?:(\w+)\.)?\w*$/];

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
    const matches = this.match(line);
    if (!matches) {
      return [];
    }
    const [, receiver] = matches;

    if (!receiver || receiver === 'self') {
      if (scopeDescriptor.getScopesArray().includes('meta.rails.model')) {
        return getTableName(editor).then(this.getColumnsSuggestions.bind(this));
      }
      return [];
    }

    const tableName = inflection.tableize(receiver);
    return this.getColumnsSuggestions(tableName);
  }

  match(line) {
    for (const pattern of LINE_PETTERNS) {
      const matches = line.match(pattern);
      if (matches) {
        return matches;
      }
    }

    return null;
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
