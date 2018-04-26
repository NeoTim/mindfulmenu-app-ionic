export class Layout {

  public static readonly MAIN         = 'main';

  public static readonly PRELIMINARY  = 'preliminary';

  // --

  public static values = function(): any {
    const values = {};

    Object.keys(this).forEach((key) => {
      if (key !== 'values') {
        values[key] = this[key];
      }
    });

    return values;
  };

}
