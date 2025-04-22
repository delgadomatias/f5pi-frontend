import { Member } from './member.interface';

export interface CreateGameDetailRequest {
  teams: [
    {
      members: Member[];
    },
    {
      members: Member[];
    }
  ];
}
