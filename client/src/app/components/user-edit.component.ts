import { Component, OnInit } from '@angular/core';
import { UserService } from "../services/user.service";
import { GLOBAL } from "../services/global";
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
    public filesToUpload: Array<File>;
    public url: String;

    constructor(
        private _userService: UserService
    ) {
        this.titulo = "Actualizar datos usuario."
        // LocalStorage
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.user = this.identity;
        this.url = GLOBAL.url;
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

                if (!this.filesToUpload) {

                } else {
                    this.makeFileRequest(this.url + 'upload-image-user/' + this.user._id, [], this.filesToUpload).then(
                        (result: any) => {
                            this.user.image = result.image;
                            localStorage.setItem('identity', JSON.stringify(this.user));

                            let image_path = this.url + 'get-image-user/' + this.user.image;
                            document.getElementById('image-logged').setAttribute('src', image_path);
                            console.log(this.user)
                        }
                    );
                }
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

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
        console.log(this.filesToUpload);
    }

    makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
        var token = this.token;

        return new Promise(function (resolve, reject) {
            var formData: any = new FormData();
            var xhr = new XMLHttpRequest();

            for (var i = 0; i < files.length; i++) {
                formData.append('image', files[i], files[i].name);
            }

            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            }

            xhr.open('POST', url, true)
            xhr.setRequestHeader('Authorization', token);
            xhr.send(formData);

        });
    }
}
