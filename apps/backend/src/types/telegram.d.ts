declare module 'telegram' {
  export class TelegramClient {
    constructor(session: any, apiId: number, apiHash: string, options: any);
    connect(): Promise<void>;
    invoke(request: any): Promise<any>;
    isUserAuthorized(): Promise<boolean>;
  }
  
  export namespace Api {
    export namespace auth {
      export class SendCode {
        constructor(options: {
          phoneNumber: string;
          apiId: number;
          apiHash: string;
          settings: any;
        });
      }
      
      export class SignIn {
        constructor(options: {
          phoneNumber: string;
          phoneCodeHash: string;
          phoneCode: string;
        });
      }
    }
    
    export namespace channels {
      export class CreateChannel {
        constructor(options: {
          title: string;
          about: string;
          broadcast: boolean;
          megagroup: boolean;
        });
      }
    }
    
    export class CodeSettings {
      constructor(options: any);
    }
  }
}

declare module 'telegram/sessions' {
  export class StringSession {
    constructor(string?: string);
    save(): string;
  }
} 