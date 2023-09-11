import { HttpClient } from '@angular/common/http';
import {Post} from './post.model';
import {Injectable} from '@angular/core';

import {Subject} from 'rxjs';
import { Router } from '@angular/router';
@Injectable({providedIn : 'root'})
export class PostService{
    private posts: Post[] =[];
    private postsUpdated = new Subject<Post[]>();
    

    constructor(private http: HttpClient,private router: Router){}

    
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
    getPost(id:string){
      
      return this.http.get<{_id:string,title:string,content:string}>("http://localhost:3000/api/posts"+id);
      
    }
    addPost(title: string, content: string,image:File){
        const postData = new FormData();
        postData.append("title",title);
        postData.append("content",content);
        postData.append("image",image,title);
        this.http
    .post<{
      [x: string]: any; message: string; postId: string 
}>('http://localhost:3000/api/posts', postData)
    .subscribe((responseData) => {
      const post: Post = {
        id:responseData['post'].id,
        title:title,
        content:content,
        imagePath:responseData['post'].imagePath
      };
      post.id = responseData.postId as string; // Type assertion here
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(["/"]);
    });
        
    }
   updatePost(id:string,title:string,content:string){
    const post: Post={id:id,title:title,content:content,imagePath:null};
    this.http.put("http://localhost:3000/api/posts"+id,post )
      .subscribe(response=>{
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p=>p.id === post.id);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);

      });
   }
   deletePost(postId: any) {
    console.log('postId:', postId);
  
    if (postId) {
      const url = 'http://localhost:3000/api/posts/' + postId;
      this.http.delete(url).subscribe(
        () => {
          const updatedPosts = this.posts.filter(post => post.id !== postId);
          this.posts = updatedPosts;
          this.postsUpdated.next([...this.posts]);
          console.log('Deleted successfully!');
        },
        (error) => {
          console.error('Error deleting post:', error);
          // Handle the error, e.g., show an error message
        }
      );
    }
  }
}  