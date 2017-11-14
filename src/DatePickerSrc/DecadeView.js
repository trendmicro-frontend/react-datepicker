import React from 'react';
import { findDOMNode } from 'react-dom';
import Component from 'react-class';

import assign from 'object-assign';
import moment from 'moment';

import times from './utils/times';
import toMoment from './toMoment';
import join from './join';
import styles from './DecadeView.styl';
import ON_KEY_DOWN from './MonthView/onKeyDown';


const ARROWS = {
    prev: <svg height="24" viewBox="0 0 24 24" width="24">
        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        <path d="M0 0h24v24H0z" fill="none" />
    </svg>,

    next: <svg height="24" viewBox="0 0 24 24" width="24">
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
        <path d="M0 0h24v24H0z" fill="none" />
    </svg>
};


const getDecadeStartYear = (mom) => {
    const year = mom.get('year');

    return year - 1;
};

const getDecadeEndYear = (mom) => {
    return getDecadeStartYear(mom) + 2;
};

const NAV_KEYS = {
    ArrowUp(mom) {
        return mom.add(-2, 'year');
    },
    ArrowDown(mom) {
        return mom.add(2, 'year');
    },
    ArrowLeft(mom) {
        return mom.add(-1, 'year');
    },
    ArrowRight(mom) {
        return mom.add(1, 'year');
    },
    Home(mom) {
        return mom.set('year', getDecadeStartYear(mom));
    },
    End(mom) {
        return mom.set('year', getDecadeEndYear(mom));
    },
    PageUp(mom) {
        return mom.add(-3, 'year');
    },
    PageDown(mom) {
        return mom.add(3, 'year');
    }
};

const isDateInMinMax = (timestamp, props) => {
    if (props.minDate && timestamp < props.minDate) {
        return false;
    }

    if (props.maxDate && timestamp > props.maxDate) {
        return false;
    }

    return true;
};

const isValidActiveDate = (timestamp, props) => {
    if (!props) {
        throw new Error('props is mandatory in isValidActiveDate');
    }

    return isDateInMinMax(timestamp, props);
};

const select = function ({ dateMoment, timestamp }, event) {
    if (this.props.select) {
        return this.props.select({ dateMoment, timestamp }, event);
    }

    if (!timestamp) {
        timestamp = +dateMoment;
    }

    this.gotoViewDate({ dateMoment, timestamp });
    this.onChange({ dateMoment, timestamp }, event);

    return undefined;
};

const confirm = function (date, event) {
    event.preventDefault();

    if (this.props.confirm) {
        return this.props.confirm(date, event);
    }

    const dateMoment = this.toMoment(date);
    const timestamp = +dateMoment;

    this.select({ dateMoment, timestamp }, event);

    if (this.props.onConfirm) {
        this.props.onConfirm({ dateMoment, timestamp });
    }

    return undefined;
};

const onActiveDateChange = function ({ dateMoment, timestamp }) {
    if (!isValidActiveDate(timestamp, this.p)) {
        return;
    }

    if (this.props.activeDate === undefined) {
        this.setState({
            activeDate: timestamp
        });
    }

    if (this.props.onActiveDateChange) {
        const dateString = this.format(dateMoment);
        this.props.onActiveDateChange(dateString, { dateMoment, timestamp, dateString });
    }
};

const onViewDateChange = function ({ dateMoment, timestamp }) {
    if (dateMoment && timestamp === undefined) {
        timestamp = +dateMoment;
    }

    if (this.props.constrainViewDate && !isDateInMinMax(timestamp, this.p)) {
        return;
    }

    if (this.props.viewDate === undefined) {
        this.setState({
            viewDate: timestamp
        });
    }

    if (this.props.onViewDateChange) {
        const dateString = this.format(dateMoment);
        this.props.onViewDateChange(dateString, { dateMoment, dateString, timestamp });
    }
};

const onChange = function ({ dateMoment, timestamp }, event) {
    if (this.props.date === undefined) {
        this.setState({
            date: timestamp
        });
    }

    if (this.props.onChange) {
        const dateString = this.format(dateMoment);
        this.props.onChange(dateString, { dateMoment, timestamp, dateString }, event);
    }
};

const navigate = function (direction, event) {
    const props = this.p;

    const getNavigationDate = (dir, date, dateFormat) => {
        const mom = moment.isMoment(date) ? date : this.toMoment(date, dateFormat);

        if (typeof dir === 'function') {
            return dir(mom);
        }

        return mom;
    };

    if (props.navigate) {
        return props.navigate(direction, event, getNavigationDate);
    }

    event.preventDefault();

    if (props.activeDate) {
        const nextMoment = getNavigationDate(direction, props.activeDate);

        this.gotoViewDate({ dateMoment: nextMoment });
    }

    return undefined;
};

