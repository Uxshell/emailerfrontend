import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormGroupDirective, AbstractControl } from '@angular/forms';
import { OldPwdValidators } from './old-pwd.validators';

import { UserService } from '../../../_services/UserService';
import { RestService } from '../../../rest.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/_models/user';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';

import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '../../../_alerts/alert/alert.component';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  user: User;
  request = {};
  loading = false;
  password: string;
  userId: string;
  response = {};
  dialogConfig = new MatDialogConfig();

  form: FormGroup;

  constructor(private dialog: MatDialog, public rest: RestService,
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    fb: FormBuilder) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    // redirect to home if already logged in
    this.user = this.currentUserSubject.value;

    if (this.user === null) {
      this.router.navigate(['login']);
    } else if (this.user.rol != 'admin') {
      this.router.navigate(['/']);
    }


    this.form = fb.group({
      //'oldPwd': ['', Validators.required],
      'newPwd': ['', Validators.required],
      'confirmPwd': ['', Validators.required]
    }, {
      validator: OldPwdValidators.matchPwds
    });
  }

  ngOnInit(): void {

  }
  /*
  get oldPwd() {
    return this.form.get('oldPwd');
  }
  //*/

  get newPwd() {
    return this.form.get('newPwd');
  }

  get confirmPwd() {
    return this.form.get('confirmPwd');
  }

  changePassword() {
    let newPassword = this.form.get('newPwd').value;
    let confirmPassword = this.form.get('confirmPwd').value;
    this.userId = this.user.userId;

    if (newPassword === confirmPassword) {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'access-token': this.user.token
      });

      this.response = {};
      this.request = {
        password: newPassword,
        userId: this.userId
      };

      this.loading = true;
      console.log("change password...");

      this.rest.changePassword(this.request).subscribe((data) => {
        console.log("data:" + JSON.stringify(data));
        if (data.success) {
          this.showAlert("Contraseña modificada exitosamente");

        } else {
          this.showAlert("No se puedo modificar la contraseña");

        }
      });
    }
    else {
      console.log("error, no son iguales");
      this.showAlert("Las contraseñas no coinciden");
    }
  }


  showAlert(message) {

    this.dialogConfig.data = {
      title: 'Register',
      message: message
    };
    let dialogRef = this.dialog.open(AlertComponent, this.dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      // NOTE: The result can also be nothing if the user presses the `esc` key or clicks outside the dialog
      if (result == 'confirm') {
        this.form.reset();
        this.form.touched;
        ///this.form.get('newPwd').setValue('');
        //this.form.get('confirmPwd').setValue('');
        this.resetForm(this.form);
      }
    })
  }

  resetForm(formGroup: FormGroup) {
    let control: AbstractControl = null;
    formGroup.reset();
    formGroup.markAsUntouched();
    Object.keys(formGroup.controls).forEach((name) => {
      control = formGroup.controls[name];
      control.setErrors(null);
    });
  }

  isValidForm() {
    let newPassword = this.form.get('newPwd').value;
    let confirmPassword = this.form.get('confirmPwd').value;
    if (newPassword !== '' && confirmPassword !== '') {
      return true;
    }
    return false;
  }
}