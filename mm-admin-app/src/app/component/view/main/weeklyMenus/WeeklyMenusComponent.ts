import { Component, OnInit } from '@angular/core';
import { WeeklyMenuDTO } from '../../../../data/dto/menu/WeeklyMenuDTO';
import { WeeklyMenuModel } from '../../../../model/WeeklyMenuModel';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WeeklyMenuEditPopupComponent } from './popup/WeeklyMenuEditPopupComponent';
import { WeeklyMenuCreatePopupComponent } from './popup/WeeklyMenuCreatePopupComponent';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'weekly-menus',
  templateUrl: 'WeeklyMenusComponent.html',
  styleUrls: ['WeeklyMenusComponent.css']
})
export class WeeklyMenusComponent implements OnInit {

  weeklyMenus: WeeklyMenuDTO[];

  constructor(public toastrService: ToastrService,
              public weeklyMenuModel: WeeklyMenuModel,
              public modalService: NgbModal) {
  }

  ngOnInit() {
      this.getAllWeeklyMenus();
  }

  getAllWeeklyMenus() {
    this.weeklyMenuModel.getAllWeeklyMenus()
      .then((weeklyMenus: WeeklyMenuDTO[]) => {
        this.weeklyMenus = weeklyMenus;
      })
      .catch((error) => {});
  }

  addWeeklyMenu() {
    const modalRef = this.modalService.open(WeeklyMenuCreatePopupComponent, { size: 'lg', centered: true });

    modalRef.result
      .then((closeResult: any) => {
        if (closeResult instanceof WeeklyMenuDTO) {
          this.getAllWeeklyMenus();
        }
      })
      .catch((dismissReason: any) => {

      });
  }

  editWeeklyMenu(weeklyMenu: WeeklyMenuDTO) {
    const modalRef = this.modalService.open(WeeklyMenuEditPopupComponent, { size: 'lg', centered: true });
    modalRef.componentInstance.weeklyMenu = weeklyMenu;

    modalRef.result
      .then((closeResult: any) => {
        if (closeResult instanceof WeeklyMenuDTO) {
          this.getAllWeeklyMenus();
        }
      })
      .catch((dismissReason: any) => {

      });
  }

  deleteWeeklyMenu(weeklyMenu: WeeklyMenuDTO) {
    this.weeklyMenuModel.deleteWeeklyMenu(weeklyMenu.id)
      .then(() => {
        this.toastrService.success('Weekly menu removed!', 'Success');
        this.getAllWeeklyMenus();
      })
      .catch((error) => {});
  }

}
