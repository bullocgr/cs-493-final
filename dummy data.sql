CREATE TABLE `album` (
  `id` mediumint(9) NOT NULL,
  `name` varchar(255) NOT NULL,
  `cover` varchar(255),
  `songs` mediumint(9),
  `date` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`songs`) REFERENCES `songs` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 20 DEFAULT CHARSET = latin1;

CREATE TABLE `artist` (
  `id` mediumint(9) NOT NULL,
  `name` varchar(255) NOT NULL,
  `album` mediumint(9),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`album`) REFERENCES `album` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 20 DEFAULT CHARSET = latin1;

-- CREATE TABLE `label` (
--   `id` mediumint(9) NOT NULL,
--   `name` varchar(255) NOT NULL,
--   `artist` mediumint(9),
--   PRIMARY KEY (`id`),
--   FOREIGN KEY (`artist`) REFERENCES `album` (`id`)
-- ) ENGINE = InnoDB AUTO_INCREMENT = 20 DEFAULT CHARSET = latin1;

CREATE TABLE `user` (
  `id` mediumint(9) NOT NULL,
  `name` varchar(255) NOT NULL,
  `albums` mediumint(9),
  `songs` mediumint(9),
  `artists` mediumint(9),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`albums`) REFERENCES `album` (`id`),
  FOREIGN KEY (`songs`) REFERENCES `songs` (`id`),
  FOREIGN KEY (`artists`) REFERENCES `artist` (`id`),
) ENGINE = InnoDB AUTO_INCREMENT = 20 DEFAULT CHARSET = latin1;