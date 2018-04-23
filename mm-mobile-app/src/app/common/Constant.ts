export class Constant {

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