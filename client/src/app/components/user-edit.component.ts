import { Component, OnInit } from '@angular/core';
import { UserService } from "../services/user.service";
import { User } from "../models/user";

@Component({
    selector: 'user-edit',
    templateUrl: '../views/user-edit.html',
    providers: [UserService]
})
export class UserEditComponent implements OnInit {
    public titulo: String;
    public user: User;
    public identity;
    public token;
    public responseMessage;

    constructor(
        private _userService: UserService
    ) {
        this.titulo = "Actualizar datos usuario."
        // LocalStorage
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.user = this.identity;
    }

    ngOnInit() {
        console.log('probando componente edit user.');
    }

    onSubmit() {
        this._userService.updateUser(this.user).subscribe(
            response => {
                if (!response.user) {
                    return this.responseMessage = "El usuario no se ha actualizado.";
                }

                //this.user = response.user;
                localStorage.setItem('identity', JSON.stringify(this.user));

                document.getElementById('identity_name').innerHTML = this.user.name;
                this.responseMessage = "Usuario actualizado correctamente.";
            },
            error => {
                this.responseMessage = <any>error;

                if (this.responseMessage != null) {
                    var body = JSON.parse(error._body);
                    this.responseMessage = body.message;

                    console.log(error);
                }
            }
        );
    }
}
