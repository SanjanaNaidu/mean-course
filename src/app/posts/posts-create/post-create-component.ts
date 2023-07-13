import { Component } from "@angular/core";

@Component({
    selector:'app-post-create',
    templateUrl:'./post-create-component.html'
})
export class PostCreateComponent{
    newPost = 'No Content';

    onAddPost(postInput: HTMLTextAreaElement){
        //console.log(postInput);
        this.newPost = postInput.value;
    //alert("Post added!");
   }
}