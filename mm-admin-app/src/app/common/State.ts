export class State {

  public static readonly MAIN = {
    HOME:           'main.home',
    WEEKLY_MENUS:   'main.weeklyMenus',
    MEALS:          'main.meals',
    USERS:          'main.users',
  };

  public static readonly PRELIMINARY = {
    AUTH: {
      AUTH:         'preliminary.auth',
      LOGIN:        'preliminary.auth.login'
    },
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
