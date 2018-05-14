import { Ng2StateDeclaration } from '@uirouter/angular';
import { Layout } from '../common/Layout';
import { State } from '../common/State';
import { Component } from '@angular/core';
import { ErrorNotFoundComponent } from '../component/view/preliminary/error/ErrorNotFoundComponent';
import { MainLayoutComponent } from '../component/view/main/MainLayoutComponent';
import { HomeComponent } from '../component/view/main/home/HomeComponent';
import { PreliminaryLayoutComponent } from '../component/view/preliminary/PreliminaryLayoutComponent';
import { WeeklyMenusComponent } from '../component/view/main/weeklyMenus/WeeklyMenusComponent';
import { MealsComponent } from '../component/view/main/meals/MealsComponent';
import { AuthLoginComponent } from '../component/view/preliminary/auth/AuthLoginComponent';

@Component({ selector: 'abstract', template: '<ui-view></ui-view>' })
export class AbstractStateComponent { }

export const StateConfig: Ng2StateDeclaration[] = [

  { abstract: true, name: Layout.MAIN, component: MainLayoutComponent },
  { abstract: true, name: Layout.PRELIMINARY, component: PreliminaryLayoutComponent },

  { url: '^/error', abstract: true, name: State.PRELIMINARY.ERROR.ERROR, component: AbstractStateComponent },
    { url: '/not-found', name: State.PRELIMINARY.ERROR.NOT_FOUND, component: ErrorNotFoundComponent },

  { abstract: true, name: State.PRELIMINARY.AUTH.AUTH, component: AbstractStateComponent },
    { url: '/login', name: State.PRELIMINARY.AUTH.LOGIN, component: AuthLoginComponent },

  { url: '^/home', name: State.MAIN.HOME, component: HomeComponent },
  { url: '^/weekly-menus', name: State.MAIN.WEEKLY_MENUS, component: WeeklyMenusComponent },
  { url: '^/meals', name: State.MAIN.MEALS, component: MealsComponent },

];
