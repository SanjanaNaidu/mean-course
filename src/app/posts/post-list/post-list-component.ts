import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Post } from "../post.model";
import { PostService } from "../post.service";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list-component.html',
  styleUrls: ['./post-list-component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  private postsSub!: Subscription;

  constructor(public postService: PostService) {}

  ngOnInit() {
    this.postService.getPosts();
    this.isLoading = true;
    this.postsSub = this.postService.getPostUpdateListener().subscribe((posts: Post[]) => {
      this.isLoading = false;
      this.posts = posts;
    });
  }

  onDelete(postId: string | null | undefined) {
    console.log('onDelete called with postId:', postId);
    if (postId) {
      console.log('Calling deletePost with postId:', postId);
      this.postService.deletePost(postId);
    }
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }
}
