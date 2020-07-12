import {Entity, Column, ManyToOne, PrimaryGeneratedColumn, OneToMany} from "typeorm";
import {Post} from "./Post";
import {User} from "./User";
import {Like} from "./Like";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    body: string;

    @Column({default: () => "CURRENT_TIMESTAMP"})
    created_at: Date;

    @ManyToOne(type => Post, post => post.comments, {onDelete: "CASCADE"})
    post: Post;

    @ManyToOne(type => User, user => user.comments, {onDelete: "CASCADE"})
    user: User;

    @OneToMany(type => Like, like => like.comment)
    likes: Like[];
}
