// src/app/models/event.model.ts
export interface Event {
    EventID: number;
    EventName: string;
    EventImage?: string;
    EventDate: string;
    Location: string;
    Description?: string;
    TicketPrice: number;
    CurrentAttendees: number;
    GoalAttendees: number;
    CurrentStatus: number;
    CategoryID: number;
    CategoryName?: string;
}