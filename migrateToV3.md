# Migrate react-datetime to v3

A new decade has begun and a new major version of react-datetime is released. It's been some years since the first release of v2 and a lot has changed in the react ecosystem. 

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
* Search for `defaultViewDate` props and replace them with `initialViewDate`.
* Search for `viewMode` props and replace them with `initialViewMode`.
* Search for `disableCloseOnClickOutside`. If you are using it, replace it with `closeOnClickOutside={false}`.
* Search for `<Datetime>` components using `onBlur` or `onFocus`. Replace those props with `onClose` or `onOpen`. `onOpen` doesn't receive any parameters anymore, so don't try to access to them.
* Search for `onViewModeChange`. If you find it, rename it to `onNavigate`.
* Search for `Datetime.setView`. If you were using this imperative method, replace it with `Datetime.navigate`.

Those are the main changes that might break your app, if you weren't able to find any of those, react-datetime v3 should keep working as usual in your project.

## What's new in react-datetime v3
Version 3 is a big refactor of react-datetime. We have tried to not to change the API drastically, but some of the props has been renamed or removed, trying to make them clearer for the developer. A complete list of changes is:

* The props are read directly when possible, not deriving the state from them anymore.
* The props that were used to set initial values, like `defaultValue`, `viewDate` or `viewMode` are renamed with the  `initial` prefix to better express their intention. `initialValue`, `initialViewDate`, `initialViewMode`.
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
react-datetime is made by the community for the community. People like you, interested in contribute, are the key of the project! 🙌🙌🙌

Have a look at [our contribute page](contribute-home.md) to know how to get started.