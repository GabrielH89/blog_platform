create table tb_rating(
	id bigInt not null auto_increment primary key,
	rating_value TINYINT not null CHECK (rating_value BETWEEN 1 AND 5),
	user_id bigint not null,
    post_id bigint not null,
    constraint fk_rating_user foreign key (user_id) references tb_user(id),
    constraint fk_rating_post foreign key (post_id) references tb_post(id),
    constraint uc_user_post UNIQUE (user_id, post_id)
);