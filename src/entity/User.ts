import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany, ManyToMany, JoinTable} from "typeorm";
import * as bcrypt from 'bcrypt';
import {Post} from "./Post";
import {Comment} from "./Comment";
import config from '../config/config';
import {Like} from "./Like";

@Entity()
export class User {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    activated: boolean;

    @Column({default: () => "CURRENT_TIMESTAMP"})
    register_at: Date;

    @OneToMany(type => Post, post => post.user)
    posts: Post[];

    @OneToMany(type => Comment, comment => comment.user)
    comments: Comment[];

    @OneToMany(type => Like, like => like.user)
    likes: Like[];

    @ManyToMany(type => User)
    @JoinTable()
    followers: User[];

    public checkUnencryptedPassword(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }

    @BeforeInsert()
    encryptPassword() {
        try {
            this.password = bcrypt.hashSync(this.password, config.saltRounds);       
        } catch (e) {
            console.log("Error encrypting");
        }
    }
}
