export class Remember {
  static readonly type = '[Visited Routes] Remember';
  constructor(public url: string) {}
}
