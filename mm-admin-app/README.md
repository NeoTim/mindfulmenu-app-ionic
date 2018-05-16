# Mindful Menu Admin App

## Deploy to prod

We host this app on Firebase, and deploying is very simple.

```
cd /path/to/mm-admin-app
ng build --prod &&
firebase deploy
```

## Coding Notes

Mobile application (mm-mobile-app) and Admin application (mm-admin-app) "share" some code, mostly consisting of data models and objects that allow for remote Firebase access. 
Since there's no easy way to build a common "lib" that both these projects could include, the code is duplicated. 

/app/data

Most files in here should be identical in both projects. It is possible that one project might use a certain set of them and the other another set, and these sets won't
be identical, but that's ok. All the files here can reside in both projects, even if some of them are not used. Additionally, /local can differ more visibly between projects,
if one project is going to use more local data, that are not relevant to the other.
  
  /dto has files that mirror Firebase's Firestore structure exactly and should be used in both-way communication with Firebase. 
  /local has local variations of some of these DTOs, that are mostly enhanced to keep array of objects, rather than ids (as DTOs do). 

  They are built out of DTO objects (static method .fromDTO) and can be converted back to DTO (static method .toDTO).
  Once local object is built, its array of objects needs to be manually populated (attached), i.e. by obtaining an array of objects from Firebase using another call.
  
All Firebase's DTO should extend IdentifiableDTO, which has an id field. The code responsible for extracting data out of Firebase is building custom objects "on the fly",
consisting of Firebase's document plus its id as a field.

FirebaseCredentialsDTO is a custom object made out of firebase.User - some properties are ignored, while some are "pulled" to the root level, from some nested structures.
It serves mostly as a reference point and carries some important internal user/auth data. This is a reflection of "users" created in Firebase web console, not to be confused
with Users stored directly in Firestore. Each Firestore user has an UID field that is a direct reference to the "auth" user. This way, after login, we can pull the appropriate
user from the DB, with all additional data needed (like roles, etc.)

/app/util

DateUtil should be the same in both projects. It contains methods used by class-transformer to convert between JS Date and Firestore Timestamp.
FirebaseManager should be the same in both projects. It's a simple injectable wrapper over firebase() object, allowing for single point of initialization and configuration.
It's unlikely it will change further on.
FirestoreManager should be the same in both projects. It's dependant on FirebaseManager (needs its firestore() object) and serves as a entry point for Firestore access.
It also contains some convenience methods for converting out of Firestore's queries and documents back to simple JS objects. There's also a method to call for multiple documents,
using their ids. It's unlikely it will change further on, although some new convenience methods could be added later, which could be shared by both projects.

/app/config/ApplicationConfig

Environment configuration is a bit different in Ionic and plain Angular project (Ionic doesn't really have a concept of environments), but both configs should have
firebase configuration object, possibly with the same values.

/app/model, /app/service

Most of these files should be the same in both projects, but not all of them. Those that refer to domain objects (Meal, WeeklyMenu, etc.) can be shared. It's possible that
each project will use a different set of methods, but that's ok. Think of them as of DAOs. Other Model/Service pairs might be unique to the project and should not be shared
(like NetworkModel being unique to mobile app or AuthModel being used just in mobile, as admin doesn't have auth at this point). Similarly Admin app has ApplicationModel that
mobile app doesn't have.

While Service objects can be used in both projects, Model objects are not interchangeable - at least not directly. Model objects refer to Angular or Ionic libraries
and require some code changes to port between projects. This mostly concerns the local storage and event systems (Ionic uses its own, while Angular relies
on external libraries from NPM). 

# Generic Angular Docs

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.6.6.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

