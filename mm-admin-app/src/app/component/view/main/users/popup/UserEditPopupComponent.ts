import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import * as _ from 'lodash';
import { UserDTO } from '../../../../../data/dto/user/UserDTO';
import { UserModel } from '../../../../../model/UserModel';

@Component({
  selector: 'user-edit-popup',
  templateUrl: 'UserEditPopupComponent.html',
  styleUrls: ['UserEditPopupComponent.scss']
})
export class UserEditPopupComponent implements OnInit {

  user: UserDTO;

  @ViewChild('userForm')
  private userForm: NgForm;

  constructor(public activeModal: NgbActiveModal,
              public userModel: UserModel) {

  }

  ngOnInit() {
    this.user = _.cloneDeep(this.user);
  }

  close() {
    this.activeModal.close();
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  save() {
    this.userForm.onSubmit(null);

    if (this.userForm.form.valid) {

      this.userModel.updateUser(this.user)
        .then((updatedUser: UserDTO) => {
          this.activeModal.close(updatedUser);
        })
        .catch((error) => {
          //
        });
    }
  }

}
