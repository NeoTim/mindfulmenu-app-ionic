import { Injectable } from "@angular/core";
import { Events } from "ionic-angular";
import { Event } from '../common/Event';
import { Token } from "../data/local/auth/Token";

@Injectable()
export class AuthModel {

  constructor(private events: Events) {
  }

  public login(username: string, password: string): Promise<Token> {
    return new Promise((resolve, reject) => {
        this.events.publish(Event.AUTH.LOGIN.SUCCESS);
        resolve(new Token());
    });
  }

  public logout(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.events.publish(Event.AUTH.LOGOUT.SUCCESS);
      resolve(true);
    })
  }

}
