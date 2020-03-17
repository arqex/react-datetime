# Migrate react-datetime to v3

A new decade has begun and a new mayor version of react-datetime is released. It's been some years since the first release of v2 and a lot has changed in the react ecosystem. 

In v3 we have updated the whole base code of react-datetime, catching up with the latest tools and practices. We can proudly say that this is the best performant, most customizable and easiest to understand version of the library so far. This version also makes the mantainance of react-datetime much simpler, this way we are ready to keep shipping new features and improvements.


## Steps to migrate to version 3

The easiest way of migrating to v3 is updating the dependency in your package.json:
```
react-datetime: "^3.0.0"
```

Then tell npm to start updating in your CLI:
```
npm update react-datetime
```

Once the update has finished, try your app. 

It might seem to be working ok but [some props have changed](#whats-new-in-react-datetime-v3) and, even if they don't break your app, your pickers might be behaving a little bit differently.

We should better search for the following props in our code and replace them as recommended in the points below:
* Search for `defaultValue` prop in your datetime code. Remame it to `initialValue`.
* Search for `defaultViewDate` props and replace them by `initialViewDate`.
* Search form `viewMode` props and replace them by `initialViewMode`.
* Search for `disableCloseOnClickOutside`. If you are using it, replace it for `closeOnClickOutside={false}`.
* Search for `<Datetime>` components using `onBlur` or `onFocus`. Replace those props by `onClose` or `onOpen`. `onOpen` doesn't receive any paramter anymore, so don't try to access to them.
* Search for `onViewModeChange`. If you find it, rename it by `onNavigate`.
* Search for `Datetime.setView`. If you were using this imperative method, replace it by `Datetime.navigate`.

Those are the main changes that might break your app, if you weren't able to find any of those, react-datetime v3 should keep working as usual in your project.

## What's new in react-datetime v3
Version 3 is a big refactor of react-datetime. We have tried to not to change the API drastically, but some of the props has been renamed or removed, trying to make them clearer for the developer. A complete list of changes is:

* The props are read directly when possible, not deriving the state from them anymore.
* The props that were used to set initial values, like `defaultValue`, `viewDate` or `viewMode` are renamed with the  `initial` prefix to express better their intention. `initialValue`, `initialViewDate`, `initialViewMode`.
* `disableCloseOnClickOutside` prop is now `closeOnClickOutside` (avoid double negations).
* `onBlur` and `onFocus` props are renamed to `onClose` and `onOpen` since they had nothing to do with the blur event and it was misleading for some users. If we want to listen to the input's `onBlur` and `onFocus` use `inputProps`.
* Time is not updated anymore on right clicks.
* The new prop `renderView` can be used to customize the whole calendar markup.
* The new prop `updateOnView` can be used to decide when to update the date.
* `onViewModeChange` prop has been renamed to `onNavigate` when the current view has changed.
* We can add a listener to new prop `onBeforeNavigate` in order to detect when the current view is going to change. We can use it to block the navigation or create custom navigation flows.
* Two new imperative methods `setViewDate` and `navigate` methods allows to update the current view shown by the app.
* Clicking on days from the previous or next month in the days view should work properly now.
* Month, year and time views for locales that don't use gregorian numbers should work properly now.
* A playground has been added to the repo, that makes simpler to work on react-datetime development and test out changes quickly. To run it: `npm run playground`.
* Not using the deprecated method `componentWillReceiveProps` anymore.
* We are not using create-react-class anymore, bye bye 2016's react!
* Updated typescript definitions.
* Not depending on gulp to create the build anymore.
* Updated most of the dependencies.

## Contribute

react-datetime is a nice choice if you are looking for some open-source project to lay your hands on. It's a library used by thousands of developers, and the changes in this version make easier for everyone to understand it. It's not simple, but it's small enough to be get you initiated in a couple of hours.

If you are interested and want to start playing with its code, clone it and fire up the playground included in the repo:

```
git clone https://github.com/YouCanBookMe/react-datetime.git
cd react-datetime
npm install
npm run playground
```

This will start a local development server building `src/index.js`. We can update react-datetime's sources then and our changes will be hot loaded by the development server.

Looking for something to work on? Have a look at [the list of known issues](https://github.com/YouCanBookMe/react-datetime/issues), and maybe you can kill a bug making somebody happy! :)

Have some work done? That's great! But please, read the [react-datetime contributing guidelines](.github/CONTRIBUTING.md) before submitting it.
