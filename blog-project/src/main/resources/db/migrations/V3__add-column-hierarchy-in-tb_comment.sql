ALTER TABLE tb_comment
ADD COLUMN parent_comment_id BIGINT;

ALTER TABLE tb_comment
ADD COLUMN deleted Boolean NOT NULL DEFAULT false;

ALTER TABLE tb_comment
ADD CONSTRAINT fk_parent_comment
FOREIGN KEY (parent_comment_id) REFERENCES tb_comment(id);

CREATE INDEX idx_comment_post ON tb_comment(post_id);
CREATE INDEX idx_comment_parent ON tb_comment(parent_comment_id);
CREATE INDEX idx_comment_deleted ON tb_comment(deleted)