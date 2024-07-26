/*------------------------------------DROP TABLES-----------------------------------*/

drop table if exists Reports, Likes, Comments, Posts, Users; 

/*----------------------------------------------------------------------------------*/



/*-------------------------------CREATE TABLES----------------------------------*/

create table Users(
	id int identity(1,1),
	username varchar(100) unique not null,
	email varchar(100) not null,
	password varchar(100) not null,
	role varchar(16) not null,

	constraint PK_Users primary key (id),
	constraint CK_Users check (role in ('admin', 'user'))
);

create table Posts(
	postId int identity(1,1),
	username varchar(100) not null,
	industry varchar(50) not null,
	title varchar(255) not null,
	content text null,
	
	constraint PK_Posts primary key (postId),
	constraint FK_Posts foreign key (username) references Users(username),
	constraint CHK_Industry CHECK (industry IN ('healthcare', 'education', 'agriculture'))
);

create table Comments(
	commentId int identity(172,1),
	userId int not null,
	contentType varchar(8) not null,
	contentId int not null,
	content text not null,

	constraint PK_Comments primary key (commentId),
	constraint FK_Comments foreign key (userId) references Users(id),
	constraint CK_Comments check (contentType in ('Comments', 'Posts'))
);

create table Likes(
	likeId int identity(12378,1),
	userId int not null,
	contentType varchar(8) not null,
	contentId int not null,

	constraint PK_Likes primary key (likeId),
	constraint FK_Likes foreign key (userId) references Users(id),
	constraint CK_Likes check (contentType in ('Comments', 'Posts')) 
);

create table Reports(
	reportId int identity (327132,1),
	contentType varchar(8) not null,
	contentId int not null,
	reason varchar(255) not null,
	reportDate date not null,

	constraint PK_Reports primary key (reportId),
	constraint CK_Reports check (contentType in ('Comments', 'Posts'))
);

/*------------------------------------------------------------------------------------------------*/

/*----------------------------------INSERT VALUES---------------------------------------*/

insert into Users(username, email, password, role) 
values
	('Mooncringle', 'mooncringle123@gmail.com', '$2b$10$D2On5TBBtPEU0fewxHjWcunq5dhzXK8aJfXlK6eJ05h5eXPtNt6iu', 'user'),
	('agedRank', 'agedrank023@gmail.com', '$2b$10$jgrtabM321l9WHImeV7.S.2UdO9ek6bdUhsrx3Ye9T06V7ZQsTj5S', 'user'),
	('Benjamin', 'benjamin13278@gmail.com', '$2b$10$A1o0txwKyWANX1nPOCMaMOtSePRpdbdUPHf9xZEqnsGFqqAGH09sm', 'admin'),
	('towerskit', 'towerskit@gmail.com', '$2b$10$XgUaHjeYK0shFAEQtO/lqOLjxOAKcZGZR//AdxeUU9Hl1xCxQl0fO', 'user'),
	('PANDALOSER', 'pandaloser123@gmail.com', '$2b$10$1cNMBYIC6rHFARr6pyvqWeVkmqnTGFZi7syvD9kpoPOfee6Da8yL2', 'user');

insert into Posts(username, industry, title, content)
values 
	('Mooncringle','education', 'What is the best GenAI in the market now?', 'So many good ones out in the market, but which one stands above all?'),
	('Mooncringle', 'education', 'Technology is Advancing Too Quickly', 'In the fast-paced business world, keeping up with technological advancements presents a significant challenge for many organizations. Rapidly evolving technologies require continuous learning and adaptation, often straining resources and budgets. Businesses must invest in ongoing training and development for their employees to stay competitive, yet this can be difficult to manage alongside day-to-day operations. Furthermore, integrating new technologies often entails updating or replacing existing systems, which can be costly and time-consuming. The pressure to stay ahead of competitors drives the need for constant innovation, but balancing this with maintaining productivity and service quality remains a persistent struggle. Realistically, should businesses just stick to what worked in the past rather than trying to innovate?'),
	('agedRank', 'agriculture','Farming in 2024', 'Being a farmer in 2024 involves a unique blend of traditional practices and cutting-edge technology. Modern farmers navigate challenges such as climate change, fluctuating market prices, and the demand for sustainable practices while leveraging advancements like precision agriculture, drones, and AI-driven analytics to enhance productivity and efficiency. The role has become increasingly data-driven, with farmers using real-time information to make informed decisions about crop management, irrigation, and pest control. Despite these technological aids, the profession remains demanding, requiring resilience and adaptability. The connection to the land and community persists, even as farmers balance the pressures of modern agribusiness with the timeless rhythms of nature.'),
	('towerskit', ,'education', 'A perspective into what education will look like for our children', 'In the future, education is poised to undergo a profound transformation driven by technological innovation and evolving societal needs. Classrooms will become more interactive and personalized, with AI and machine learning tailoring learning experiences to individual students'' strengths and weaknesses. Virtual and augmented reality will bring subjects to life, providing immersive, hands-on learning opportunities that transcend traditional textbooks. The boundaries of education will expand beyond physical classrooms, as online platforms and global collaborations enable students to learn from anywhere in the world. Additionally, the focus will shift towards developing critical thinking, creativity, and adaptability, preparing students for careers that may not yet exist. Lifelong learning will become the norm, with continuous education and skill development essential to thriving in a rapidly changing world.'),
	('PANDALOSER', 'healthcare', 'The future of our health', 'Healthcare in the future will be revolutionized by advancements in technology and personalized medicine, leading to more efficient, effective, and patient-centered care. Artificial intelligence and machine learning will play a pivotal role in diagnosing diseases, predicting health risks, and tailoring treatments to individual genetic profiles. Telemedicine will become ubiquitous, providing remote access to healthcare services and specialists, making medical care more accessible and convenient for patients everywhere. Wearable devices and health monitoring apps will enable continuous tracking of vital signs and health metrics, allowing for proactive management of chronic conditions and early intervention. Furthermore, breakthroughs in biotechnology and regenerative medicine will offer new treatments and potential cures for previously incurable diseases, fundamentally transforming the landscape of healthcare and significantly enhancing the quality and longevity of human life.');



insert into Comments(userId, contentType, contentId, content) 
values 
    (1, 'Posts', 1, 'honestly for general usage? probably chat gpt'),
    (2, 'Posts', 2, 'i inspire to articulate like you'),
    (3, 'Comments', 1, 'too bad claude is taking over'),
    (4, 'Posts', 3, 'holy yappington'),
    (5, 'Comments', 2, 'well, you can use chat gpt for free but you only get limited queries for claude if you don''t pay for the subscription');

insert into Likes(userId, contentType, contentId)
values 
	(1, 'Posts', 1),
	(2, 'Posts', 2),
	(4, 'Posts', 2),
	(5, 'Posts', 4),
	(1, 'Comments', 1),
	(5, 'Comments', 1);

insert into Reports(contentType, contentId, reason, reportDate)
values
	('Posts', 1, 'Harassment', '2024-06-11'),
	('Posts', 1, 'Inciting Hate', '2024-06-12'),
	('Comments', 6, 'Harassment', '2024-06-15');

/*----------------------------------------------------------------------------------*/
