import { Ng2StateDeclaration } from '@uirouter/angular';

export class ApplicationState {

  state: Ng2StateDeclaration;
  params?: any;

  constructor(state: Ng2StateDeclaration, params: any = null) {
    this.state = state;
    this.params = params;
  }

  getName() {
    return this.state.name;
  }

}
