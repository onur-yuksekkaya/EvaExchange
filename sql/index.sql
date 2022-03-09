CREATE TABLE transactions (
	`id` INT NOT NULL AUTO_INCREMENT,
	`user_id` varchar(255) NOT NULL,
	`share` varchar(12) NOT NULL,
	`amount` INT NOT NULL,
	`type` varchar(255) NOT NULL,
  	`price` INT NOT NULL,
	`date` TIMESTAMP NOT NULL,
	PRIMARY KEY (`id`)
);

INSERT INTO transactions VALUES(1,123,"AKB",3000,"BUY",0,NOW());
INSERT INTO transactions VALUES(2,123,"AKB",1000,"SELL",15,NOW()+1);
INSERT INTO transactions VALUES(3,1,"AKB",1000,"BUY",15,NOW()+2);
INSERT INTO transactions VALUES(4,123,"AKB",1000,"SELL",15,NOW()+3);
INSERT INTO transactions VALUES(5,1,"AKB",1000,"BUY",15,NOW()+4);
INSERT INTO transactions VALUES(6,123,"AKB",500,"SELL",17,NOW()+5);
INSERT INTO transactions VALUES(7,1,"AKB",500,"BUY",17,NOW()+6);


#SELECT DISTINCT share, SUM(CASE WHEN type = "BUY" THEN amount ELSE -amount END ) as LOT_COUNT FROM transactions WHERE share = "AKB" AND user_id = 1

SELECT price FROM transactions WHERE share = "AKB" ORDER BY date DESC LIMIT 1;

#SELECT * FROM transactions;
