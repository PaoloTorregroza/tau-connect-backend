import {Entity, PrimaryGeneratedColumn, ManyToOne} from "typeorm";
import {User} from "./User";
import {Post} from "./Post";
import {Comment} from "./Comment";

@Entity()
export class Like {
    
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(type => User, user => user.likes, {onDelete: "CASCADE"})
    user: User;

    @ManyToOne(type => Post, post => post.likes, {onDelete: "CASCADE"})
    post: Post;

    @ManyToOne(type => Comment, comment => comment.likes, {onDelete: "CASCADE"})
    comment: Comment;
}
