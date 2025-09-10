create table tb_user(
	id bigInt not null auto_increment primary key,
	username varchar(200) not null,
	login varchar(600) not null unique,
	password varchar(300) not null,
	role varchar(50) not null,
	imageUser varchar(400) 
);

create table tb_post(
	id bigInt not null auto_increment primary key,
	title_post varchar(150) not null,
	bodyPost text not null,
	imagePost varchar(400),
	createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    user_id bigint not null,
    constraint fk_comment_user foreign key (user_id) references tb_user(id),
);

create table tb_comment(
	id bigInt not null auto_increment primary key,
	comment_body text not null,
	createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    user_id bigint not null,
    post_id bigint not null,
    constraint fk_comment_user foreign key (user_id) references tb_user(id),
    constraint fk_comment_post foreign key (post_id) references tb_post(id)
);






