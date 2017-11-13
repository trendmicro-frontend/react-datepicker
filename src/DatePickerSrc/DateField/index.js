import React from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import Component from 'react-class';
import assign from 'object-assign';

import cx from 'classnames';

import moment from 'moment';
import DateFormatInput from '../DateFormatInput';
import join from '../join';
import toMoment from '../toMoment';
import Calendar, { NAV_KEYS } from '../Calendar';
import joinFunctions from '../joinFunctions';
import assignDefined from '../assignDefined';

import forwardTime from '../utils/forwardTime';

import styles from './index.styl';

const POSITIONS = { top: 'top', bottom: 'bottom' };

const getPicker = props => {
    return React.Children
        .toArray(props.children)
        .filter(c => c && c.props && c.props.isDatePicker)[0] || <Calendar />;
};

// const FIND_INPUT = c => c && (c.type === 'input' || (c.props && c.isDateInput));


const preventDefault = (event) => {
    event.preventDefault();
};

export default class DateField extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.defaultValue === undefined ? '' : props.defaultValue,
            expanded: props.defaultExpanded || false,
            focused: false
        };
    }

    componentWillUnmount() {
        this.unmounted = true;
    }

    render() {
        return (<div className={styles.dateField}>
            {this.renderInput()}
            {this.renderClearIcon()}
            {this.renderCalendarIcon()}

            {this.renderPicker()}
        </div>);
    }

    renderInput() {
        const props = this.props;
        const inputProps = this.prepareInputProps(this.props);

        let input;

        if (props.renderInput) {
            input = props.renderInput(inputProps);
        }

        if (input === undefined) {
            const FieldInput = DateFormatInput;

            const propsForInput = assign({}, inputProps);

            if (!props.forceValidDate) {
                delete propsForInput.date;
                delete propsForInput.maxDate;
                delete propsForInput.minDate;
                delete propsForInput.dateFormat;
            }

            input = <FieldInput {...propsForInput} />;
        }

        return input;
    }

    renderClearIcon() {
        const props = this.props;

        if (!props.clearIcon || props.forceValidDate || props.disabled) {
            return undefined;
        }

        const clearIcon = <i className="fa fa-calendar" />;
        // props.clearIcon === true ?
        // CLEAR_ICON :
        // props.clearIcon

        const clearIconProps = {
            style: {
                visibility: props.text ? 'visible' : 'hidden'
            },
            className: 'react-date-field__clear-icon',
            onMouseDown: this.onClearMouseDown,
            children: clearIcon
        };

        let result;

        if (props.renderClearIcon) {
            result = props.renderClearIcon(clearIconProps);
        }

        if (result === undefined) {
            result = <div style={{ display: 'inline-block' }} {...clearIconProps} />;
        }

        return result;
    }

    onClearMouseDown(event) {
        event.preventDefault();
        this.onFieldChange('');

        if (!this.isFocused()) {
            this.focus();
        }
    }

    renderCalendarIcon() {
        const { focused } = this.state;
        let result;
        const renderIcon = this.props.renderCalendarIcon;

        const calendarIconProps = {
            onMouseDown: this.onCalendarIconMouseDown,
            children: <i className={cx('fa fa-calendar', { [styles.focused]: focused })} />
        };

        if (renderIcon) {
            result = renderIcon(calendarIconProps);
        }

        if (result === undefined) {
            result = <div className={styles.calendarIconContainer} {...calendarIconProps} />;
        }

        return result;
    }

    onCalendarIconMouseDown(event) {
        if (this.props.disabled) {
            return;
        }
        event.preventDefault();

        if (!this.isFocused()) {
            this.focus();
        }

        this.toggleExpand();
    }

    prepareExpanded(props) {
        return props.expanded === undefined ?
            this.state.expanded :
            props.expanded;
    }

    prepareDate(props, pickerProps) {
        props = props || this.props;
        pickerProps = pickerProps || props.pickerProps;

        const locale = props.locale || pickerProps.locale;
        const dateFormat = props.dateFormat || pickerProps.dateFormat;

        let value = props.value === undefined ?
            this.state.value :
            props.value;

        const date = this.toMoment(value);
        const valid = date.isValid();

        if (value && typeof value !== 'string' && valid) {
            value = this.format(date);
        }

        if (date && valid) {
            this.lastValidDate = date;
        } else {
            value = this.state.value;
        }

        const viewDate = this.state.viewDate || this.lastValidDate || new Date();
        const activeDate = this.state.activeDate || this.lastValidDate || new Date();

        return {
            viewDate,
            activeDate,
            dateFormat,
            locale,
            valid,
            date,
            value
        };
    }

    preparePickerProps(props) {
        const picker = getPicker(props, this);

        if (!picker) {
            return null;
        }

        return picker.props || {};
    }

    prepareProps(thisProps) {
        const props = this.props = assign({}, thisProps);

        props.children = React.Children.toArray(props.children);

        props.expanded = this.prepareExpanded(props);
        props.pickerProps = this.preparePickerProps(props);

        const input = <input />;

        if (input && input.type === 'input') {
            props.rawInput = true;
            props.forceValidDate = false;
        }

        const dateInfo = this.prepareDate(props, props.pickerProps);

        assign(props, dateInfo);

        if (props.text === undefined) {
            props.text = this.state.text;

            if (props.text == null) {
                props.text = props.valid && props.date ?
                    props.value :
                    this.props.value;
            }
        }

        if (props.text === undefined) {
            props.text = '';
        }

        props.className = this.prepareClassName(props);

        return props;
    }

    prepareClassName(props) {
        const position = POSITIONS[props.pickerProps.position || props.pickerPosition] || 'bottom';

        return join([
            'react-date-field',
            props.className,

            props.disabled && 'react-date-field--disabled',

            props.theme && `react-date-field--theme-${props.theme}`,
            `react-date-field--picker-position-${position}`,

            this.isLazyFocused() && join(
                'react-date-field--focused',
                props.focusedClassName
            ),

            this.isExpanded() && join(
                'react-date-field--expanded',
                props.expandedClassName
            ),

            !props.valid && join(props.invalidClassName, 'react-date-field--invalid')
        ]);
    }

    prepareInputProps(props) {
        const input = <input />;
        const inputProps = (input && input.props) || {};

        const onBlur = joinFunctions(inputProps.onBlur, this.onFieldBlur);
        const onFocus = joinFunctions(inputProps.onFocus, this.onFieldFocus);
        const onChange = joinFunctions(inputProps.onChange, this.onFieldChange);
        const onKeyDown = joinFunctions(inputProps.onKeyDown, this.onFieldKeyDown);

        const newInputProps = assign({}, inputProps, {

            ref: (f) => {
                this.field = f;
            },
            date: props.date,

            onFocus,
            onBlur,
            onChange,

            dateFormat: props.dateFormat,
            value: props.value || '',

            onKeyDown,

            className: join(
                styles.dateInput,
                inputProps.className
            )
        });

        assignDefined(newInputProps, {
            placeholder: props.placeholder,
            disabled: props.disabled,
            minDate: props.minDate,
            maxDate: props.maxDate
        });

        return newInputProps;
    }

    renderPicker() {
        const props = this.props;

        if (this.isExpanded()) {
            const newExpand = !this.picker;
            const picker = getPicker(props, this);

            const pickerProps = props.pickerProps;

            const onMouseDown = joinFunctions(pickerProps.onMouseDown, this.onPickerMouseDown);
            const onChange = joinFunctions(pickerProps.onChange, this.onPickerChange);

            const date = props.valid && props.date;
            const footer = pickerProps.footer !== undefined ? pickerProps.footer : props.footer;

            const viewDate = newExpand && date ? date : props.viewDate;
            const activeDate = newExpand && date ? date : props.activeDate;

            return React.cloneElement(picker, assignDefined({
                ref: (p) => {
                    this.picker = this.pickerView = p;

                    if (p && p.getView) {
                        this.pickerView = p.getView();
                    }

                    if (!this.state.viewDate) {
                        this.onViewDateChange(props.viewDate);
                    }
                },

                footer,

                focusOnNavMouseDown: false,
                focusOnFooterMouseDown: false,

                insideField: true,
                showClock: props.showClock,

                getTransitionTime: this.getTime,

                updateOnWheel: props.updateOnWheel,

                onClockInputBlur: this.onClockInputBlur,
                onClockEnterKey: this.onClockEnterKey,
                onClockEscapeKey: this.onClockEscapeKey,

                footerClearDate: props.clearDate || props.minDate,

                onFooterCancelClick: this.onFooterCancelClick,
                onFooterTodayClick: this.onFooterTodayClick,
                onFooterOkClick: this.onFooterOkClick,
                onFooterClearClick: this.onFooterClearClick,

                dateFormat: props.dateFormat,
                theme: props.theme || pickerProps.theme,
                arrows: props.navBarArrows,

                className: join(pickerProps.className, 'react-date-field__picker'),

                date: date || null,

                tabIndex: -1,

                viewDate,
                activeDate,
                locale: props.locale,

                onViewDateChange: this.onViewDateChange,
                onActiveDateChange: this.onActiveDateChange,
                onTimeChange: this.onTimeChange,

                onTransitionStart: this.onTransitionStart,

                onMouseDown,
                onChange
            }, {
                minDate: props.minDate,
                maxDate: props.maxDate
            }));
        }

        this.time = null;

        return null;
    }

    onTimeChange(value, timeFormat) {
        const timeMoment = this.toMoment(value, { dateFormat: timeFormat });

        const time = ['hour', 'minute', 'second', 'millisecond'].reduce((acc, part) => {
            acc[part] = timeMoment.get(part);
            return acc;
        }, {});

        this.time = time;
    }

    getTime() {
        return this.time;
    }

    setValue(value, config = {}) {
        const dateMoment = this.toMoment(value);
        const dateString = this.format(dateMoment);

        this.setDate(dateString, assign(config, { dateMoment }));
    }

    onFooterOkClick() {
        const activeDate = this.p.activeDate;

        if (activeDate) {
            const date = this.toMoment(activeDate);

            forwardTime(this.time, date);

            this.setValue(date, { skipTime: !!this.time });
        }

        this.setExpanded(false);
    }

    onFooterCancelClick() {
        this.setExpanded(false);
    }

    onFooterTodayClick() {
        const today = this.toMoment(new Date())
            .startOf('day');

        this.onPickerChange(this.format(today), { dateMoment: today });
        this.onViewDateChange(today);
        this.onActiveDateChange(today);

        return false;
    }

    onFooterClearClick() {
        const clearDate = this.props.clearDate === undefined ? this.props.minDate : this.props.clearDate;

        if (clearDate !== undefined) {
            this.setValue(clearDate, {
                skipTime: true
            });
        }

        this.setExpanded(false);

        return false;
    }

    toMoment(value, props) {
        if (moment.isMoment(value)) {
            return value;
        }

        props = props || this.props;

        let date = toMoment(value, {
            strict: props.strict,
            locale: props.locale,
            dateFormat: props.displayFormat || props.dateFormat || this.p.dateFormat
        });

        if (!date.isValid() && props.displayFormat) {
            date = toMoment(value, {
                strict: props.strict,
                locale: props.locale,
                dateFormat: props.dateFormat || this.p.dateFormat
            });
        }

        return date;
    }

    isValid(text) {
        if (text === undefined) {
            text = this.props.text;
        }

        return this.toMoment(text).isValid();
    }

    onViewDateChange(viewDate) {
        this.setState({
            viewDate
        });
    }

    onActiveDateChange(activeDate) {
        this.setState({
            activeDate
        });
    }

    onViewKeyDown(event) {
        // const key = event.key;

        if (this.pickerView) { // } && (key == 'Escape' || key == 'Enter' || (key in NAV_KEYS))) {
            this.pickerView.onViewKeyDown(event);
        }
    }

    onPickerMouseDown(event) {
        preventDefault(event);

        if (!this.isFocused()) {
            this.focus();
        }
    }

    isHistoryViewVisible() {
        if (this.picker && this.picker.isHistoryViewVisible) {
            return this.picker.isHistoryViewVisible();
        }

        return false;
    }

    onFieldKeyDown(event) {
        const key = event.key;
        const expanded = this.isExpanded();
        const historyVisible = this.isHistoryViewVisible();

        if (key === 'Enter' && !historyVisible) {
            this.onViewKeyDown(event);
            this.toggleExpand();
            return false;
        }

        if (historyVisible && (key === 'Escape' || key === 'Enter')) {
            this.onViewKeyDown(event);
            return false;
        }

        if (key === 'Escape') {
            if (expanded) {
                this.setExpanded(false);
                return false;
            }
        }

        if (expanded) {
            if (key in NAV_KEYS) {
                this.onViewKeyDown(event);
                return false;
            }
            // if (!currentPosition || !currentPosition.time) {
            //   // the time has not changed, so it's safe to forward the event
            //   this.onViewKeyDown(event)
            //   return false
            // }
        }

        return true;
    }

    getInput() {
        return findDOMNode(this.field);
    }

    isFocused() {
        return this.state.focused;
    }

    isLazyFocused() {
        return this.isFocused() || this.isTimeInputFocused();
    }

    isTimeInputFocused() {
        if (this.pickerView && this.pickerView.isTimeInputFocused) {
            return this.pickerView.isTimeInputFocused();
        }

        return false;
    }

    onFieldFocus(event) {
        if (this.state.focused) {
            return;
        }
        this.setState({
            focused: true
        });

        if (this.props.expandOnFocus) {
            this.setExpanded(true);
        }

        this.props.onFocus(event);
    }

    onFieldBlur(event) {
        if (!this.isFocused()) {
            return;
        }

        this.setState({
            focused: false
        });

        this.props.onBlur(event);

        if (!this.pickerView || !this.pickerView.isTimeInputFocused) {
            this.onLazyBlur();
            return;
        }

        setTimeout(() => this.onLazyBlur(), 0);
    }

    onClockEnterKey() {
        if (!this.isFocused()) {
            this.focus();
        }

        this.onFooterOkClick();
    }

    onClockEscapeKey() {
        if (!this.isFocused()) {
            this.focus();
        }

        this.onFooterCancelClick();
    }

    onClockInputBlur() {
        setTimeout(() => {
            if (!this.isFocused()) {
                this.onLazyBlur();
            }
        }, 0);
    }

    onLazyBlur() {
        if (this.unmounted) {
            return;
        }

        if (this.isTimeInputFocused()) {
            return;
        }

        this.setExpanded(false);

        if (!this.isValid() && this.props.validateOnBlur) {
            const value = this.lastValidDate && this.p.text !== '' ?
                this.format(this.lastValidDate) :
                '';

            setTimeout(() => {
                this.onFieldChange(value);
            }, 0);
        }
    }

    onInputChange() {

    }

    isExpanded() {
        return this.props.expanded;
    }

    toggleExpand() {
        this.setExpanded(!this.props.expanded);
    }

    setExpanded(bool) {
        const props = this.props;

        if (bool === props.expanded) {
            return;
        }

        if (!bool) {
            this.onCollapse();
        } else {
            this.setState({}, () => {
                this.onExpand();
            });
        }

        if (bool && props.valid) {
            this.setState({
                // viewDate: props.date,
                activeDate: props.date
            });
        }

        if (this.props.expanded === undefined) {
            this.setState({
                expanded: bool
            });
        }

        this.props.onExpandChange(bool);
    }

    onCollapse() {
        this.props.onCollapse();
    }

    onExpand() {
        this.props.onExpand();
    }

    onFieldChange(value) {
        if (this.props.rawInput && typeof value !== 'string') {
            const event = value;
            value = event.target.value;
        }

        const dateMoment = value === '' ?
            null :
            this.toMoment(value);

        if (dateMoment === null || dateMoment.isValid()) {
            this.onChange(dateMoment);
        }

        this.onTextChange(value);
    }

    onTextChange(text) {
        if (this.props.text === undefined && this.props.value === undefined) {
            this.setState({
                text
            });
        }

        if (this.props.onTextChange) {
            this.props.onTextChange(text);
        }
    }

    onPickerChange(dateString, { dateMoment, forceUpdate }, event) {
        const isEnter = event && event.key === 'Enter';
        const updateOnDateClick = forceUpdate ? true : this.props.updateOnDateClick || isEnter;

        if (updateOnDateClick) {
            forwardTime(this.time, dateMoment);

            this.setDate(dateString, { dateMoment });

            if (this.props.collapseOnDateClick || isEnter) {
                this.setExpanded(false);
            }
        }
    }

    setDate(dateString, { dateMoment, skipTime = false }) {
        const props = this.props;

        const currentDate = props.date;

        if (props.valid && currentDate) {
            const dateFormat = props.dateFormat.toLowerCase();

            const hasTime = dateFormat.indexOf('k') !== -1 ||
                      dateFormat.indexOf('h') !== -1;

            if (hasTime && !skipTime) {
                ['hour', 'minute', 'second', 'millisecond'].forEach(part => {
                    dateMoment.set(part, currentDate.get(part));
                });
            }
        }

        this.onTextChange(this.format(dateMoment));
        this.onChange(dateMoment);
    }

    onChange(dateMoment) {
        if (dateMoment != null && !moment.isMoment(dateMoment)) {
            dateMoment = this.toMoment(dateMoment);
        }

        forwardTime(this.time, dateMoment);

        const newState = {};

        if (this.props.value === undefined) {
            assign(newState, {
                text: null,
                value: dateMoment
            });
        }

        newState.activeDate = dateMoment;

        if (!this.pickerView || !this.pickerView.isInView || !this.pickerView.isInView(dateMoment)) {
            newState.viewDate = dateMoment;
        }

        if (this.props.onChange) {
            this.props.onChange(this.format(dateMoment), { dateMoment });
        }

        this.setState(newState);
    }

    format(mom, format) {
        return mom == null ?
            '' :
            mom.format(format || this.props.displayFormat || this.props.dateFormat);
    }

    focusField() {
        const input = findDOMNode(this.field);

        if (input) {
            input.focus();
        }
    }

    focus() {
        this.focusField();
    }
}

DateField.defaultProps = {
    showClock: undefined,

    forceValidDate: false,
    strict: true,

    expandOnFocus: true,

    updateOnDateClick: false,
    collapseOnDateClick: false,

    theme: 'default',

    footer: true,

    onBlur: () => {},
    onFocus: () => {},

    clearIcon: true,
    validateOnBlur: true,

    onExpandChange: () => {},
    onCollapse: () => {},
    onExpand: () => {},

    minDate: moment('1000-01-01', 'YYYY-MM-DD'),
    maxDate: moment('9999-12-31 HH:mm:ss', 'YYYY-MM-DD 23:59:59'),

    skipTodayTime: false
};

DateField.propTypes = {
    dateFormat: PropTypes.string.isRequired
};
