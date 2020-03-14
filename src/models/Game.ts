export class Game {
  constructor(public genres: Genre[], public id: number, public rating: number, public description: string, public publishers: string[], public name: string) {}
}

class Genre {
  constructor(public name: string) {}
}