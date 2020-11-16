import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../_services/UserService';
import { RestService } from '../rest.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/app/_models/user';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '../_alerts/alert/alert.component';

@Component({
    selector: 'app-login',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
}
    )
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    request = {};
    email: string;
    password: string;
    response = {};
    //selected = "admin";
    selected: string;


    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    user: User;


    constructor(public rest: RestService,
        private formBuilder: FormBuilder,
        private router: Router,
        private dialog: MatDialog
    ) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
        // redirect to home if already logged in
        this.user = this.currentUserSubject.value;

        if (this.user === null) {
            this.router.navigate(['login']);
        } else if (this.user.rol != 'admin') {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        if (this.user === null) {
            this.router.navigate(['login']);
        }

        this.registerForm = this.formBuilder.group({
            //firstName: ['', Validators.required],
            //lastName: ['', Validators.required],
            //email: ['', Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")],
            email: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]],
            rol: ['', Validators.required]
        });//*/
    }

    async register() {
        console.log("DATA RECIBIDA EN REGISTER"+this.email+''+this.password);
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
        // redirect to home if already logged in
        this.user = this.currentUserSubject.value;

        const dialogConfig = new MatDialogConfig();
        if (this.email && this.password && this.selected) {
        
            let headers = new HttpHeaders({
                'Content-Type': 'application/json',
                'access-token': this.user.token
            });
            this.request = {
                email: this.email
            }
            
            
            let userDB = await this.getUserByEmail(this.request, headers);

            console.log("userDB: " + JSON.stringify(userDB));
            if (userDB["response"]["user"]) {
                this.showAlertMessage(dialogConfig, "El usuario ya existe")
            }
            else {
                this.response = {};
                this.request = {
                    email: this.email,
                    password: this.password,
                    rol: this.selected
                }
                this.loading = true;
                //console.log("request..." + JSON.stringify(this.request));
                this.rest.addUser(this.request, headers).subscribe((data) => {
                    //console.log("data..." + JSON.stringify(data));
                    let isError = false;
                    if (data.userId !== null) {
                        let message = "Usuario: " + this.email + " fue registrado con exito";

                        dialogConfig.data = {
                            title: 'Register',
                            message: message
                        };


                    }
                    else {
                        let message = "No se pudo registrar el usuario: " + this.email;
                        isError = true;
                        dialogConfig.data = {
                            title: 'Register',
                            message: message
                        };
                    }

                    let dialogRef = this.dialog.open(AlertComponent, dialogConfig);
                    dialogRef.afterClosed().subscribe(result => {
                        if (result == 'confirm') {
                            if (!isError) {
                                this.router.navigate(["/"]);
                            }
                        }
                    })
                });
            }
            //*/

        } else {
            dialogConfig.data = {
                title: 'Register',
                message: "Campos Obligatorios"
            };

            let dialogRef = this.dialog.open(AlertComponent, dialogConfig);
            dialogRef.afterClosed().subscribe(result => {
                if (result == 'confirm') {

                }
            })
        }
    }

    createAuthorizationHeader(headers: Headers) {
        headers.append('access-token', this.user.token);
    }


    async getUserByEmail(request, headers) {
        let it = this;
        return new Promise(async function (resolve, reject) {
            it.rest.getUserByEmail(request, headers).subscribe((data) => {
                console.log("RESPONSE..." + JSON.stringify(data));
                resolve(data);
            });
        });
    }

    showAlertMessage(dialogConfig, message) {
        dialogConfig.data = {
            title: 'Register',
            message: message
        };

        let dialogRef = this.dialog.open(AlertComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
            if (result == 'confirm') {

            }
        })
    }
}