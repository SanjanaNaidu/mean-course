import {Component,OnDestroy,OnInit} from "@angular/core";
import { Subscription } from "rxjs";
import {Post} from "../post.model";
import { PostService } from "../post.service";
@Component({
    selector: 'app-post-list',
    templateUrl: './post-list-component.html',
    styleUrls:['./post-list-component.css']

})
export class PostListComponent implements OnInit, OnDestroy{
    posts:Post[] =[];
    private postsSub!: Subscription;
   //postService: PostService;
   constructor(public postService:PostService){
    //this.postService=postService;
   }
    ngOnInit(){
        //throw new Error("Method not implemented.");
        this.posts = this.postService.getPosts();
        this.postsSub=this.postService.getPostUpdateListener().subscribe((posts:Post[]) =>{
             this.posts=posts;
        });
    }
    ngOnDestroy(): void {
        this.postsSub.unsubscribe();
    }
}