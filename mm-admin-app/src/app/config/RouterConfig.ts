import { UIRouter, StatesModule, trace } from '@uirouter/angular';
import { Injector } from '@angular/core';

export function RouterConfig(uiRouter: UIRouter, injector: Injector, module: StatesModule): any {

  uiRouter.urlService.rules.when('/', '/home');
  uiRouter.urlService.rules.otherwise('/error/not-found');

  // trace.enable('TRANSITION');
}
