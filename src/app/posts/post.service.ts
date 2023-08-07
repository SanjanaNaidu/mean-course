import { HttpClient } from '@angular/common/http';
import {Post} from './post.model';
import {Injectable} from '@angular/core';

import {Subject} from 'rxjs';
@Injectable({providedIn : 'root'})
export class PostService{
    private posts: Post[] =[];
    private postsUpdated = new Subject<Post[]>();
    

    constructor(private http: HttpClient){}

    
    getPosts(){
        this.http.get<{message: String,posts:Post[]}>("http://127.0.0.1:3000/api/posts")
        .subscribe((postData) =>{
           this.posts=postData.posts;
           this.postsUpdated.next([...this.posts]);
        });
    }
    getPostUpdateListener(){
        return this.postsUpdated.asObservable();
    }
    addPost(title: string, content: string){
        const post: Post = { id: undefined, title: title, content: content};
        this.http
        .post<{message:string}>("http://127.0.0.1:3000/api/posts",post)
        .subscribe((responseData)=>{
            console.log(responseData.message);
            this.posts.push(post);

        this.postsUpdated.next([...this.posts]);
        });
        
    }

}