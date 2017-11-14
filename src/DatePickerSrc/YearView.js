import React from 'react';
import Component from 'react-class';

import assign from 'object-assign';

import times from './utils/times';
import join from './join';
import toMoment from './toMoment';
import {
    prepareDateProps,
    getInitialState,
    onKeyDown,
    onViewDateChange,
    onActiveDateChange,
    onChange,
    navigate,
    select,
    confirm,
    gotoViewDate
} from './DecadeView';

import styles from './YearView.styl';


const NAV_KEYS = {
    ArrowUp(mom) {
        if (mom.get('month') >= 4) {
            mom.add(-4, 'month');
        }

        return mom;
    },
    ArrowDown(mom) {
        if (mom.get('month') <= 7) {
            mom.add(4, 'month');
        }

        return mom;
    },
    ArrowLeft(mom) {
        if (mom.get('month') >= 1) {
            mom.add(-1, 'month');
        }

        return mom;
    },
    ArrowRight(mom) {
        if (mom.get('month') <= 10) {
            mom.add(1, 'month');
        }

        return mom;
    },
    Home(mom) {
        return mom.startOf('year').startOf('month');
    },
    End(mom) {
        return mom.endOf('year').startOf('month');
    },

    PageUp(mom) {
        const month = mom.get('month') - 4;
        const extra4 = month - 4;

        if (month >= 0) {
            if (extra4 >= 0) {
                return mom.set('month', extra4);
            }

            return mom.set('month', month);
        }

        return mom;
    },

    PageDown(mom) {
        const month = mom.get('month') + 4;
        const extra4 = month + 4;

        if (month <= 11) {
            if (extra4 <= 11) {
                return mom.set('month', extra4);
            }

            return mom.set('month', month);
        }

        return mom;
    }
};

export default class YearView extends Component {
    constructor(props) {
        super(props);

        this.state = getInitialState(props);
    }

    /**
   * Returns all the days in the specified month.
   *
   * @param  {Moment/Date/Number} value
   * @return {Moment[]}
   */
    getMonthsInYear(value) {
        const start = this.toMoment(value).startOf('year');

        return times(12).map(i => this.toMoment(start).add(i, 'month'));
    }

    toMoment(date) {
        return toMoment(date, this.props);
    }

    render() {
        const props = this.p = assign({}, this.props);

        if (props.onlyCompareMonth) {
            // props.adjustDateStartOf = null
        }

        const dateProps = prepareDateProps(props, this.state);

        assign(props, dateProps);

        const className = join(
            props.className,
            styles.yearView
        );

        const monthsInView = this.getMonthsInYear(props.viewMoment);

        return (<div
            onKeyDown={this.onKeyDown}
            className={className}
        >
            {this.renderMonths(props, monthsInView)}
        </div>);
    }

    renderMonths(props, months) {
        const nodes = months.map(monthMoment => this.renderMonth(props, monthMoment));

        const buckets = times(Math.ceil(nodes.length / 4)).map(i => {
            return nodes.slice(i * 4, (i + 1) * 4);
        });

        const className = styles.row;

        return buckets.map((bucket, i) => (<div
            key={`row_${i}`}
            className={className}
        >
            {bucket}
        </div>));
    }

    format(mom, format) {
        format = format || this.props.monthFormat;

        return mom.format(format);
    }

    renderMonth(props, dateMoment) {
        const index = dateMoment.get('month');

        const monthText = props.monthNames ?
            props.monthNames[index] || this.format(dateMoment) :
            this.format(dateMoment);

        const timestamp = +dateMoment;

        const isActiveDate = props.onlyCompareMonth && props.activeMoment ?
            dateMoment.get('month') === props.activeMoment.get('month') :
            timestamp === props.activeDate;

        const isValue = props.onlyCompareMonth && props.moment ?
            dateMoment.get('month') === props.moment.get('month') :
            timestamp === props.timestamp;

        const disabled = props.minDate != null && timestamp < props.minDate
      ||
      props.maxDate != null && timestamp > props.maxDate;

        const className = join(
            styles.month,
            !disabled && isActiveDate && styles.active,
            isValue && styles.value,
            disabled && styles.disabled
        );

        const onClick = disabled ?
            null :
            this.handleClick.bind(this, {
                dateMoment,
                timestamp
            });

        return (<div
            key={monthText}
            className={className}
            onClick={onClick}
        >
            <div className={styles.monthText}>
                {monthText}
            </div>
        </div>);
    }

    handleClick({ timestamp, dateMoment }, event) {
        event.target.value = timestamp;

        this.select({ dateMoment, timestamp }, event);
    }

    onKeyDown(event) {
        return onKeyDown.call(this, event);
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
        this.focus();
    }
}

YearView.defaultProps = {
    isYearView: true,
    navKeys: NAV_KEYS,
    constrainViewDate: true,
    theme: 'default',
    monthFormat: 'MMM',
    dateFormat: 'YYYY-MM-DD',

    onlyCompareMonth: true,

    adjustDateStartOf: 'month',
    adjustMinDateStartOf: 'month',
    adjustMaxDateStartOf: 'month'
};
