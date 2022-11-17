import { Component, Input, OnInit } from '@angular/core';
import { EventSystemService } from '../event-system.service';
import { Participation, ThingToDo, User } from '../interfaces';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent implements OnInit {
  currentUser: User = {} as User;
  userParticipations: ThingToDo[] = [];

  userParticipationsIds: Number[] = [];

  events: ThingToDo[] = [];

  constructor(private _service: EventSystemService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadUsersEvents(this.currentUser);
  }
  
  selectUser(user: User) {
    this.currentUser = user;
    this.loadUsersEvents(this.currentUser);
    
    //console.table(this.userParticipations);
  }

  loadUsers = (): void => {
    this._service.getEvents().subscribe((data: ThingToDo[]) => {
      this.events = data;
      //console.log(this.events);
      //console.log("Events loaded");     
      //console.log(this.userParticipations);
    });
  };

  loadUsersEvents = (user: User): void => {
    this._service.getEventsByUser(user.id).subscribe((data: ThingToDo[]) => {
      this.userParticipations = data;
      this.getParticipationIds();
      //console.log("Events loaded");     
      //console.log(this.userParticipations);
    });
  };

  addParticipation = (event: ThingToDo): void => {
    let participation: Participation = {} as Participation;
    this._service.addParticipation(this.currentUser.id, event.id, participation).subscribe(() => {
      this.userParticipations.push(event);
    });
  };

  deleteParticipation = (event: ThingToDo): void => {
    let participationId: number = 0;
    this._service.deleteParticipation(participationId).subscribe(() => {
      this.userParticipations = this.userParticipations.filter((item) => item.id !== event.id);
    });
  };


    getParticipationIds = () => {
    let ids: Number[] = [];
    this.userParticipations.forEach((participation) => {
      ids.push(participation.id);
      this.userParticipationsIds = ids;
    });
}
}
