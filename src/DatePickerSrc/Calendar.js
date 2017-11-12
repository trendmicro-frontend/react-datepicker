import React from 'react';
import Component from 'react-class';

import assign from 'object-assign';
import assignDefined from './assignDefined';

import MonthView, { NAV_KEYS } from './MonthView';
import toMoment from './toMoment';
import join from './join';
import forwardTime from './utils/forwardTime';


export default class Calendar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timeFocused: false
        };
    }
    prepareDate(props) {
        return toMoment(props.date, props);
    }

    render() {
        const props = this.p = assign({}, this.props);
        const dateFormat = props.dateFormat.toLowerCase();

        props.date = this.prepareDate(props);
        if (props.showClock === undefined) {
            props.showClock = dateFormat.indexOf('k') !== -1 || dateFormat.indexOf('h') !== -1;
        }

        const timeFormat = dateFormat.substring(dateFormat.toLowerCase().indexOf('hh'));

        props.timeFormat = timeFormat;

        const className = join(
            props.className,
            'react-date-picker__calendar',
            props.theme && `react-date-picker__calendar--theme-${props.theme}`
        );

        const monthViewProps = assign({}, this.props);

        delete monthViewProps.onTimeChange;
        delete monthViewProps.showClock;
        delete monthViewProps.updateOnWheel;
        delete monthViewProps.wrapTime;

        if (typeof this.props.cleanup === 'function') {
            this.props.cleanup(monthViewProps);
        }

        const monthView = (<MonthView
            {...monthViewProps}
            onChange={this.onChange}
            className={null}
            style={null}
            ref={view => {
                this.view = view;
            }}
            renderChildren={this.renderChildren}
        />);

        return (<div
            inline row wrap={false}
            className={className} style={props.style}
        >
            {monthView}
        </div>);
    }

    isHistoryViewVisible() {
        if (this.view && this.view.isHistoryViewVisible) {
            return this.view.isHistoryViewVisible();
        }

        return false;
    }

    renderChildren([navBar, inner, footer]) {
        const props = this.p;
        const clockInput = props.showClock && this.renderClockInput();

        const children = [
            navBar,
            <div justifyContent="center" wrap={this.props.wrap || this.props.wrapTime}>
                <div
                    column
                    wrap={false}
                    alignItems="stretch"
                >
                    {inner}
                </div>
                {clockInput}
            </div>,
            footer
        ];

        return (<div
            column
            wrap={false}
            alignItems="stretch"
        >{children}</div>);
    }

    focus() {
        if (this.view) {
            this.view.focus();
        }
    }

    isFocused() {
        if (this.view) {
            return this.view.isFocused();
        }

        return false;
    }

    onViewKeyDown(...args) {
        if (this.view) {
            this.view.onViewKeyDown(...args);
        }
    }

    isTimeInputFocused() {
        return this.state.timeFocused;
    }

    renderClockInput() {
        const clockInput = null;

        const readOnly = this.props.readOnly;

        const clockInputProps = {
            ref: (clkInput) => {
                this.clockInput = clkInput;
            },
            viewIndex: this.props.viewIndex,
            dateFormat: this.p.dateFormat,
            [readOnly ? 'value' : 'defaultValue']: this.p.date,
            onFocus: this.onClockInputFocus,
            onBlur: this.onClockInputBlur,
            onChange: this.onTimeChange,
            onMouseDown: this.onClockInputMouseDown
        };

        assignDefined(clockInputProps, {
            onEnterKey: this.props.onClockEnterKey,
            onEscapeKey: this.props.onClockEscapeKey,
            readOnly,
            tabIndex: readOnly ? null : this.props.clockTabIndex,
            theme: this.props.theme,
            updateOnWheel: this.props.updateOnWheel
        });

        if (clockInput) {
            return React.cloneElement(clockInput, clockInputProps);
        }

        return (<ClockInput
            {...clockInputProps}
        />);
    }

    onClockInputFocus() {
        this.setState({
            timeFocused: true
        });

        this.props.onClockInputFocus();
    }

    onClockInputBlur() {
        this.setState({
            timeFocused: false
        });

        this.props.onClockInputBlur();
    }

    onClockInputMouseDown(event) {
        event.stopPropagation();
        if (event.target && event.target.type !== 'text') {
            // in order not to blur - in case we're in a date field
            event.preventDefault();
        }

        this.clockInput.focus();
    }

    onTimeChange(value, timeFormat) {
        this.time = value;
        this.props.onTimeChange(value, timeFormat);

        const view = this.view;
        const moment = view.p.moment;

        if (moment == null) {
            return;
        }

        view.onChange({
            dateMoment: moment,
            timestamp: +moment
        });
    }

    onChange(dateString, { dateMoment, timestamp }, event) {
        const props = this.p;

        if (props.showClock) {
            const time = toMoment(this.time || this.clockInput.getValue(), {
                dateFormat: props.timeFormat,
                locale: props.locale
            });

            forwardTime(time, dateMoment);
            timestamp = +dateMoment;
            dateString = this.view.format(dateMoment);
        }

        if (this.props.onChange) {
            this.props.onChange(dateString, { dateMoment, timestamp, dateString }, event);
        }
    }
}

Calendar.defaultProps = {
    dateFormat: 'YYYY-MM-DD',

    theme: 'default',

    isDatePicker: true,
    wrapTime: false,

    onTimeChange: () => {},

    onClockEnterKey: () => {},
    onClockInputBlur: () => {},
    onClockInputFocus: () => {},

    onFooterTodayClick: () => {},
    onFooterCancelClick: () => {},
    onFooterClearClick: () => {},
    onFooterOkClick: () => {}
};

Calendar.propTypes = {
};

export {
    NAV_KEYS
};
