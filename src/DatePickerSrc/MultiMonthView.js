import React from 'react';
import Component from 'react-class';

import assign from 'object-assign';

import clampRange from './clampRange';
import NavBar from './NavBar';
import toMoment from './toMoment';
import join from './join';
import isInRange from './utils/isInRange';

import { getDaysInMonthView } from './BasicMonthView';
import MonthView, { renderFooter } from './MonthView';

const times = (count) => [...new Array(count)].map((v, i) => i);

const prepareDate = function (props, state) {
    if (props.range) {
        return null;
    }

    return props.date === undefined ?
        state.date :
        props.date;
};

const prepareViewDate = function (props, state) {
    return props.viewDate === undefined ?
        state.viewDate :
        state.propViewDate || props.viewDate;
};

const prepareRange = function (props, state) {
    return props.range && props.range.length ? props.range : state.range;
};

const prepareActiveDate = function (props, state) {
    const fallbackDate = prepareDate(props, state) || ((prepareRange(props, state) || [])[0]);

    const activeDate = props.activeDate === undefined ?
        // only fallback to date if activeDate not specified
        state.activeDate || fallbackDate :
        props.activeDate;

    if (activeDate && props.inViewStart && props.inViewEnd && props.constrainActiveInView) {
        const activeMoment = this.toMoment(activeDate);

        if (!isInRange(activeMoment, [props.inViewStart, props.inViewEnd])) {
            const date = fallbackDate;
            const dateMoment = this.toMoment(date);

            if (date && isInRange(dateMoment, [props.inViewStart, props.inViewEnd])) {
                return date;
            }

            return null;
        }
    }

    return activeDate;
};

const prepareViews = function (props) {
    const daysInView = [];

    const viewMoments = [];

    const viewMoment = props.viewMoment;

    let index = 0;
    const size = props.size;

    while (index < size) {
        const mom = this.toMoment(viewMoment).startOf('day').add(index, 'month');
        const days = getDaysInMonthView(mom, props);

        viewMoments.push(mom);
        daysInView.push(days);

        index++;
    }

    props.daysInView = daysInView;
    props.viewMoments = viewMoments;

    const lastViewDays = daysInView[size - 1];

    props.inViewStart = daysInView[0][0];
    props.inViewEnd = lastViewDays[lastViewDays.length - 1];
};

export const renderNavBar = function(config, navBarProps) {
    const props = this.props;
    const { index, viewMoment } = config;

    navBarProps = assign({}, navBarProps, {
        secondary: true,

        minDate: config.minDate || props.minDate,
        maxDate: config.maxDate || props.maxDate,

        renderNavNext: config.renderHiddenNav || this.renderHiddenNav,
        renderNavPrev: config.renderHiddenNav || this.renderHiddenNav,

        viewMoment,

        onViewDateChange: config.onViewDateChange || this.onNavViewDateChange,
        onUpdate: config.onUpdate || this.updateViewMoment,

        enableHistoryView: props.enableHistoryView
    });

    if (index === 0) {
        delete navBarProps.renderNavPrev;
    }

    if (index === props.perRow - 1) {
        delete navBarProps.renderNavNext;
    }

    return <NavBar {...navBarProps} />;
};

