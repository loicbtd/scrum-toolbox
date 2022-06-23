export class UpdateProjects {
  constructor(public action: string, public label: string) {}
  static readonly type = '[Projects] Update';
}
