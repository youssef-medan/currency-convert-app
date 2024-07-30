import { Injectable } from '@nestjs/common';
import * as sendgrid from '@sendgrid/mail';
import { ForgetPasswordEvent, TaskCreatedEvent, UserCreatedEvent } from './events';

@Injectable()
export class AppService {
  constructor() {
    sendgrid.setApiKey(process.env.SENDGRID_SECRET);
  }
  getHello(): string {
    return 'email service runnung...';
  }
  async handleTaskCreated(taskInfo: TaskCreatedEvent) {
    const { title, description, username, email } = taskInfo;
    const transport = await sendgrid.send({
      to: email,
      from: 'youssef_medan@hotmail.com',
      subject: 'Task Created',
      text: `A new task has been created by you (${username})`,
      html: `<strong>A new task (${title}) has been created by you (${username}) <br> task detailes : (${description})</strong>`,
    });
    console.log(`Task created email sent to ${email}`);
  }

  async handleUserCreated(userInfo: UserCreatedEvent) {
    const { email } = userInfo;
    const transport = await sendgrid.send({
      to: email,
      from: 'youssef_medan@hotmail.com',
      subject: 'Account Created',
      text: `Welcome `,
      html: `<body>
             <h2>Hey</h2>
             <h3>Welocome To Our Apllection</h3>
             <h3>you signup in currency exchange app with this email (${email})</h3>
             <br>
             <p style="color: brown;">We Hope To Enjoy Using Our App And Being One Of Our Family</p>
    
            </body>`,

    });
  }

  async handleForgetPassword(userInfo:ForgetPasswordEvent): Promise<void> {
    const { email, url } = userInfo;
    const transport = await sendgrid.send({
      to: email,
      from: 'youssef_medan@hotmail.com',
      subject: 'Reset Password',
      text: `To Reset Your password Click Link Below`,
      html: `<body>
             <h2>Hello</h2>
             <h3>Click Here To Resert Password : ${url}</h3>
             <br>
             <p style="color: brown;">We Hope To Enjoy Using Our App And Being One Of Our Family</p>
    
            </body>`,
    });
  }
}