export default class MultiMonthView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hoverRange: null,
            range: props.defaultRange,
            date: props.defaultDate,
            activeDate: props.defaultActiveDate,
            viewDate: props.defaultViewDate
        };
    }

    componentWillMount() {
        this.updateToMoment(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.locale !== this.props.locale || nextProps.dateFormat !== this.props.dateFormat) {
            this.updateToMoment(nextProps);
        }

    // if (nextProps.viewDate && !nextProps.forceViewUpdate){

    //   //this is here in order not to change view if already in view
    //   const viewMoment = this.toMoment(nextProps.viewDate)

    //   if (this.isInRange(viewMoment) && !nextProps.forceViewUpdate){
    //     console.log(this.format(viewMoment), this.format(this.p.viewStart),
    // this.format(this.p.viewEnd))
    //     this.setState({
    //       propViewDate: this.p.viewMoment
    //     })
    //   } else {
    //     debugger
    //     this.setState({
    //       propViewDate: null
    //     })
    //   }
    // }
    }

    updateToMoment(props) {
        this.toMoment = (value, dateFormat) => {
            return toMoment(value, {
                locale: props.locale,
                dateFormat: dateFormat || props.dateFormat
            });
        };
    }

    prepareProps(thisProps, state) {
        const props = assign({}, thisProps);
        state = state || this.state;

        props.viewMoment = this.toMoment(prepareViewDate(props, state));

        // viewStart is the first day of the first month displayed
        // viewEnd is the last day of the last month displayed
        props.viewStart = this.toMoment(props.viewMoment).startOf('month');
        props.viewEnd = this.toMoment(props.viewStart).add(props.size - 1, 'month').endOf('month');

        // but we also have inViewStart, which can be a day before viewStart
        // which is in displayed as belonging to the prev month
        // but is displayed in the current view since it's on the same week
        // as viewStart
        //
        // same for inViewEnd, which is a day after viewEnd - the last day in the same week
        prepareViews.call(this, props);

        const activeDate = prepareActiveDate.call(this, props, state);

        if (activeDate) {
            props.activeDate = +this.toMoment(activeDate);
        }

        props.date = prepareDate(props, state);

        if (!props.date) {
            const range = prepareRange(props, state);

            if (range) {
                props.range = range.map(d => this.toMoment(d).startOf('day'));
                props.rangeStart = state.rangeStart || (props.range.length === 1 ? props.range[0] : null);
            }
        }

        return props;
    }

    render() {
        this.views = [];
        const props = this.p = this.prepareProps(this.props, this.state);
        const size = props.size;

        const rowCount = Math.ceil(size / props.perRow);
        const children = times(rowCount).map(this.renderRow).filter(x => !!x);

        const className = join(
            props.className,
            'react-date-picker__multi-month-view',
            props.theme && `react-date-picker__multi-month-view--theme-${props.theme}`
        );

        const footer = renderFooter(props, this);

        if (footer) {
            children.push(footer);
        }


        return (<div
            column
            inline
            alignItems="stretch"
            wrap={false}
            className={className}
        >{children}</div>);
    }

    renderRow(rowIndex) {
        const props = this.p;
        const viewProps = assign({}, this.p);

        delete viewProps.forceViewUpdate;
        delete viewProps.index;
        delete viewProps.inViewEnd;
        delete viewProps.inViewStart;
        delete viewProps.navigate;
        delete viewProps.perRow;
        delete viewProps.viewEnd;
        delete viewProps.viewMoments;
        delete viewProps.viewStart;

        const children = times(props.perRow).map(i => {
            const index = (rowIndex * props.perRow) + i;

            if (index >= props.size) {
                return null;
            }

            return this.renderView(viewProps, index, props.size);
        });

        return (<div
            inline row wrap={false}
        >{children}</div>);
    }

    renderView(viewProps, index, size) {
        const props = this.p;
        const viewMoment = props.viewMoments[index];

        let range;

        if (props.range) {
            range = props.rangeStart && props.range.length === 0 ?
                [props.rangeStart] :
                props.range;
        }

        return (<MonthView
            ref={view => {
                this.views[index] = view;
            }}
            constrainViewDate={false}
            {...viewProps}

            className={null}

            index={index}

            footer={false}
            constrainActiveInView={false}

            navigate={this.onMonthNavigate.bind(this, index)}
            hoverRange={this.state.hoverRange}
            onHoverRangeChange={this.setHoverRange}

            activeDate={props.activeDate}

            onActiveDateChange={this.onActiveDateChange}
            onViewDateChange={this.onAdjustViewDateChange}

            date={props.date}
            defaultDate={null}
            onChange={this.onChange}

            range={range}
            defaultRange={null}
            onRangeChange={this.onRangeChange}

            viewMoment={viewMoment}

            insideMultiView

            daysInView={props.daysInView[index]}

            showDaysBeforeMonth={index === 0}
            showDaysAfterMonth={index === size - 1}

            select={this.select}

            renderNavBar={this.props.navigation && (this.props.renderNavBar || this.renderNavBar).bind(this, { index, viewMoment })}
        />);
    }

    onFooterTodayClick() {
        this.views[0].onFooterTodayClick();
    }

    onFooterClearClick() {
        this.views[0].onFooterClearClick();
    }

    onFooterOkClick() {
        this.views[0].onFooterOkClick();
    }

    onFooterCancelClick() {
        this.views[0].onFooterCancelClick();
    }

    isFocused() {
        const firstView = this.views[0];

        if (firstView) {
            return firstView.isFocused();
        }

        return false;
    }

    focus() {
        const firstView = this.views[0];

        if (firstView) {
            firstView.focus();
        }
    }

    setHoverRange(hoverRange) {
        this.setState({
            hoverRange
        });
    }

    select({ dateMoment, timestamp }) {
    // if (!dateMoment) {
    //   return
    // }

        const props = this.p;

        // TODO check why this was needed
        // if (!isInRange(dateMoment, { range: visibleRange, inclusive: true })) {
        //   return
        // }

        this.onAdjustViewDateChange({ dateMoment, timestamp });
        this.onActiveDateChange({ dateMoment, timestamp });

        const range = props.range;

        if (range) {
            this.selectRange({ dateMoment, timestamp });
        } else {
            this.onChange({ dateMoment, timestamp }, event);
        }
    }

    selectRange({ dateMoment, timestamp }) {
        return MonthView.prototype.selectRange.call(this, { dateMoment, timestamp });
    }

    onRangeChange(range) {
        return MonthView.prototype.onRangeChange.call(this, range);
    }

    onViewKeyDown(...args) {
        const view = this.views[0];
        if (view) {
            view.onViewKeyDown(...args);
        }
    }

    renderNavBar(config, navBarProps) {
        return renderNavBar.call(this, config, navBarProps);
    }

    onMonthNavigate(index, dir, event, getNavigationDate) {
        const props = this.p;

        event.preventDefault();

        if (!props.activeDate) {
            return;
        }

        const key = event.key;

        const homeEndDate = key === 'Home' ? props.viewStart : props.viewEnd;

        const mom = key === 'Home' || key === 'End' ?
            homeEndDate :
            props.activeDate;

        const nextMoment = getNavigationDate(dir, this.toMoment(mom));

        const viewMoment = this.toMoment(nextMoment);

        this.onActiveDateChange({
            dateMoment: nextMoment,
            timestamp: +nextMoment
        });

        if (this.isInRange(viewMoment)) {
            return;
        }

        if (viewMoment.isAfter(props.viewEnd)) {
            viewMoment.add(-props.size + 1, 'month');
        }

        this.onViewDateChange({
            dateMoment: viewMoment,
            timestamp: +viewMoment
        });
    }

    onAdjustViewDateChange({ dateMoment, timestamp }) {
        const props = this.p;

        let update = dateMoment == null;

        if (dateMoment && dateMoment.isAfter(props.viewEnd)) {
            dateMoment = this.toMoment(dateMoment).add(-props.size + 1, 'month');
            timestamp = +dateMoment;
            update = true;
        } else if (dateMoment && dateMoment.isBefore(props.viewStart)) {
            update = true;
        }

        if (update) {
            this.onViewDateChange({ dateMoment, timestamp });
        }
    }

    updateViewMoment(dateMoment, dir) {
        const sign = dir < 0 ? -1 : 1;
        const abs = Math.abs(dir);

        const newMoment = this.toMoment(this.p.viewStart);

        newMoment.add(sign, abs === 1 ? 'month' : 'year');

        return newMoment;
    }

    renderHiddenNav(props) {
        return <div {...props} style={{ visibility: 'hidden' }} />;
    }

    isInRange(moment) {
        return isInRange(moment, [this.p.viewStart, this.p.viewEnd]);
    }

    isInView(moment) {
        return this.isInRange(moment);
    }

    onNavViewDateChange(dateString, { dateMoment, timestamp }) {
        this.onViewDateChange({ dateMoment, timestamp });
    }

    onViewDateChange({ dateMoment, timestamp }) {
        if (this.props.viewDate === undefined) {
            this.setState({
                viewDate: timestamp
            });
        }

        if (this.props.onViewDateChange) {
            const dateString = this.format(dateMoment);
            this.props.onViewDateChange(dateString, { dateMoment, dateString, timestamp });
        }
    }

    onActiveDateChange({ dateMoment, timestamp }) {
        const valid = this.views.reduce((isValid, view) => {
            return isValid && view.isValidActiveDate(timestamp);
        }, true);

        if (!valid) {
            return;
        }

        const props = this.p;
        const range = props.range;

        if (range && props.rangeStart) {
            this.setState({
                rangeStart: props.rangeStart,
                range: clampRange([props.rangeStart, dateMoment])
            });
        }

        if (this.props.activeDate === undefined) {
            this.setState({
                activeDate: timestamp
            });
        }

        if (this.props.onActiveDateChange) {
            const dateString = this.format(dateMoment);
            this.props.onActiveDateChange(dateString, { dateMoment, dateString, timestamp });
        }
    }

    gotoViewDate({ dateMoment, timestamp }) {
        if (!timestamp) {
            timestamp = +dateMoment;
        }

        this.onViewDateChange({ dateMoment, timestamp });
        this.onActiveDateChange({ dateMoment, timestamp });
    }

    format(mom) {
        return mom == null ? '' : mom.format(this.props.dateFormat);
    }

    onChange({ dateMoment, timestamp }, event) {
        if (this.props.date === undefined) {
            this.setState({
                date: timestamp
            });
        }

        if (this.props.onChange) {
            const dateString = this.format(dateMoment);
            this.props.onChange(dateString, { dateMoment, dateString, timestamp }, event);
        }
    }

    getViewSize() {
        return this.props.size;
    }
}

MultiMonthView.defaultProps = {
    perRow: 2,
    size: 2,

    enableHistoryView: true,

    footerClearDate: null,

    isDatePicker: true,
    forceViewUpdate: false,

    navigation: true,
    theme: 'default',

    constrainActiveInView: true,

    dateFormat: 'YYYY-MM-DD'
};

MultiMonthView.propTypes = {
};
