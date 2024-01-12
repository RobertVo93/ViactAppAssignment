USE DOCKERIZED;
CREATE TABLE user (
   created_at timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
   updated_at timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), 
   created_by varchar(255) NULL, 
   updated_by varchar(255) NULL, 
   sys_id varchar(36) NOT NULL, 
   email varchar(255) NOT NULL, 
   password varchar(255) NOT NULL, 
   password_salt varchar(255) NOT NULL, 
   UNIQUE (email),
   PRIMARY KEY (sys_id)
);