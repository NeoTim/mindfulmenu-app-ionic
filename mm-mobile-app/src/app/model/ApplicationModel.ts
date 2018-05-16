import { Injectable } from '@angular/core';

@Injectable()
export class ApplicationModel {

    public suppressLoading: boolean = false;

    constructor() {
        this.setupListeners();
    }

    private setupListeners(): void {
        //
    }

}
