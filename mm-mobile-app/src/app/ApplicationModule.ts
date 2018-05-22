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
import { PrepListComponent } from "./component/view/main/myPlan/prepList/PrepListComponent";
import { FavoritesComponent } from "./component/view/main/menus/favorites/FavoritesComponent";
import { ShoppingListComponent } from "./component/view/main/myPlan/shoppingList/ShoppingListComponent";
import { ApplicationModel } from "./model/ApplicationModel";
import { MealComponent } from "./component/view/main/meal/MealComponent";
import { Nl2BrPipe } from "./util/pipe/Nl2BrPipe";
import { SanitizeHtmlPipe } from "./util/pipe/SanitizeHtmlPipe";
import { Keyboard } from "@ionic-native/keyboard";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { AuthPurgatoryComponent } from "./component/view/auth/purgatory/AuthPurgatoryComponent";
import { AuthSignupComponent } from "./component/view/auth/signup/AuthSignupComponent";

@NgModule({
  declarations: [
    // main entry point
    ApplicationComponent,
    // component/view
    AuthLoginComponent,
    AuthSignupComponent,
    AuthOfflineComponent,
    AuthPurgatoryComponent,
    MainComponent,
    MenusComponent, WeeklyMenuComponent, FavoritesComponent,
    MealComponent,
    MyPlanComponent, PrepListComponent, ShoppingListComponent,
    MoreComponent, AboutComponent, AccountComponent, AccountChangePasswordComponent,
    // component/ui
    InternalUrlBrowserComponent,
    // util/pipe
    Nl2BrPipe, SanitizeHtmlPipe, SanitizeStylePipe
  ],
  entryComponents: [
    // main entry point
    ApplicationComponent,
    // component/view
    AuthLoginComponent,
    AuthSignupComponent,
    AuthOfflineComponent,
    AuthPurgatoryComponent,
    MainComponent,
    MenusComponent, WeeklyMenuComponent, FavoritesComponent,
    MealComponent,
    MyPlanComponent, PrepListComponent, ShoppingListComponent,
    MoreComponent, AboutComponent, AccountComponent, AccountChangePasswordComponent,
    // component/ui
    InternalUrlBrowserComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CustomFormsModule,
    IonicModule.forRoot(ApplicationComponent, {
      mode: 'md',   /* remove this if you want native per-os experience */
      iconMode: 'md',
      tabsHideOnSubPages: false,
      tabsHighlight: true,
      backButtonText: '',
      backButtonIcon: 'custom-arrow-back',
      pageTransition: 'md-transition'
    }),
    IonicStorageModule.forRoot(),
  ],
  providers: [
    Keyboard,
    StatusBar,
    SplashScreen,
    Network,
    InAppBrowser,
    ApplicationConfig,
    FirebaseManager, FirestoreManager,
    ApplicationModel,
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
                   ApplicationModel: ApplicationModel,
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
        ApplicationModel,
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
