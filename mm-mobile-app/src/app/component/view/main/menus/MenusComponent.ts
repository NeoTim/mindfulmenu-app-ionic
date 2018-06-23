import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { WeeklyMenuModel } from "../../../../model/WeeklyMenuModel";
import { WeeklyMenuDTO } from "../../../../data/dto/menu/WeeklyMenuDTO";
import { UserDTO } from "../../../../data/dto/user/UserDTO";
import { UserModel } from "../../../../model/UserModel";
import * as _ from "lodash";
import { WeeklyMenuComponent } from "./weeklyMenu/WeeklyMenuComponent";
import { FavoritesComponent } from "./favorites/FavoritesComponent";
import { GoogleAnalyticsModel } from "../../../../model/GoogleAnalyticsModel";

@Component({
  selector: 'menus',
  templateUrl: 'MenusComponent.html'
})
export class MenusComponent {

  currentWeeklyMenu: WeeklyMenuDTO;
  previousWeeklyMenus: WeeklyMenuDTO[];
  upcomingWeeklyMenus: WeeklyMenuDTO[];

  currentWeeklyMenuLoaded: boolean = false;
  previousWeeklyMenusLoaded: boolean = false;
  upcomingWeeklyMenusLoaded: boolean = false;

  public currentUser: UserDTO;

  public static readonly WEEK_RANGE: number = 6;

  constructor(public navCtrl: NavController,
              public weeklyMenuModel: WeeklyMenuModel,
              public userModel: UserModel,
              public googleAnalyticsModel: GoogleAnalyticsModel) {

    this.currentUser = userModel.currentUser;
  }

  ionViewDidLoad() {
    this.init();

    this.googleAnalyticsModel.trackView('MENUS');
  }

  init() {
    this.getCurrentWeeklyMenu();
    this.getPreviousWeeklyMenus();

    if (this.currentUser.isAdmin) {
      this.getUpcomingWeeklyMenus();
    }
  }

  getCurrentWeeklyMenu() {
    this.weeklyMenuModel.getCurrentWeeklyMenu()
      .then((weeklyMenu: WeeklyMenuDTO) => {
        this.currentWeeklyMenu = weeklyMenu;

        this.currentWeeklyMenuLoaded = true;
      })
      .catch((error) => {});
  }

  getPreviousWeeklyMenus() {
    let previousWeeklyMenus: WeeklyMenuDTO[] = [];

    for (let i = -1; i > (-1 - MenusComponent.WEEK_RANGE); i--) {
      this.weeklyMenuModel.getWeeklyMenuInRelationToCurrent(i)
        .then((weeklyMenu: WeeklyMenuDTO) => {
          previousWeeklyMenus.push(weeklyMenu);

          if (previousWeeklyMenus.length === MenusComponent.WEEK_RANGE) {
            this.previousWeeklyMenus = _.orderBy(_.compact(previousWeeklyMenus), ['weekNumber'], ['desc']);

            this.previousWeeklyMenusLoaded = true;
          }
        })
        .catch((error) => {});
    }
  }

  getUpcomingWeeklyMenus() {
    let upcomingWeeklyMenus: WeeklyMenuDTO[] = [];

    for (let i = 1; i < (1 + MenusComponent.WEEK_RANGE); i++) {
      this.weeklyMenuModel.getWeeklyMenuInRelationToCurrent(i)
        .then((weeklyMenu: WeeklyMenuDTO) => {
          upcomingWeeklyMenus.push(weeklyMenu);

          if (upcomingWeeklyMenus.length === MenusComponent.WEEK_RANGE) {
            this.upcomingWeeklyMenus = _.orderBy(_.compact(upcomingWeeklyMenus), ['weekNumber'], ['asc']);

            this.upcomingWeeklyMenusLoaded = true;
          }
        })
        .catch((error) => {
        });
    }
  }

  showWeeklyMenu(weeklyMenu: WeeklyMenuDTO) {
    this.navCtrl.push(WeeklyMenuComponent, { weeklyMenuId: weeklyMenu.id },{ animation: 'ios-transition'} )
  }

  showFavoriteList() {
    this.navCtrl.push(FavoritesComponent, {},{ animation: 'ios-transition'} )
  }

}

