import { UserPayload } from '../global';

export interface Chat {
  id: string;
  type: string;
  name?: string;
  photo?: string;
  participants: UserPayload[];
  latestMessage?: Message;
  updatedAt: string;
  createdAt: string;
}

export interface Message {
  id: string;
  message: string;
  file?: string;
  sender: UserPayload;
  createdAt: string;
}
