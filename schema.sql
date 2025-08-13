PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    , category TEXT);
INSERT INTO posts VALUES(1,'홀리 싙','성공인가?','2025-08-08 07:31:31',NULL);
INSERT INTO posts VALUES(2,'길기스는 갓겜이다','이거 ㄹㅇ이다','2025-08-08 07:59:25','Game');
INSERT INTO posts VALUES(3,'길기스는 갓겜이다','이거 진짜다...','2025-08-08 08:00:01','Game');
INSERT INTO posts VALUES(4,'ㄴㄴㄴ','ㄴㄴㄴ','2025-08-08 08:02:32','Game');
INSERT INTO posts VALUES(5,'ㅌㅇㅇㄹㅇ','ㄴㅇㄴㅇ','2025-08-08 08:02:49','Game');
INSERT INTO posts VALUES(6,'ㄴㄴ','ㄴㄴ','2025-08-08 08:10:28','Politics');
CREATE TABLE comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      postId INTEGER NOT NULL,
      content TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, parentId INTEGER,
      FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE
    );
INSERT INTO comments VALUES(1,1,'ㅋㅋㅋ','2025-08-08 07:31:50',NULL);
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('posts',6);
INSERT INTO sqlite_sequence VALUES('comments',1);
COMMIT;
