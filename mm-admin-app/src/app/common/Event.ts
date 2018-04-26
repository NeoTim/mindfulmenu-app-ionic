export class Event {

    public static readonly SYSTEM = {
        LOADING:            'system_loading',
        GENERAL_ERROR:      'system_generalError'
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
