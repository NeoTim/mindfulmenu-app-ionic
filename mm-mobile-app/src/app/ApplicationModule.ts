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
import { AngularFireModule } from "angularfire2";
import { AngularFirestoreModule } from "angularfire2/firestore";
import { AngularFireAuthModule } from "angularfire2/auth";

@NgModule({
  declarations: [
    ApplicationComponent,
    AuthLoginComponent,
    MainComponent,
    MenusComponent,
    MoreComponent,
    MyPlanComponent
  ],
  entryComponents: [
    ApplicationComponent,
    AuthLoginComponent,
    MainComponent,
    MenusComponent,
    MoreComponent,
    MyPlanComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(ApplicationComponent, {
    }),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(new ApplicationConfig().ENV.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Network,
    ApplicationConfig,
    AuthModel,
    NetworkModel,
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
                   AuthModel: AuthModel,
                   NetworkModel: NetworkModel
      ) => () => {},
      deps: [
        AuthModel,
        NetworkModel
      ]
    }
  ],
  bootstrap: [IonicApp]
})
export class ApplicationModule {}
