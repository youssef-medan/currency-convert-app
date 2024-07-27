

export class UserCreatedEvent {
    constructor(public readonly email: string) { }
}
export class ForgetPasswordEvent {
    constructor(public readonly email:string,public readonly url: string) { }
}