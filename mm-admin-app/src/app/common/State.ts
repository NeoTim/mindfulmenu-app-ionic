export class State {

  public static readonly MAIN = {
    HOME:           'main.home'
  };

  public static readonly PRELIMINARY = {
    ERROR: {
      ERROR:        'preliminary.error',
      NOT_FOUND:    'preliminary.error.notFound',
    }
  };

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