const gotoViewDate = function ({ dateMoment, timestamp }) {
    if (!timestamp) {
        timestamp = dateMoment == null ? null : +dateMoment;
    }

    this.onViewDateChange({ dateMoment, timestamp });
    this.onActiveDateChange({ dateMoment, timestamp });
};

const prepareDate = function (props, state) {
    return props.date === undefined ?
        state.date :
        props.date;
};

const prepareViewDate = function (props, state) {
    const viewDate = props.viewDate === undefined ?
        state.viewDate :
        props.viewDate;

    if (!viewDate && props.date) {
        return props.date;
    }

    return viewDate;
};

const prepareActiveDate = function (props, state) {
    const activeDate = props.activeDate === undefined ?
        state.activeDate || prepareDate(props, state) :
        props.activeDate;

    return activeDate;
};

const prepareMinMax = function (props) {
    const { minDate, maxDate } = props;

    const result = {};

    if (minDate != null) {
        result.minDateMoment = toMoment(
            props.minDate,
            props
        ).startOf(props.adjustMinDateStartOf);

        result.minDate = +result.minDateMoment;
    }

    if (maxDate != null) {
        result.maxDateMoment = toMoment(
            props.maxDate,
            props
        ).endOf(props.adjustMaxDateStartOf);

        result.maxDate = +result.maxDateMoment;
    }

    return result;
};

const prepareDateProps = function (props, state) {
    const result = {};

    assign(result, prepareMinMax(props));

    result.date = prepareDate(props, state);
    result.viewDate = prepareViewDate(props, state);

    const activeDate = prepareActiveDate(props, state);

    if (result.date != null) {
        result.moment = toMoment(result.date, props);
        if (props.adjustDateStartOf) {
            result.moment.startOf(props.adjustDateStartOf);
        }
        result.timestamp = +result.moment;
    }

    if (activeDate) {
        result.activeMoment = toMoment(activeDate, props);
        if (props.adjustDateStartOf) {
            result.activeMoment.startOf(props.adjustDateStartOf);
        }
        result.activeDate = +result.activeMoment;
    }

    let viewMoment = toMoment(result.viewDate, props);

    if (props.constrainViewDate &&
    result.minDate != null &&
    viewMoment.isBefore(result.minDate)
    ) {
        result.minConstrained = true;
        viewMoment = toMoment(result.minDate, props);
    }

    if (props.constrainViewDate &&
    result.maxDate != null &&
    viewMoment.isAfter(result.maxDate)
    ) {
        result.maxConstrained = true;
        viewMoment = toMoment(result.maxDate, props);
    }

    if (props.adjustDateStartOf) {
        viewMoment.startOf(props.adjustDateStartOf);
    }

    result.viewMoment = viewMoment;

    return result;
};

const getInitialState = (props) => {
    return {
        date: props.defaultDate,
        activeDate: props.defaultActiveDate,
        viewDate: props.defaultViewDate
    };
};

export default class DecadeView extends Component {
    constructor(props) {
        super(props);

        this.state = getInitialState(props);
    }

    getYearsInDecade(value) {
        const year = getDecadeStartYear(this.toMoment(value));

        const start = this.toMoment(`${year}`, 'YYYY').startOf('year');

        return times(3).map(i => {
            return this.toMoment(start).add(i, 'year');
        });
    }

    toMoment(date, format) {
        return toMoment(date, format, this.props);
    }

    render() {
        const props = this.p = assign({}, this.props);

        if (props.onlyCompareYear) {
            // props.adjustDateStartOf = null
        }

        const dateProps = prepareDateProps(props, this.state);

        assign(props, dateProps);

        const yearsInView = this.getYearsInDecade(props.viewMoment);

        let children = this.renderYears(props, yearsInView);

        if (props.navigation) {
            children = [
                this.renderNav(-1),
                <div className={styles.years}>
                    {children}
                </div>,
                this.renderNav(1)
            ];
        }

        return (<div
            onKeyDown={this.onKeyDown}
            className={styles.decadeView}
        >
            {children}
        </div>);
    }

