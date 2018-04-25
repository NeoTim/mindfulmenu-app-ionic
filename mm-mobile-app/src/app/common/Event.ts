export class Event {

    public static readonly AUTH = {
        LOGIN: {
            SUCCESS:        'auth_login_success',
            ERROR:          'auth_login_error',
        },
        LOGOUT: {
            SUCCESS:        'auth_logout_success',
            ERROR:          'auth_logout_error',
        },
        ERROR: {
            UNAUTHORIZED:   'auth_error_unauthorized',
            FORBIDDEN:      'auth_error_forbidden',
        }
    };

    public static readonly SYSTEM = {
        LOADING:            'system_loading',
        GENERAL_ERROR:      'system_generalError'
    };

    public static readonly NETWORK = {
        ONLINE:             'network_online',
        OFFLINE:            'network_offline',
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
