const followerData = {
LillKocken: { username: "LillKocken",
  followers: [
  {nickname: "NinjaChef", fullname: "Amanda Tydén", follows: true},
  {nickname: "UtterMat", fullname: "Ronja Faltin", follows: true},
  {nickname: "SimbaFood", fullname: "Scar Leijon", follows: false}],
  following: [
  {nickname: "UtterMat", fullname: "Ronja Faltin", follows: true},
  {nickname: "BaraVego", fullname: "Vera Colbert", follows: true}]
  },

PastaMaster: { username: "UtterMat",
  followers: [
  {nickname: "WowFood", fullname: "Joppe Larsson", follows: false},
  {nickname: "UtterMat", fullname: "Ronja Faltin", follows: true},
  {nickname: "SmartMat", fullname: "Lo Lidén", follows: false}],
  following: [
  {nickname: "MatTack", fullname: "Moa Pion", follows: true},
  {nickname: "ChefChef", fullname: "Linus Hult", follows: true},
  {nickname: "SparMat", fullname: "Spara Karlsson", follows: true}]
  }
};

export default followerData;
