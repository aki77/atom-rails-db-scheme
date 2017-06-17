'use babel';

import SelectListView from 'atom-select-list';

export default class TablesView {
  constructor(schema) {
    this.schema = schema;
    this.panel = null;
    this.selectListView = new SelectListView({
      items: [],
      didConfirmSelection: (item) => {
        this.callback(item);
        this.cancel();
      },
      didConfirmEmptySelection: () => {
        this.cancel();
      },
      didCancelSelection: () => {
        this.cancel();
      },
      elementForItem: (item) => {
        const li = document.createElement('li');
        li.textContent = item;
        return li;
      },
    });
    this.element = this.selectListView.element;
  }

  async toggle(callback) {
    this.callback = callback;
    if (this.panel != null) {
      this.cancel();
    } else {
      this.selectListView.reset();
      this.selectListView.update({
        items: Array.from(this.schema.getTables().keys()),
      });
      this.attach();
    }
  }

  cancel() {
    if (this.panel != null) {
      this.panel.destroy();
      this.panel = null;
    }

    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus();
      this.previouslyFocusedElement = null;
    }
  }

  attach() {
    this.previouslyFocusedElement = document.activeElement;
    this.panel = atom.workspace.addModalPanel({ item: this });
    this.selectListView.focus();
  }
}
