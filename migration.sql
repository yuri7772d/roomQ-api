-- สร้างฐานข้อมูล (ปรับชื่อได้)
CREATE DATABASE IF NOT EXISTS my_database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE my_database;

-- ตาราง authen
CREATE TABLE authen (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username CHAR(32) NOT NULL UNIQUE,
  password CHAR(264) NOT NULL,
  role_id INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ตาราง room
CREATE TABLE room (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name CHAR(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ตาราง queue
CREATE TABLE queue (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title CHAR(200) NOT NULL,
  reason CHAR(500) NOT NULL,
  room_id INT NOT NULL,
  authen_id INT NOT NULL,
  status_id INT NOT NULL,
  at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- เก็บวันเวลาอัตโนมัติ
  FOREIGN KEY (room_id) REFERENCES room(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (authen_id) REFERENCES authen(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
