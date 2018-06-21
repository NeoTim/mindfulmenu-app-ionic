# Firebase

## Deploy functions

Make sure you've run `npm install` in mm-firebase/functions directory.

```
cd mm-firebase
firebase deploy --only functions
```

## Running unit tests

You can run the unit tests with `npm test`.

## Set environment variables

This needs to be done to send emails using a Gmail account.

1. To be able to send emails with your Gmail account: enable access to [Less Secure Apps](https://www.google.com/settings/security/lesssecureapps) and [Display Unlock Captcha](https://accounts.google.com/DisplayUnlockCaptcha). For accounts with 2-step verification enabled [Generate an App Password](https://support.google.com/accounts/answer/185833).

1. Set the `gmail.email` and `gmail.password` Google Cloud environment variables to match the email and password of the Gmail account used to send emails (or the app password if your account has 2-step verification enabled). For this use:
```bash
firebase functions:config:set gmail.email="ourmindfulmenu@gmail.com" gmail.password="secretpassword"
```

1. The first time attempted, it got blocked, and the email account received an email saying it had blocked suspicious behavior.  (I even had to change my password on one account, because they thought it had been compromised.)  Responding to that email to allow the device, allowed it to work from then on.
