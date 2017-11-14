import React from 'react';
import Component from 'react-class';

import moment from 'moment';
import assign from 'object-assign';

import FORMAT from './utils/format';
import onEnter from './onEnter';
import toMoment from './toMoment';

import isInRange from './utils/isInRange';

let TODAY;

const emptyFn = () => {};

export default class MonthView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            range: null
        };
    }

    /**
   * Formats the given date in the specified format.
   * @method format
   *
   * @param  {Date/String/Moment} value
   * @param  {String} [format] If none specified, #dateFormat will be used
   *
   * @return {String}
   */

    formatAsDay(moment, dayDisplayFormat) {
        return moment.format(dayDisplayFormat || 'D');
    }

    getWeekStartMoment(value) {
        const weekStartDay = this.weekStartDay;
        const clone = this.toMoment(value).day(weekStartDay);

        return clone;
    }

    /**
   * Returns all the days in the specified month.
   *
   * @param  {Moment/Date/Number} value
   * @return {Moment[]}
   */
    getDaysInMonth(value) {
        const first = this.toMoment(value).startOf('month');
        const beforeFirst = this.toMoment(value).startOf('month').add(-1, 'days');

        const start = this.getWeekStartMoment(first);

        const result = [];

        let i = 0;

        if (
            beforeFirst.isBefore(start)
      // and it doesn't start with a full week before and the week has at least 1 day from current month (default)
      &&
      (this.props.alwaysShowPrevWeek || !start.isSame(first))
        ) {
            start.add(-1, 'weeks');
        }

        for (; i < 42; i++) {
            result.push(this.toMoment(start));
            start.add(1, 'days');
        }

        return result;
    }

    render() {
        const props = assign({}, this.props);

        this.toMoment = function(value, dateFormat) {
            return toMoment(value, dateFormat || props.dateFormat, { locale: props.locale });
        };

        TODAY = +this.toMoment().startOf('day');

        const dateFormat = props.dateFormat;
        const viewMoment = props.viewMoment = this.toMoment(props.viewDate, dateFormat);

        let weekStartDay = props.weekStartDay;

        if (weekStartDay == null) {
            weekStartDay = props.localeData._week ? props.localeData._week.dow : null;
        }

        this.weekStartDay = props.weekStartDay = weekStartDay;

        if (props.minDate && moment.isMoment(props.minDate)) {
            props.minDate.startOf('day');
        }

        props.minDate && (props.minDate = +this.toMoment(props.minDate, dateFormat));
        props.maxDate && (props.maxDate = +this.toMoment(props.maxDate, dateFormat));

        this.monthFirst = this.toMoment(viewMoment).startOf('month');
        this.monthLast = this.toMoment(viewMoment).endOf('month');

        if (props.date) {
            props.moment = this.props.range ? null : this.toMoment(props.date).startOf('day');
        }

        const daysInView = this.getDaysInMonth(viewMoment);

        return (<div className="dp-table dp-month-view" onMouseLeave={props.highlightRangeOnMouseMove && this.handleViewMouseLeave}>
            {this.renderWeekDayNames()}
            {this.renderDays(props, daysInView)}
        </div>);
    }

    handleViewMouseLeave() {
        this.state.range && this.setState({ range: null });
    }

    /**
   * Render the week number cell
   * @param  {Moment[]} days The days in a week
   * @return {React.DOM}
   */
    renderWeekNumber (props, days) {
        const firstDayOfWeek = days[0];
        const week = firstDayOfWeek.weeks();

        const weekNumberProps = {
            key: 'week',
            className: 'dp-cell dp-weeknumber',

            //week number
            week: week,

            //the days in this week
            days: days,

            date: firstDayOfWeek,
            children: week
        };

        const renderWeekNumber = props.renderWeekNumber;

        let result;

        if (renderWeekNumber) {
            result = renderWeekNumber(weekNumberProps);
        }

        if (result === undefined) {
            result = <div {...weekNumberProps} />;
        }

        return result;
    }

    /**
   * Render the given array of days
   * @param  {Moment[]} days
   * @return {React.DOM}
   */
    renderDays(props, days) {
        const nodes = days.map((date) => this.renderDay(props, date));

        const len = days.length;
        const buckets = [];
        const bucketsLen = Math.ceil(len / 7);

        let i = 0;
        let weekStart;
        let weekEnd;

        for (; i < bucketsLen; i++) {
            weekStart = i * 7;
            weekEnd = (i + 1) * 7;

            buckets.push(
                [
                    props.weekNumbers && this.renderWeekNumber(props, days.slice(weekStart, weekEnd))
                ].concat(
                    nodes.slice(weekStart, weekEnd)
                )
            );
        }

        return buckets.map((bucket, i) => <div key={'row' + i} className="dp-week dp-row">{bucket}</div>);
    }

    renderDay(props, date) {
        const dayText = FORMAT.day(date, props.dayFormat);
        const classes = ['dp-cell dp-day'];

        const dateTimestamp = +date;
        const mom = this.toMoment(date);
        const onClick = this.handleClick.bind(this, props, date, dateTimestamp);

        const range = this.state.range || this.props.range;

        let beforeMinDate;

        if (dateTimestamp === TODAY) {
            classes.push('dp-current');
        } else if (dateTimestamp < this.monthFirst) {
            classes.push('dp-prev');
        } else if (dateTimestamp > this.monthLast) {
            classes.push('dp-next');
        }


        if (props.minDate && date < props.minDate) {
            classes.push('dp-disabled dp-before-min');
            beforeMinDate = true;
        }

        let afterMaxDate;
        if (props.maxDate && date > props.maxDate) {
            classes.push('dp-disabled dp-after-max');
            afterMaxDate = true;
        }

        if (dateTimestamp === props.moment) {
            classes.push('dp-value');
        }


        if (range) {
            const start = mom;
            const end = moment(start).endOf('day');

            const [rangeStart, rangeEnd] = range;
            if (
                isInRange(start, range) ||
        isInRange(end, range) ||
        rangeStart && isInRange(rangeStart, [start, end]) ||
        rangeEnd && isInRange(rangeEnd, [start, end])
            ) {
                classes.push('dp-in-range');
            }
        }

        let weekDay = mom.day();

        if (weekDay === 0 /* Sunday */ || weekDay === 6 /* Saturday */) {
            classes.push('dp-weekend');
            props.highlightWeekends && classes.push('dp-weekend-highlight');
        }

        let renderDayProps = {
            role: 'link',
            tabIndex: 1,
            key: dayText,
            text: dayText,
            date: mom,
            moment: mom,
            className: classes.join(' '),
            style: {},
            onClick: onClick,
            onKeyUp: onEnter(onClick),
            children: dayText
        };

        if (props.range && props.highlightRangeOnMouseMove) {
            renderDayProps.onMouseEnter = this.handleDayMouseEnter.bind(this, renderDayProps);
        }

        if (beforeMinDate) {
            renderDayProps.isDisabled = true;
            renderDayProps.beforeMinDate = true;
        }
        if (afterMaxDate) {
            renderDayProps.isDisabled = true;
            renderDayProps.afterMaxDate = true;
        }

        if (typeof props.onRenderDay === 'function') {
            renderDayProps = props.onRenderDay(renderDayProps);
        }

        const defaultRenderFunction = React.DOM.div;
        const renderFunction = props.renderDay || defaultRenderFunction;

        let result = renderFunction(renderDayProps);

        if (result === undefined) {
            result = defaultRenderFunction(renderDayProps);
        }

        return result;
    }

    handleDayMouseEnter(dayProps) {
        const range = this.props.range;

        if (range && range.length === 1) {
            const [start] = range;

            this.setState({
                range: [start, dayProps.date].sort((a, b) => a - b)
            });
        } else if (this.state.range) {
            this.setState({
                range: null
            });
        }
    }

    getWeekDayNames(props) {
        props = props || this.props;

        let names = props.weekDayNames;
        const weekStartDay = this.weekStartDay;

        if (typeof names === 'function') {
            names = names(weekStartDay, props.locale);
        } else if (Array.isArray(names)) {
            names = [].concat(names);

            let index = weekStartDay;

            while (index > 0) {
                names.push(names.shift());
                index--;
            }
        }

        return names;
    }

    renderWeekDayNames() {
        const weekNumber = this.props.weekNumbers ? [this.props.weekNumberName] : [];
        const names = weekNumber.concat(this.getWeekDayNames());

        return (<div className="dp-row dp-week-day-names">
            {names.map((name, index) => <div key={index} className="dp-cell dp-week-day-name">{name}</div>)}
        </div>);
    }

    handleClick(props, date, timestamp, event) {
        if (props.minDate && timestamp < props.minDate) {
            return;
        }

        if (props.maxDate && timestamp > props.maxDate) {
            return;
        }

        event.target.value = date

        ;(props.onChange || emptyFn)(date, event);
    }
}

MonthView.getHeaderText = (moment, props) => {
    return toMoment(moment, null, { locale: props.locale }).format('MMMM YYYY');
};
