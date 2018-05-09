import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDateAdapter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomFormsModule } from 'ng4-validators';
import { HttpClientModule } from '@angular/common/http';
import { AsyncLocalStorageModule } from 'angular-async-local-storage';
import { NgPipesModule } from 'ngx-pipes';
import { EventsServiceModule } from 'angular-event-service/dist';
import { FirebaseManager } from './util/FirebaseManager';
import { FirestoreManager } from './util/FirestoreManager';
import { IngredientService } from './service/IngredientService';
import { IngredientModel } from './model/IngredientModel';
import { MealModel } from './model/MealModel';
import { MealService } from './service/MealService';
import { WeeklyMenuModel } from './model/WeeklyMenuModel';
import { WeeklyMenuService } from './service/WeeklyMenuService';
import { UserModel } from './model/UserModel';
import { UserService } from './service/UserService';
import { ApplicationInit } from './ApplicationInit';
import { RouterConfig } from './config/RouterConfig';
import { AbstractStateComponent, StateConfig } from './config/StateConfig';
import { UIRouterModule, UIView } from '@uirouter/angular';
import { HomeComponent } from './component/view/main/home/HomeComponent';
import { MainLayoutComponent } from './component/view/main/MainLayoutComponent';
import { PreliminaryLayoutComponent } from './component/view/preliminary/PreliminaryLayoutComponent';
import { ErrorNotFoundComponent } from './component/view/preliminary/error/ErrorNotFoundComponent';
import { ANIMATION_TYPES, LoadingModule } from 'ngx-loading';
import { ToastrModule } from 'ngx-toastr';
import { ApplicationModel } from './model/ApplicationModel';
import { StateUtil } from './util/StateUtil';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WeeklyMenusComponent } from './component/view/main/weeklyMenus/WeeklyMenusComponent';
import { MealsComponent } from './component/view/main/meals/MealsComponent';
import { WeeklyMenuEditPopupComponent } from './component/view/main/weeklyMenus/popup/WeeklyMenuEditPopupComponent';
import { NgBootstrapDateAdapter } from './util/NgBootstrapDateAdapter';
import { WeeklyMenuCreatePopupComponent } from './component/view/main/weeklyMenus/popup/WeeklyMenuCreatePopupComponent';

@NgModule({
  declarations: [
    MainLayoutComponent, PreliminaryLayoutComponent, AbstractStateComponent,
    ErrorNotFoundComponent,
    HomeComponent, WeeklyMenusComponent, MealsComponent,
    WeeklyMenuCreatePopupComponent, WeeklyMenuEditPopupComponent
  ],
  entryComponents: [
    WeeklyMenuCreatePopupComponent, WeeklyMenuEditPopupComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    CustomFormsModule,
    HttpClientModule,
    UIRouterModule.forRoot({ config: RouterConfig, states: StateConfig, useHash: false }),
    EventsServiceModule.forRoot(),
    AsyncLocalStorageModule,
    NgPipesModule,
    LoadingModule.forRoot({
      animationType: ANIMATION_TYPES.threeBounce,
      fullScreenBackdrop: true,
      backdropBackgroundColour: 'rgba(0,0,0,0.5)',
      primaryColour: '#8C9CBB',
      secondaryColour: '#697996',
      tertiaryColour: '#5E548E'
    }),
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-center',
      preventDuplicates: true,
      extendedTimeOut: 2500,
      enableHtml: true
    }),
    NgbModule.forRoot()
  ],
  providers: [
    ApplicationInit,
    StateUtil,
    FirebaseManager, FirestoreManager,
    ApplicationModel,
    IngredientModel, IngredientService,
    MealModel, MealService,
    WeeklyMenuModel, WeeklyMenuService,
    UserModel, UserService,
    {
      provide: NgbDateAdapter,
      useClass: NgBootstrapDateAdapter
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (
        firebaseManager: FirebaseManager,
        applicationModel: ApplicationModel,
        ingredientModel: IngredientModel,
        mealModel: MealModel,
        weeklyMenuModel: WeeklyMenuModel,
        userModel: UserModel,
        appInit: ApplicationInit
      ) => () => {},
      deps: [
        FirebaseManager,
        ApplicationModel,
        IngredientModel,
        MealModel,
        WeeklyMenuModel,
        UserModel,
        ApplicationInit
      ]
    }
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [ UIView ]
})
export class ApplicationModule { }
