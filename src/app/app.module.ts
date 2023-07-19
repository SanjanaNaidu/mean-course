import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {PostCreateComponent} from './posts/posts-create/post-create-component';
import {FormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar'
import { HeaderComponent } from './header/header-component';
import { PostListComponent } from './posts/post-list/post-list-component';
import {MatExpansionModule} from   '@angular/material/expansion';
import { PostService } from './posts/post.service';
//import { MatAccordionModule } from '@angular/material/accordion';

@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent, HeaderComponent,PostListComponent],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    
  ],
  providers: [PostService],
  bootstrap: [AppComponent]
})
export class AppModule { }
