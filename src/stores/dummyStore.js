import flux from 'control';
import {createStore, bind} from 'alt-utils/lib/decorators';
import actions from 'actions/dummyActions';

@createStore(flux)
class DummyStore {
  constructor() {
    this.name = 'awesome';
  }

}

export default DummyStore;
