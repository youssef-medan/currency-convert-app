
export class TaskCreatedEvent {
    constructor(public readonly title: string, public readonly description: string , public readonly username:string , public readonly email:string) { }
}
export class TaskEditedEvent {
    constructor(public readonly id : string, public readonly title: string, public readonly description: string , public readonly username:string) { }
}
export class UserCreatedEvent {
    constructor(public readonly email: string) { }
}
export class ForgetPasswordEvent {
    constructor(public readonly email:string,public readonly url: string) { }
}