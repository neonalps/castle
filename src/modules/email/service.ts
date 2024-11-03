export class EmailService {

    public async send(email: string, content: string): Promise<void> {
        console.log(`Sending email to ${email}`);
        console.log(`Content: ${content}`);
    }

}