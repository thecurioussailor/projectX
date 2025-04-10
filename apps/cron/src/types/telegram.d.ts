declare module 'telegram' {
  export class TelegramClient {
    constructor(session: any, apiId: number, apiHash: string, options?: any);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    isUserAuthorized(): Promise<boolean>;
    invoke(request: any): Promise<any>;
    getDialogs(params?: any): Promise<any[]>;
    start(params: { botAuthToken: string }): Promise<void>;
  }
  
  export namespace Api {
    namespace contacts {
      class ResolveUsername {
        constructor(params: { username: string });
      }
    }
    
    namespace channels {
      class EditBanned {
        constructor(params: { 
          channel: any;
          participant: any;
          bannedRights: any;
        });
      }
      
      class InviteToChannel {
        constructor(params: {
          channel: any;
          users: any[];
        });
      }
    }
    
    class InputUser {
      constructor(params: {
        userId: number | string;
        accessHash: string | number;
      });
    }
    
    class ChatBannedRights {
      constructor(params: {
        untilDate?: number;
        viewMessages?: boolean;
        sendMessages?: boolean;
        sendMedia?: boolean;
        sendStickers?: boolean;
        sendGifs?: boolean;
        sendGames?: boolean;
        sendInline?: boolean;
        embedLinks?: boolean;
      });
    }
  }
} 