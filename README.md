# react-datepicker [![build status](https://travis-ci.org/trendmicro-frontend/react-datepicker.svg?branch=master)](https://travis-ci.org/trendmicro-frontend/react-datepicker) [![Coverage Status](https://coveralls.io/repos/github/trendmicro-frontend/react-datepicker/badge.svg?branch=master)](https://coveralls.io/github/trendmicro-frontend/react-datepicker?branch=master)

[![NPM](https://nodei.co/npm/@trendmicro/react-datepicker.png?downloads=true&stars=true)](https://nodei.co/npm/@trendmicro/react-datepicker/)

React DatePicker

Demo: https://trendmicro-frontend.github.io/react-datepicker

## Installation

1. Install the latest version of [react](https://github.com/facebook/react) and [react-datepicker](https://github.com/trendmicro-frontend/react-datepicker):

  ```
  npm install --save react @trendmicro/react-datepicker
  ```

2. At this point you can import `@trendmicro/react-datepicker` and its styles in your application as follows:

  ```js
  import {
      DatePicker,
      DateTimePicker,
      DateTimeRangePicker,
      DateInput,
      TimeInput
  } from '@trendmicro/react-datepicker';

  // Be sure to include styles at some point, probably during your bootstraping
  import '@trendmicro/react-datepicker/dist/react-datepicker.css';
  ```

## Usage

To initialize state in your React component:
```js
state = {
    locale: 'en',
    startDate: '2017-08-01',
    startTime: '00:00:00',
    endDate: '2017-08-07',
    endTime: '23:59:59'
};
```

### DatePicker

```js
<DatePicker
    locale={this.state.locale}
    date={this.state.startDate}
    onChange={date => {
        this.setState({ startDate: date });
    }}
/>
```

### DatePicker in Dropdown Menu

```js
<Dropdown>
    <Dropdown.Toggle
        btnStyle="link"
        noCaret
        style={{ padding: 0 }}
    >
        <DateInput
            value={this.state.startDate}
            onChange={date => {
                this.setState({ startDate: date });
            }}
        />
    </Dropdown.Toggle>
    <Dropdown.Menu style={{ padding: 8 }}>
        <DatePicker
            locale={this.state.locale}
            date={this.state.startDate}
            onChange={date => {
                this.setState({ startDate: date });
            }}
        />
    </Dropdown.Menu>
</Dropdown>
```

### DateTimePicker

```js
<DateTimePicker
    locale={this.state.locale}
    date={this.state.startDate}
    time={this.state.startTime}
    onChangeDate={date => {
        this.setState({ startDate: date });
    }}
    onChangeTime={time => {
        this.setState({ startTime: time });
    }}
/>
```

### DateTimeRangePicker

```js
<DateTimeRangePicker
    locale={this.state.locale}
    startDate={this.state.startDate}
    startTime={this.state.startTime}
    endDate={this.state.endDate}
    endTime={this.state.endTime}
    onChangeStartDate={date => {
        this.setState({ startDate: date });
    }}
    onChangeStartTime={time => {
        this.setState({ startTime: time });
    }}
    onChangeEndDate={date => {
        this.setState({ endDate: date });
    }}
    onChangeEndTime={time => {
        this.setState({ endTime: time });
    }}
/>
```

### DateInput

```js
// Date format: YYYY-MM-DD
<DateInput
    value={this.state.startDate}
    onChange={date => {
        this.setState({ startDate: date });
    }}
/>
```

### TimeInput

```js
// Time format: HH:MM:SS
<TimeInput
    value={this.state.startTime}
    onChange={time => {
        this.setState({ startTime: time });
    }}
/>
```

## API

### Properties

#### DatePicker

Name | Type | Default | Description 
:--- | :--- | :------ | :----------

#### DateTimePicker

Name | Type | Default | Description 
:--- | :--- | :------ | :----------

#### DateTimeRangePicker

Name | Type | Default | Description 
:--- | :--- | :------ | :----------

#### DateInput

Name | Type | Default | Description 
:--- | :--- | :------ | :----------

#### TimeInput

Name | Type | Default | Description 
:--- | :--- | :------ | :----------

## License

MIT
