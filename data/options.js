const now = new Date();
const minus28Days = new Date();

minus28Days.setDate(now.getDate() - 28);

module.exports = {
  page: {
    offset: 0,
    limit: 50,
  },
  sort: 'createdAt', // -createdAt for reverse
  filter: {
    'createdAt-start': minus28Days.toISOString(), // ISO Date
    'createdAt-end': now.toISOString(), // ISO Date
    playerNames: [],
    teamNames: [],
    gameMode: '5v5_pvp_ranked',
    patchVersion: '3.2'
  },
};