    renderNav(dir) {
        const props = this.p;

        const name = dir === -1 ? 'prev' : 'next';
        const navMoment = this.toMoment(props.viewMoment).add(dir * 2, 'year');

        const disabled = dir === -1 ?
            props.minDateMoment && getDecadeEndYear(navMoment) < getDecadeEndYear(props.minDateMoment) :
            props.maxDateMoment && getDecadeEndYear(navMoment) > getDecadeEndYear(props.maxDateMoment);

        const className = join(
            styles.arrow,
            styles[`arrow-${name}`],
            disabled && styles.disabled
        );

        const arrow = props.arrows[name] || ARROWS[name];

        const arrowProps = {
            className,
            onClick: !disabled ? () => this.onViewDateChange({ dateMoment: navMoment }) : null,
            children: arrow,
            disabled
        };

        if (props.renderNavigation) {
            return props.renderNavigation(arrowProps, props);
        }

        // const arrowClassName = 'year-arrow-' + (dir === -1) ? 'left' : 'right';

        return <div {...arrowProps} />;
    }

    renderYears(props, years) {
        const nodes = years.map(this.renderYear);

        const perRow = props.perRow;
        const buckets = times(Math.ceil(nodes.length / perRow)).map(i => {
            return nodes.slice(i * perRow, (i + 1) * perRow);
        });

        return buckets.map((bucket, i) => (<div
            key={`row_${i}`}
            className={styles.row}
        >
            {bucket}
        </div>));
    }

    renderYear(dateMoment) {
        const props = this.p;
        const yearText = this.format(dateMoment);

        const timestamp = +dateMoment;

        const isActiveDate = props.onlyCompareYear && props.activeMoment ?
            dateMoment.get('year') === props.activeMoment.get('year') :
            timestamp === props.activeDate;

        const isValue = props.onlyCompareYear && props.moment ?
            dateMoment.get('year') === props.moment.get('year') :
            timestamp === props.timestamp;

        const className = join(
            styles.year,
            isActiveDate && styles.active,
            isValue && styles.value,
            props.minDate != null && timestamp < props.minDate && styles.disabled,
            props.maxDate != null && timestamp > props.maxDate && styles.disabled
        );

        const onClick = this.handleClick.bind(this, {
            dateMoment,
            timestamp
        });

        return (<div
            key={yearText}
            className={className}
            onClick={onClick}
        >
            {yearText}
        </div>);
    }

    format(mom, format) {
        format = format || this.props.yearFormat;

        return mom.format(format);
    }

    handleClick({ timestamp, dateMoment }, event) {
        event.target.value = timestamp;

        const props = this.p;
        if (props.minDate && timestamp < props.minDate) {
            return;
        }

        if (props.maxDate && timestamp > props.maxDate) {
            return;
        }

        this.select({ dateMoment, timestamp }, event);
    }

    onKeyDown(event) {
        return ON_KEY_DOWN.call(this, event);
    }

    confirm(date, event) {
        return confirm.call(this, date, event);
    }

    navigate(direction, event) {
        return navigate.call(this, direction, event);
    }

    select({ dateMoment, timestamp }, event) {
        return select.call(this, { dateMoment, timestamp }, event);
    }

    onViewDateChange({ dateMoment, timestamp }) {
        return onViewDateChange.call(this, { dateMoment, timestamp });
    }

    gotoViewDate({ dateMoment, timestamp }) {
        return gotoViewDate.call(this, { dateMoment, timestamp });
    }

    onActiveDateChange({ dateMoment, timestamp }) {
        return onActiveDateChange.call(this, { dateMoment, timestamp });
    }

    onChange({ dateMoment, timestamp }, event) {
        return onChange.call(this, { dateMoment, timestamp }, event);
    }

    focus() {
        findDOMNode(this).focus();
    }
}

DecadeView.defaultProps = {
    isDecadeView: true,
    arrows: {},
    navigation: true,
    constrainViewDate: true,
    navKeys: NAV_KEYS,
    theme: 'default',
    yearFormat: 'YYYY',
    dateFormat: 'YYYY-MM-DD',
    perRow: 5,

    onlyCompareYear: true,

    adjustDateStartOf: 'year',
    adjustMinDateStartOf: 'year',
    adjustMaxDateStartOf: 'year'
};

export {
    onChange,
    onViewDateChange,
    onActiveDateChange,
    select,
    confirm,
    gotoViewDate,
    navigate,

    ON_KEY_DOWN as onKeyDown,

    prepareActiveDate,
    prepareViewDate,
    prepareMinMax,
    prepareDateProps,
    prepareDate,

    isDateInMinMax,
    isValidActiveDate,

    getInitialState
};
