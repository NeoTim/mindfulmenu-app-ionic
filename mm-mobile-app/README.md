# MindfulMenu

## Production build and deploy

### Android

More detailed instructions are [here](https://ionicframework.com/docs/intro/deploying/).

```
export CH_ANDROID_VERSION='0.0.1'
export ANDROID_BUILD_TOOLS_PATH='/users/jared/Library/android-sdk-macosx/build-tools/28.0.0-rc1' # Note: You cannot use ~ in the path.

cd path/to/mm-mobile-app
ionic cordova build android --prod --release &&
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore mindfulmenu-keystore.jks platforms/android/build/outputs/apk/android-release-unsigned.apk ch-android &&
${ANDROID_BUILD_TOOLS_PATH}/zipalign -v 4 platforms/android/build/outputs/apk/android-release-unsigned.apk build/android/mindfulmenu-${CH_ANDROID_VERSION}.apk
```

Then login to Google Play console, select the app, add a new version, and upload the APK.

### iOS

Run

```
# Use this temporarily
ionic cordova build ios --aot --minifyjs --minifycss --release

# Broken for now
ionic cordova build ios --prod 
```

## Initial Setup

### Android 

We use the "Google Play App Signing", so just need the "Upload Key" to sign the apps locally.  To set that up, download the Upload Key from Google Play console, and add to the keystore with: `keytool -importcert -file ~/Downloads/upload_cert.der -keystore mindfulmenu-keystore.jks`.

# Default Ionic README (below)

## Mobile App made with Ionic :iphone:

### Development Set-up :computer:

Ionic's guide: [Installing Ionic](http://ionicframework.com/docs/intro/installation/) is a great place to start.

Ionic's guides and documenation are fairly solid, although there are occasional gaps where [Google might help](http://lmgtfy.com/?q=ionic+2+development+set+up).

[Cordova iOS Platform Guide](https://cordova.apache.org/docs/en/latest/guide/platforms/ios/)
[Cordova Android Platform Guide](https://cordova.apache.org/docs/en/latest/guide/platforms/android/)

While a good start is to clone this repo and then doing an `npm install` but it's best to be sure you have both Cordova and Ionic installed globally.

### Build :hammer: & Deployment :tada: Process

Ionic has a lot of great resources and guides. For both iOS and Android the [Deploying to a Device](http://ionicframework.com/docs/intro/deploying/) covers the topic pretty well.

To start the application (standard, in browser):
ionic serve

To start the application using browser platform emulation (slightly different behavior):
ionic cordova run browser

To start the application (on iOS simulator):
ionic cordova emulate ios

To start the application (on iOS device):
ionic cordova run ios

If you need to specify signing configuration manually, use:
ionic cordova run ios --buildConfig=ionic.ios.build.json

In ionic.ios.build.json, you need to specify your provisioningProfile UUID as well as developmentTeam ID. Leave other entries as they are.

#### Test Flight (iOS)

You'll need to be added to the MindfulMenu Development Team as well as the iTunes Connect Console.

Gotchas list:

1. The Legal Admin must accept T&C for every build before it can be released on Test Flight
2. When building with Xcode, you must use the `MindfulMenu.xcworkspace` and not the `MindfulMenu.xcodeproj`

#### Google Play Console (Android Alpha / Beta)

There are two testing channels on Google Play, literally Alpha and Beta. Follow the deployment instructions above under **Build & Deployment Process** and once you've signed, zipaligned, and verfied your `.apk` file, you can go to the Google Play Console and add it under the 'alpha' channel by uploading your file.

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
