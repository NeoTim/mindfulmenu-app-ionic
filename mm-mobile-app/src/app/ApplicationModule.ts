import { NgModule, ErrorHandler, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ApplicationComponent } from "./component/ApplicationComponent";
import { PlatformUtil } from "./util/PlatformUtil";
import { AuthModel } from "./model/AuthModel";
import { Network } from "@ionic-native/network";
import { NetworkModel } from "./model/NetworkModel";
import { ViewUtil } from "./util/ViewUtil";
import { MainComponent } from "./component/view/main/MainComponent";
import { IonicStorageModule } from "@ionic/storage";
import { AuthLoginComponent } from "./component/view/auth/login/AuthLoginComponent";
import { ApplicationConfig } from "./config/ApplicationConfig";
import { MenusComponent } from "./component/view/main/menus/MenusComponent";
import { MoreComponent } from "./component/view/main/more/MoreComponent";
import { MyPlanComponent } from "./component/view/main/myPlan/MyPlanComponent";
import { FirebaseManager } from "./util/FirebaseManager";
import { WeeklyMenuModel } from "./model/WeeklyMenuModel";
import { WeeklyMenuService } from "./service/WeeklyMenuService";
import { MealService } from "./service/MealService";
import { MealModel } from "./model/MealModel";
import { IngredientModel } from "./model/IngredientModel";
import { IngredientService } from "./service/IngredientService";
import { AuthService } from "./service/AuthService";
import { AuthOfflineComponent } from "./component/view/auth/offline/AuthOfflineComponent";
import { UserModel } from "./model/UserModel";
import { UserService } from "./service/UserService";
import { FirestoreManager } from "./util/FirestoreManager";
import { CustomFormsModule } from "ng4-validators";
import { FormsModule } from "@angular/forms";
import { InternalUrlBrowserComponent } from "./component/ui/internalUrlBrowser/InternalUrlBrowserComponent";
import { AboutComponent } from "./component/view/main/more/about/AboutComponent";
import { AccountComponent } from "./component/view/main/more/account/AccountComponent";
import { AccountChangePasswordComponent } from "./component/view/main/more/account/AccountChangePasswordComponent";
import { SanitizeStylePipe } from "./util/pipe/SanitizeStylePipe";
import { WeeklyMenuComponent } from "./component/view/main/menus/weeklyMenu/WeeklyMenuComponent";
import { WeeklyPlanModel } from "./model/WeeklyPlanModel";
import { WeeklyPlanService } from "./service/WeeklyPlanService";

@NgModule({
  declarations: [
    // main entry point
    ApplicationComponent,
    // component/view
    AuthLoginComponent,
    AuthOfflineComponent,
    MainComponent,
    MenusComponent, WeeklyMenuComponent,
    MoreComponent, AboutComponent, AccountComponent, AccountChangePasswordComponent,
    MyPlanComponent,
    // component/ui
    InternalUrlBrowserComponent,
    // util/pipe
    SanitizeStylePipe
  ],
  entryComponents: [
    // main entry point
    ApplicationComponent,
    // component/view
    AuthLoginComponent,
    AuthOfflineComponent,
    MainComponent,
    MenusComponent, WeeklyMenuComponent,
    MoreComponent, AboutComponent, AccountComponent, AccountChangePasswordComponent,
    MyPlanComponent,
    // component/ui
    InternalUrlBrowserComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CustomFormsModule,
    IonicModule.forRoot(ApplicationComponent, {
      mode: 'md',
      tabsHideOnSubPages: false,
      backButtonText: '',
      backButtonIcon: 'custom-arrow-back',
      pageTransition: 'md-transition'
    }),
    IonicStorageModule.forRoot(),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Network,
    ApplicationConfig,
    FirebaseManager, FirestoreManager,
    NetworkModel,
    AuthModel, AuthService,
    IngredientModel, IngredientService,
    MealModel, MealService,
    WeeklyMenuModel, WeeklyMenuService,
    WeeklyPlanModel, WeeklyPlanService,
    UserModel, UserService,
    PlatformUtil,
    ViewUtil,
    {
      provide: ErrorHandler,
      useClass: IonicErrorHandler
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (
                   FirebaseManager: FirebaseManager,
                   AuthModel: AuthModel,
                   NetworkModel: NetworkModel,
                   IngredientModel: IngredientModel,
                   MealModel: MealModel,
                   WeeklyMenuModel: WeeklyMenuModel,
                   WeeklyPlanModel: WeeklyPlanModel,
                   UserModel: UserModel
      ) => () => {},
      deps: [
        FirebaseManager,
        AuthModel,
        NetworkModel,
        IngredientModel,
        MealModel,
        WeeklyMenuModel,
        WeeklyPlanModel,
        UserModel
      ]
    }
  ],
  bootstrap: [IonicApp]
})
export class ApplicationModule {}
