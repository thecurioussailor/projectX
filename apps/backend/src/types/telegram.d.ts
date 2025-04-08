declare module 'telegram' {
  export class TelegramClient {
    constructor(session: any, apiId: number, apiHash: string, options: any);
    connected: boolean;
    connect(): Promise<void>;
    invoke(request: any): Promise<any>;
    isUserAuthorized(): Promise<boolean>;
    getDialogs({}): Promise<any>;
    disconnect(): Promise<void>;
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

      export class InviteToChannel {
        constructor(options: {
          channel: any;
          users: any[];
        });
      }

      export class EditAdmin {
        constructor(options: {
          channel: any;
          userId: any;
          adminRights: any;
          rank: string;
        });
      }
    }

    export namespace contacts {
      export class ResolveUsername {
        constructor(options: {
          username: string;
        });
      }
    }
    

    export class InputUser {
      constructor(options: {
        userId: number;
        accessHash: string;
      });
    }

    export class ChatAdminRights {
      constructor(options: any);
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