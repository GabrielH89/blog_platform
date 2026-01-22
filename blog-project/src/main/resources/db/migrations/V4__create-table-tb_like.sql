CREATE TABLE tb_like (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    target_id BIGINT NOT NULL,
    target_type VARCHAR(20) NOT NULL,
    created_at DATETIME NOT NULL,

    CONSTRAINT fk_like_user
	FOREIGN KEY (user_id)
	REFERENCES tb_user(id) 
	ON DELETE CASCADE,

    CONSTRAINT uq_like_user_target
	UNIQUE (user_id, target_id, target_type)
);
