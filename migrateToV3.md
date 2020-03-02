# Migrate react-datetime to v3

A new decade has begun and a new mayor version of react-datetime is released. It's been some years since the first release of v2 and a lot has changed in the react ecosystem. 

In v3 we have updated the whole base code of react-datetime, catching up with the latest tools and practices. We can proudly say that this is the best performant, most customizable and easiest to understand version of the library so far. It also make the mantainance of react-datetime much simpler, so we are ready to keep shipping new features and improvements.

## What's new in react-datetime v3
Version 3 is a big refactor of react-datetime. We have tried to not to change the API drastically, but some of the props has been renamed or removed, trying to make them clearer for the developer. A complete list of changes is:

* The props are read directly when possible, don't deriving the state from them when possible.
* `disableCloseOnClickOutside` prop is now `closeOnClickOutside` (avoid double negations).
* `onBlur` and `onFocus` props are renamed to `onClose` and `onOpen` since they had nothing to do with the blur event and it was misleading for some users. If we want to listen to the input's `onBlur` and `onFocus` use `inputProps`.
* Time is not updated anymore on right clicks.
* The new prop `renderView` can be used to customize the whole calendar markup.
* The new prop `updateOnView` can be used to decide when to update the date.
* We can add a listener to new prop `onBeforeNavigate` in order to detect when the current view is going to change. We can use it to block the navigation or create custom navigation flows.
* `onViewModeChange` prop has been renamed to `onNavigate` when the current view has changed.
* Two new imperative methods `setViewDate` and `navigate` methods allows to update the current view shown by the app.
* Clicking on days from the previous or next month in the days view should work properly now.
* Month, year and time views for locales that don't use gregorian numbers should work properly now.
* A playground has been added to the repo, that makes simpler to work on react-datetime development and test out changes quickly. To run it: `npm run playground`.
* Not using the deprecated method `componentWillReceiveProps` any more.
* We are not using create-react-class anymore, bye bye 2016's react!
* Updated typescript definitions.
* Not depending on gulp to create the build anymore.
* Updated most of the dependencies.

## Steps to migrate to version 3

The easiest way of migrating to v3 is updating the dependency in your package.json:
```
react-datetime: "^3.0.0"
```

Then tell npm to start updating in your CLI:
```
npm update react-datetime
```

Once the update has finishes try your app. It might seem to be working ok, but some props have changes and if they don't break your app, your pickers might be behaving a little bit differently.

We should better search for the following props in your code and replace them as recommended in the points below:
