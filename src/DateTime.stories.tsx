import * as React from "react";
import DateTime, { FORMATS } from "./.";
import "../scss/styles.scss";

import isBefore from "date-fns/isBefore";
import startOfDay from "date-fns/startOfDay";

import nl from "date-fns/locale/nl";
import es from "date-fns/locale/es";
import fr from "date-fns/locale/fr";

const { useState } = React;

export default {
  title: "DateTime"
};

export function SimpleExample() {
  function UncontrolledDateTime(props) {
    const [value, setValue] = useState<any>("");

    return (
      <div>
        <strong>Props:</strong> {JSON.stringify(props)}
        <div>
          <DateTime
            value={value}
            onChange={newVal => {
              console.log({ newVal });
              setValue(newVal);
            }}
            {...props}
          />
        </div>
        <br />
      </div>
    );
  }

  return (
    <div>
      <h2>Simple Scenarios</h2>

      <UncontrolledDateTime />

      <UncontrolledDateTime
        dateFormat={`${FORMATS.MONTH}/${FORMATS.DAY}/${FORMATS.YEAR}`}
      />
      <UncontrolledDateTime
        dateFormat={`${FORMATS.MONTH}/${FORMATS.DAY}/${FORMATS.YEAR}`}
        timeFormat={false}
      />
      <UncontrolledDateTime dateFormat={false} />

      <UncontrolledDateTime
        timeFormat={`${FORMATS.MILITARY_HOUR}:${FORMATS.MINUTE}`}
      />
      <UncontrolledDateTime
        dateFormat={false}
        timeFormat={`${FORMATS.MILITARY_HOUR}:${FORMATS.MINUTE}`}
      />
      <UncontrolledDateTime timeFormat={false} />

      <UncontrolledDateTime
        dateFormat={`${FORMATS.MONTH}/${FORMATS.DAY}/${FORMATS.YEAR}`}
        timeFormat={`${FORMATS.MILITARY_HOUR}:${FORMATS.MINUTE}`}
      />
    </div>
  );
}

export function LocalizationExample() {
  const [value, setValue] = useState<any>(
    new Date(Date.UTC(2000, 0, 15, 2, 2, 2, 2))
  );
  const [currentLocale, setCurrentLocale] = useState();

  function renderButton(text: string, newLocale: any) {
    return (
      <button
        type="button"
        onClick={() => setCurrentLocale(newLocale)}
        disabled={currentLocale === newLocale}
      >
        {text}
      </button>
    );
  }

  return (
    <div className="form-horizontal">
      <h2>Locale props</h2>
      <p>Try out various locales and see how they affect the component.</p>
      <p>
        {renderButton("EN - undefined", undefined)}
        {renderButton("NL - nl", nl)}
        {renderButton("ES - es", es)}
        {renderButton("FR - fr", fr)}
      </p>

      <DateTime
        value={value}
        onChange={newValue => {
          console.log(newValue);
          setValue(newValue);
        }}
        locale={currentLocale}
        dateFormat={`${FORMATS.MONTH}/${FORMATS.YEAR}`}
        timeFormat={false}
      />
    </div>
  );
}

export function CustomizableExample() {
  const [state, setState] = useState<any>({
    value: new Date(2019, 7, 2, 11, 25),
    dateFormat: `${FORMATS.MONTH}/${FORMATS.DAY}/${FORMATS.YEAR}`,
    timeFormat: `${FORMATS.HOUR}:${FORMATS.MINUTE} ${FORMATS.AM_PM}`,
    dateTypeMode: undefined
  });

  function Select({ name, children }) {
    return (
      <div className="form-group">
        <label className="control-label col-xs-6">{name}</label>

        <div className="col-xs-6">
          <select
            className="form-control"
            value={state[name]}
            onChange={e => {
              let newValue: any = e.target.value;
              if (newValue === "true") {
                newValue = true;
              } else if (newValue === "false") {
                newValue = false;
              }

              setState({ ...state, [name]: newValue });
            }}
          >
            {children}
          </select>
        </div>
      </div>
    );
  }

  return (
    <div className="form-horizontal">
      <h2>Customization props</h2>
      <p>
        Try out various configuration options and see how they affect the
        component.
      </p>

      <div>
        <strong>Value:</strong> {JSON.stringify(state.value)}
      </div>

      <form
        onSubmit={e => {
          alert("submitted");
          e.preventDefault();
        }}
      >
        <DateTime
          value={state.value}
          onChange={newValue => {
            console.log(newValue);
            setState({ ...state, value: newValue });
          }}
          {...state}
        />
      </form>

      <hr />

      <Select name="dateFormat">
        <option value="">false</option>
        <option>
          {FORMATS.YEAR}-{FORMATS.MONTH}-{FORMATS.DAY}
        </option>
        <option>
          {FORMATS.MONTH}/{FORMATS.DAY}/{FORMATS.YEAR}
        </option>
        <option>
          {FORMATS.DAY}.{FORMATS.MONTH}.{FORMATS.YEAR}
        </option>
        <option>
          {FORMATS.MONTH}-{FORMATS.DAY}
        </option>
        <option>{FORMATS.FULL_MONTH_NAME}</option>
        <option>
          {FORMATS.YEAR}/{FORMATS.MONTH}
        </option>
        <option>{FORMATS.YEAR}</option>
      </Select>

      <Select name="timeFormat">
        <option value="">false</option>
        <option>
          {FORMATS.HOUR}:{FORMATS.MINUTE} {FORMATS.AM_PM}
        </option>
        <option>
          {FORMATS.MILITARY_HOUR}:{FORMATS.MINUTE}:{FORMATS.SECOND}
        </option>
        <option>
          {FORMATS.MILITARY_HOUR}:{FORMATS.MINUTE}:{FORMATS.SECOND}.
          {FORMATS.MILLISECOND}
        </option>
        <option>
          {FORMATS.HOUR}:{FORMATS.MINUTE}:{FORMATS.SECOND}.{FORMATS.MILLISECOND}{" "}
          {FORMATS.AM_PM}
        </option>
        <option>
          {FORMATS.HOUR}
          {FORMATS.MINUTE}
        </option>
        <option>
          {FORMATS.MILITARY_HOUR}:{FORMATS.MINUTE}xxx
        </option>
      </Select>

      <Select name="dateTypeMode">
        <option value="">default (Date)</option>
        <option>utc-ms-timestamp</option>
        <option>input-format</option>
        <option>Date</option>
      </Select>
    </div>
  );
}

export function ViewModeExample() {
  const [value, setValue] = useState(undefined);
  const [dateFormat, setDateFormat] = useState<string | boolean | undefined>(
    undefined
  );
  const [timeFormat, setTimeFormat] = useState<string | boolean | undefined>(
    undefined
  );

  function renderButton(
    text: string,
    newDateFormat: string | boolean | undefined,
    newTimeFormat: string | boolean | undefined
  ) {
    return (
      <button
        type="button"
        onClick={() => {
          setDateFormat(newDateFormat);
          setTimeFormat(newTimeFormat);
        }}
        disabled={dateFormat === newDateFormat && timeFormat === newTimeFormat}
      >
        {text}
      </button>
    );
  }

  return (
    <div>
      <h2>View Modes</h2>
      <p>Try out various formats and see how they affect the component.</p>
      <p>
        {renderButton("Default - undefined", undefined, undefined)}
        {renderButton(`Years - ${FORMATS.YEAR}`, `${FORMATS.YEAR}`, undefined)}
        {renderButton(
          `Months - ${FORMATS.MONTH}/${FORMATS.YEAR}`,
          `${FORMATS.MONTH}/${FORMATS.YEAR}`,
          undefined
        )}
        {renderButton(
          `Days - ${FORMATS.MONTH}/${FORMATS.DAY}/${FORMATS.YEAR}`,
          `${FORMATS.MONTH}/${FORMATS.DAY}/${FORMATS.YEAR}`,
          undefined
        )}
        {renderButton(
          `Time - ${FORMATS.HOUR}:${FORMATS.MINUTE} ${FORMATS.AM_PM}`,
          false,
          `${FORMATS.HOUR}:${FORMATS.MINUTE} ${FORMATS.AM_PM}`
        )}
      </p>

      <DateTime
        value={value}
        onChange={newValue => {
          console.log(newValue);
          setValue(newValue);
        }}
        dateFormat={dateFormat}
        timeFormat={timeFormat}
      />
    </div>
  );
}

export function ValidatedExample() {
  const [value, setValue] = useState(undefined);

  return (
    <div>
      <h2>isValidDate</h2>
      <p>You can use "isValidDate" to enable all dates before now.</p>

      <DateTime
        value={value}
        onChange={newValue => {
          console.log(newValue);
          setValue(newValue);
        }}
        timeFormat={false}
        isValidDate={current => isBefore(current, startOfDay(new Date()))}
      />
    </div>
  );
}
