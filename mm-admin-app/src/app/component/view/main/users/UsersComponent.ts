import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UserModel } from '../../../../model/UserModel';
import * as _ from 'lodash';
import { UserCreatePopupComponent } from './popup/UserCreatePopupComponent';
import { UserEditPopupComponent } from './popup/UserEditPopupComponent';
import { UserDTO } from '../../../../data/dto/user/UserDTO';

@Component({
  selector: 'users',
  templateUrl: 'UsersComponent.html',
  styleUrls: ['UsersComponent.scss']
})
export class UsersComponent implements OnInit {

  users: UserDTO[];

  public email: string;

  constructor(public toastrService: ToastrService,
              public userModel: UserModel,
              public modalService: NgbModal) {
  }

  ngOnInit() {
      this.getUsers();
  }

  getUsers() {
    if (_.isEmpty(this.email)) {
      this.userModel.getAllUsers()
        .then((users: UserDTO[]) => {
          this.users = users;
        })
        .catch((error) => {});
    }
    else {
      this.userModel.getUsersByEmail(this.email)
        .then((users: UserDTO[]) => {
          this.users = users;
        })
        .catch((error) => {});
    }
  }

  addUser() {
    const modalRef = this.modalService.open(UserCreatePopupComponent, { size: 'lg', centered: true });

    modalRef.result
      .then((closeResult: any) => {
        if (closeResult instanceof UserDTO) {
          this.getUsers();
        }
      })
      .catch((dismissReason: any) => {

      });
  }

  editUser(user: UserDTO) {
    const modalRef = this.modalService.open(UserEditPopupComponent, { size: 'lg', centered: true });
    modalRef.componentInstance.user = user;

    modalRef.result
      .then((closeResult: any) => {
        if (closeResult instanceof UserDTO) {
          this.getUsers();
        }
      })
      .catch((dismissReason: any) => {});
  }

  enableAutomaticUpdateForUser(user: UserDTO) {
    this.userModel.enableAutomaticUpdateForUser(user.id)
      .then(() => {
        this.toastrService.success('Automatic updates for user enabled!', 'Success');
        this.getUsers();
      })
      .catch((error) => {});
  }

}
