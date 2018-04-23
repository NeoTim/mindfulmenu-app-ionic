import { Component } from '@angular/core';
import { MenusComponent } from "./menus/MenusComponent";
import { MyPlanComponent } from "./myPlan/MyPlanComponent";
import { MoreComponent } from "./more/MoreComponent";

@Component({
  selector: 'main',
  templateUrl: 'MainComponent.html'
})
export class MainComponent {

  tab1Root = MenusComponent;
  tab2Root = MyPlanComponent;
  tab3Root = MoreComponent;

  constructor() {
  }

  ionViewDidLoad() {
    this.init();
  }

  init() {
  }
}
