import {PrimaryGeneratedColumn, Column, Entity, ManyToOne, OneToMany} from "typeorm";
import {User} from "./User";
import {Comment} from "./Comment";
import {Like} from "./Like";

@Entity()
export class Post {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    body: string;

    @Column({default: () => "CURRENT_TIMESTAMP"})
    created_at: Date;

    @ManyToOne(type => User, user => user.posts)
    user: User;

    @OneToMany(type => Comment, comment => comment.post)
    comments: Comment[];
    
    @OneToMany(type => Like, like => like.post)
    likes: Like[];
}
