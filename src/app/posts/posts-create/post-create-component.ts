
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { PostService } from "../post.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post.model"; // Make sure to import the Post model
import {mimeType} from "./mime-type.validator";
@Component({
    selector: 'app-post-create',
    templateUrl: './post-create-component.html',
    styleUrls: ['./post-create-component.css']
})
export class PostCreateComponent implements OnInit {
[x: string]: any;
    enteredTitle = "";
    enteredContent = "";
    isLoading = false;
    form!: FormGroup;
    imagePreview="string";
    private mode = 'create';
    private postId: string | null = null;
    post!: Post; // Define the post property with the Post type

    constructor(public postService: PostService, public route: ActivatedRoute) {}

    ngOnInit() {
        this.form= new FormGroup({
            'title': new FormControl(null,{validators:[Validators.required,Validators.minLength(3)]
            }),
            'content':new FormControl(null,{validators:[Validators.required]}),
            image:new FormControl(null,{
                validators:[Validators.required],
             asyncValidators:[mimeType]})
        });
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has('postId')) {
                this.mode = 'edit';
                this.postId = paramMap.get('postId');
                this.isLoading = true;
                console.log('postId:',this.postId);
                if (this.postId) {
                    this.postService.getPost(this.postId).subscribe(postData => {
                        // Initialize the post property with the fetched data
                        this.isLoading = false;
                        this.post = { id: postData._id, title: postData.title, content: postData.content };
                        this.form.setValue({'title':this.post.title,
                    content:this.post.content});
                    });

                } else {
                    // Handle the case where postId is null
                }
            } else {
                this.mode = 'create';
                this.postId = null;
            }
        });
    }
    onImagePicked(event: Event) {
        const fileInput = event.target as HTMLInputElement;
        const file = fileInput.files?.[0];
      
        if (file) {
          this.form.patchValue({ image: file }); // Update the 'image' form control value
          this.form.get('image')?.updateValueAndValidity();
      
          const reader = new FileReader();
          reader.onload = () => {
            this.imagePreview = reader.result as string;
          };
          reader.readAsDataURL(file);
        }
      }
      
    onSavePost() {
        if (this.form.invalid) {
            return;
        }
        this.isLoading=true;
        const title = this.form.value.title || "";
        const content = this.form.value.content || "";
        
    
        if (this.mode === "create") {
            this.postService.addPost(title, content);
        } else if (this.mode === "edit" && this.postId) {
            this.postService.updatePost(this.postId, title, content);
        }
    
        this.form.reset();
    }
    
}

