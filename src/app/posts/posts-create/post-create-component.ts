
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { PostService } from "../post.service";
import { Post } from "../post.model";
import { mimeType } from "./mime-type.validator";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create-component.html',
  styleUrls: ['./post-create-component.css']
})
export class PostCreateComponent implements OnInit {
  isLoading = false;
  form!: FormGroup;
  imagePreview: string | ArrayBuffer = ''; // Initialize as empty string or ArrayBuffer

  private mode = 'create';
  private postId: string | null = null;

  constructor(
    public postService: PostService,
    public route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      'title': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'content': new FormControl(null, {
        validators: [Validators.required]
      }),
      'image': new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;

        if (this.postId) {
          this.postService.getPost(this.postId).subscribe(postData => {
            this.isLoading = false;
            this.form.setValue({
              'title': postData.title,
              'content': postData.content,
              'image': postData.imagePath // Assuming imagePath is the correct property
            });
            this.imagePreview = postData.imagePath; // Display image preview if available
          });
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
      this.form.patchValue({ 'image': file }); // Update the 'image' form control value
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
    this.isLoading = true;
  
    const title = this.form.value.title;
    const content = this.form.value.content;
    const image = this.form.value.image;
  
    if (this.mode === 'create') {
      this.postService.addPost(title, content, image);
    } else if (this.mode === 'edit' && this.postId !== null) { // Add a check for this.postId
      this.postService.updatePost(this.postId, title, content, image);
    }
  
    this.form.reset();
  }
}  