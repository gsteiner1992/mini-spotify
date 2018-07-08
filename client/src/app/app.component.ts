import { Component, OnInit } from '@angular/core';
import { User } from "./models/user";
import { UserService } from "./services/user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})
export class AppComponent implements OnInit {
  public title = 'MUSIFY';
  public user: User;
  public identity;
  public token;
  public errorMessage;

  constructor(
    private _userService : UserService
  ){
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');
  }

  ngOnInit() {
    // var text = this._userService.signup();
    // console.log(text);
  }
  onSubmit() {
    console.log(this.user);

    this._userService.signup(this.user).subscribe(
      response => {
        let identity = response.user;
        this.identity = identity;

        if (!this.identity._id){
          alert("El usuario no esta correctamente identificado.")
        } else {
          this._userService.signup(this.user, "true").subscribe(
            response => {
              let token = response.token;
              this.token = token;
      
              if (this.token.length <= 0){
                alert("El token no se ha generado.")
              } else {
                console.log(token);
                console.log(identity);
              }
      
              console.log(response);
            },
            error => {
              this.errorMessage = <any>error;
      
              if (this.errorMessage != null){
                var body = JSON.parse(error._body);
                this.errorMessage = body.message;
      
                console.log(error);
              }
            }
          );
        }

        console.log(response);
      },
      error => {
        this.errorMessage = <any>error;

        if (this.errorMessage != null){
          var body = JSON.parse(error._body);
          this.errorMessage = body.message;

          console.log(error);
        }
      }
    );
  }
}
