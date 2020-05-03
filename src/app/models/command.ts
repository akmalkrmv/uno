export class Command {
  public visible = true;
  public disabled = false;

  constructor(
    public name: string,
    public text: string,
    public icon: string = ''
  ) {}
}

export class CommandGroup {
  public order: number = 0;
  public icon: string = '';

  constructor(
    public name: string,
    public text: string,
    public commands: Command[] = []
  ) {}
}
