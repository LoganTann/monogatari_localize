'use babel';

import AtomMonogatariView from './atom-monogatari-view';
import { CompositeDisposable } from 'atom';

export default {

  atomMonogatariView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.atomMonogatariView = new AtomMonogatariView(state.atomMonogatariViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.atomMonogatariView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-monogatari:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.atomMonogatariView.destroy();
  },

  serialize() {
    return {
      atomMonogatariViewState: this.atomMonogatariView.serialize()
    };
  },

  toggle() {
    console.log('AtomMonogatari was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
