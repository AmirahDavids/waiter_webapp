
drop table if exists daysOfTheWeek,
shifts,
waiter;


create table daysOfTheWeek(
    id serial  not null primary key,
    dayName text not null
);

create table waiter(
    id serial not null primary key,
    waiterName text not null
);


create table shifts(

    id serial not null primary key,
    waiterId int not null,
    dayId int not null,
    
    foreign key (waiterId) references waiter(id),
    foreign key (dayId) references daysOfTheWeek(id)
);

insert into daysOfTheWeek (dayName) values ('Sunday');
insert into daysOfTheWeek (dayName) values ('Monday');
insert into daysOfTheWeek (dayName) values ('Tuesday');
insert into daysOfTheWeek (dayName) values ('Wednesday');
insert into daysOfTheWeek (dayName) values ('Thursday');
insert into daysOfTheWeek (dayName) values ('Friday');
insert into daysOfTheWeek (dayName) values ('Saturday');