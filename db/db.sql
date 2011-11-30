CREATE TABLE `assets` (
  `id` int(11) NOT NULL auto_increment,
  `objectId` varchar(20) NOT NULL,
  `objectAssetId` varchar(20) NOT NULL,
  `objectUrl` varchar(255) NOT NULL,
  `imageUrl` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY  (`id`),
  FULLTEXT KEY `title` (`title`,`description`),
  FULLTEXT KEY `description` (`description`,`title`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;