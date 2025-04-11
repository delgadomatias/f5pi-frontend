export interface GameDetailResponse {
  teams: [
    {
      result: 'WIN' | 'LOSE' | 'DRAW';
      goals: number;
      members: {
        playerName: string;
        imageURL: string;
        goalsScored: number;
        ownGoals: number;
      }[];
    },
    {
      result: 'WIN' | 'LOSE' | 'DRAW';
      goals: number;
      members: {
        playerName: string;
        imageURL: string;
        goalsScored: number;
        ownGoals: number;
      }[];
    }
  ];
}
