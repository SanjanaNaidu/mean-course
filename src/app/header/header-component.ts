import {Component, OnDestroy, OnInit} from "@angular/core";
import {AuthService} from "../auth/auth.service";
import { Subscription } from "rxjs";
@Component({
    selector:'app-Header',
    templateUrl:'./header-component.html',
    styleUrls:['./header-component.css']

})

export class HeaderComponent implements OnInit,OnDestroy{
    userIsAuthenticated = false;
    private authListenerSubs: Subscription = new Subscription;
    constructor(private authService:AuthService){}
    ngOnInit(){
      this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated =>{
        
      });
    }

    onLogout(){
      this.authService.logout();
    }
    ngOnDestroy(){

    }
}