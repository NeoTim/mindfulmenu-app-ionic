# Chanl Health

## Production build and deploy

### Android

More detailed instructions are [here](https://ionicframework.com/docs/intro/deploying/).

The private key is located at `resources/android/chanlhealth-android.jks`.

```
export CH_ANDROID_VERSION='0.3.13'
export ANDROID_BUILD_TOOLS_PATH='/users/jared/Library/android-sdk-macosx/build-tools/28.0.0-rc1' # Note: You cannot use ~ in the path.

cd path/to/chanlhealth-app-ionic2
ionic cordova build android --prod --release &&
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore chanlhealth-keystore.jks platforms/android/build/outputs/apk/android-release-unsigned.apk ch-android &&
${ANDROID_BUILD_TOOLS_PATH}/zipalign -v 4 platforms/android/build/outputs/apk/android-release-unsigned.apk build/android/chanlhealth-${CH_ANDROID_VERSION}.apk
```

Then login to Google Play console, select the app, add a new version, and upload the APK.

### iOS

Run

```
ionic cordova build ios --prod 
```

## Initial Setup

### Android 

We use the "Google Play App Signing", so just need the "Upload Key" to sign the apps locally.  To set that up, download the Upload Key from Google Play console, and add to the keystore with: `keytool -importcert -file ~/Downloads/upload_cert.der -keystore chanlhealth-keystore.jks`.


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

You'll need to be added to the ChanlHealth Development Team as well as the iTunes Connect Console.

Gotchas list:

1. The Legal Admin must accept T&C for every build before it can be released on Test Flight
2. When building with Xcode, you must use the `ChanlHealth.xcworkspace` and not the `ChanlHealth.xcodeproj`

#### Google Play Console (Android Alpha / Beta)

There are two testing channels on Google Play, literally Alpha and Beta. Follow the deployment instructions above under **Build & Deployment Process** and once you've signed, zipaligned, and verfied your `.apk` file, you can go to the Google Play Console and add it under the 'alpha' channel by uploading your file.

# Coding Notes