export interface GameDetailResponse {
  teams: [
    {
      result: 'WIN' | 'LOSS' | 'DRAW';
      goals: number;
      members: {
        playerName: string;
        imageURL: string;
        goalsScored: number;
        ownGoals: number;
      }[];
    },
    {
      result: 'WIN' | 'LOSS' | 'DRAW';
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
