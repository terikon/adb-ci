# This tools is not functional yet

# Problem

You want to test your Android Cordova application with [Travis](https://travis-ci.org/) (or any other CI solution).
And your tests need permission to be granted on emulator.
For example, permission to access device storage.

**cordova run** command cannot grant permissions. So you cannot run your tests.

If you use [cordova-paramedic](https://github.com/apache/cordova-paramedic), you also out of luck.

# Solution

Add adb-ci to your project:

    npm install adb-ci --save-dev

After adding adb-ci, CI build will always run cordova in such a way that it installs your app on emulator with
all required permissions granted.

So your tests that require permissions will work.

See [cordova-plugin-photo-library](https://github.com/terikon/cordova-plugin-photo-library) for example of usage of adb-ci.

# How it works

adb-ci adds wrapper to adb command inside your project that will be activated when adb runs, by any node tool.
cordova is one of such tools. Actually, under the hood, crodova runs adb to install and run your app.

The wrapper is installed in node_modules\.bin\adb. This ways, calls to adb will be redirected to adb-ci.

Every call to adb will be passed through by wrapper as is, except **adb install** command.
The wrapper will add -g parameter to **adb install** call, so installed app will have granted permissions
(see [adb docs](https://developer.android.com/studio/command-line/adb.html) for details).

- adb-ci will be activated only when CI environment variable is set, so it will not interfere with development machines.

- ANDROID_HOME envrionment variable should be set for adb-ci to work.

That's it. Hope it will be useful to someone.
