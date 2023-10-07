import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Post } from "../post.model";
import { PostService } from "../post.service";
import { PageEvent } from "@angular/material/paginator";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list-component.html',
  styleUrls: ['./post-list-component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0; // Initialize with 0
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  private postsSub!: Subscription;
  private authStatusSub: Subscription = new Subscription;

  constructor(public postService: PostService,private authService:AuthService) {}

  ngOnInit() {
    this.postService.getPosts(this.postsPerPage, this.currentPage); // Pass the current page to getPosts
    this.isLoading = true;
    this.postsSub = this.postService.getPostUpdateListener().subscribe((postData: { posts: Post[]; postCount: number }) => {
      this.isLoading = false;
      this.posts = postData.posts;
      this.totalPosts = postData.postCount; // Update the totalPosts count
    });
    this.authService.getAuthStatusListener().subscribe(isAuthenticated =>{
            this.userIsAuthenticated = isAuthenticated;
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage); // Pass the current page to getPosts
  }

  onDelete(postId: string | null | undefined) {
    if (postId) {
      this.postService.deletePost(postId);
    }
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
