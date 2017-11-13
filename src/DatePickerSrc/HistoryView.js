import React from 'react';
import Component from 'react-class';

import assign from 'object-assign';
import toMoment from './toMoment';
import join from './join';
import joinFunctions from './joinFunctions';

import Footer from './Footer';
import YearView from './YearView';

import assignDefined from './assignDefined';
import DecadeView, {
    prepareDateProps,
    getInitialState,
    onViewDateChange,
    onActiveDateChange,
    onChange,
    navigate,
    select,
    confirm,
    gotoViewDate
} from './DecadeView';

import styles from './HistoryView.styl';

const preventDefault = (e) => {
    e.preventDefault();
};


export default class HistoryView extends Component {
    constructor(props) {
        super(props);

        this.state = getInitialState(props);
    }

    componentWillUnmount() {
        this.unmounted = true;
    }

    toMoment(date, format) {
        return toMoment(date, format, this.props);
    }

    render() {
        const dateProps = prepareDateProps(this.props, this.state);

        const props = this.p = assign({}, this.props, dateProps);

        props.children = React.Children.toArray(props.children);

        const className = join(
            props.className,
            styles.historyView
        );

        const commonProps = assignDefined({}, {
            locale: props.locale,
            theme: props.theme,
            minDate: props.minDate,
            maxDate: props.maxDate,

            viewDate: props.viewMoment,
            activeDate: props.activeDate,
            date: props.date,

            dateFormat: props.dateFormat
        });

        const yearViewProps = assign({}, commonProps);

        const decadeViewProps = assign({}, commonProps, {
            ref: view => {
                this.decadeView = view;
            }
        });


        return (<div
            className={className}
        >
            <img
                role="presentation" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAJCAYAAAA7KqwyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyppVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpGRTVFQTk5NDIwRUMxMUU3ODQzQ0JGQkE3MjZDNTNBMyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpGRTVFQTk5NTIwRUMxMUU3ODQzQ0JGQkE3MjZDNTNBMyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkZEQTFGRTI5MjBFQzExRTc4NDNDQkZCQTcyNkM1M0EzIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkZEQTFGRTJBMjBFQzExRTc4NDNDQkZCQTcyNkM1M0EzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+1aPaewAAAE5JREFUeNqUzOEJACAIhNHutnD/2ZyjKAoi6jRB/OP34O5FTJ0XrweqGEDpu0FpYMRmNlYhVPEahTCKI4SZWCHMxi+EP/EN4W98Ik2AAQAQFRX9m51NzwAAAABJRU5ErkJggg=="
                className={styles.verticalArrow}
            />
            {this.renderYearView(yearViewProps)}
            {this.renderDecadeView(decadeViewProps)}
            {this.renderFooter()}
        </div>);
    }

    renderFooter() {
        const props = this.p;
        const children = props.children;

        if (!props.footer) {
            return null;
        }

        const footerChild = children.filter(c => c && c.props && c.props.isDatePickerFooter)[0];

        if (footerChild) {
            const newFooterProps = {
                onOkClick: joinFunctions(this.onOkClick, footerChild.props.onOkClick),
                onCancelClick: joinFunctions(this.onCancelClick, footerChild.props.onCancelClick)
            };

            if (footerChild.props.centerButtons === undefined) {
                newFooterProps.centerButtons = true;
            }
            if (footerChild.props.todayButton === undefined) {
                newFooterProps.todayButton = false;
            }
            if (footerChild.props.clearButton === undefined) {
                newFooterProps.clearButton = false;
            }

            return React.cloneElement(footerChild, newFooterProps);
        }

        return (<Footer
            todayButton={false}
            clearButton={false}
            onOkClick={this.onOkClick}
            onCancelClick={this.onCancelClick}
            centerButtons
        />);
    }

    onOkClick() {
        if (this.props.onOkClick) {
            const dateMoment = this.p.activeMoment;
            const dateString = this.format(dateMoment);
            const timestamp = +dateMoment;

            this.props.onOkClick(dateString, { dateMoment, timestamp });
        }
    }

    onCancelClick() {
        if (this.props.onCancelClick) {
            this.props.onCancelClick();
        }
    }

    renderYearView(yearViewProps) {
        const props = this.p;
        const children = props.children;

        const yearViewChild = children.filter(c => c && c.props && c.props.isYearView)[0];
        const yearViewChildProps = yearViewChild ? yearViewChild.props : {};

        const tabIndex = yearViewChildProps.tabIndex == null ?
            null
            :
            yearViewChildProps.tabIndex;

        yearViewProps.tabIndex = tabIndex;

        if (props.focusYearView === false || tabIndex == null) {
            yearViewProps.tabIndex = null;
            yearViewProps.onFocus = this.onYearViewFocus;
            yearViewProps.onMouseDown = this.onYearViewMouseDown;
        }

        assign(yearViewProps, {
            // viewDate: props.moment || props.viewDate,
            onViewDateChange: joinFunctions(
                this.onViewDateChange,
                yearViewChildProps.onViewDateChange
            ),
            onActiveDateChange: joinFunctions(
                this.onActiveDateChange,
                yearViewChildProps.onActiveDateChange
            ),
            onChange: joinFunctions(
                this.handleYearViewOnChange,
                yearViewChildProps.onChange
            )
        });

        if (yearViewChild) {
            return React.cloneElement(yearViewChild, yearViewProps);
        }

        return <YearView {...yearViewProps} />;
    }

    renderDecadeView(decadeViewProps) {
        const props = this.p;
        const children = props.children;
        const decadeViewChild = children.filter(c => c && c.props && c.props.isDecadeView)[0];

        const decadeViewChildProps = decadeViewChild ? decadeViewChild.props : {};

        const tabIndex = decadeViewChildProps.tabIndex == null ?
            null
            :
            decadeViewChildProps.tabIndex;

        decadeViewProps.tabIndex = tabIndex;

        if (props.focusDecadeView === false || tabIndex == null) {
            decadeViewProps.tabIndex = null;
            decadeViewProps.onMouseDown = this.onDecadeViewMouseDown;
        }

        assign(decadeViewProps, {
            arrows: props.arrows,
            onConfirm: joinFunctions(
                this.handleDecadeViewOnConfirm,
                decadeViewChildProps.onConfirm
            ),
            onViewDateChange: joinFunctions(
                this.handleDecadeOnViewDateChange,
                decadeViewChildProps.onViewDateChange
            ),
            onActiveDateChange: joinFunctions(
                this.handleDecadeOnActiveDateChange,
                decadeViewChildProps.onActiveDateChange
            ),
            onChange: joinFunctions(
                this.handleDecadeOnChange,
                decadeViewChildProps.onChange
            )
        });

        if (decadeViewChild) {
            return React.cloneElement(decadeViewChild, decadeViewProps);
        }

        return <DecadeView {...decadeViewProps} />;
    }

    onYearViewFocus() {
        if (this.props.focusYearView === false) {
            this.focus();
        }
    }

    focus() {
        if (this.decadeView && this.props.focusDecadeView) {
            this.decadeView.focus();
        }
    }

    onYearViewMouseDown(e) {
        preventDefault(e);

        this.focus();
    }

    onDecadeViewMouseDown(e) {
        preventDefault(e);
    }

    format(mom, format) {
        format = format || this.props.dateFormat;

        return mom.format(format);
    }

    handleDecadeViewOnConfirm() {
        if (this.props.okOnEnter) {
            this.onOkClick();
        }
    }

    onKeyDown(event) {
        if (event.key === 'Escape') {
            return this.onCancelClick();
        }

        if (this.decadeView) {
            this.decadeView.onKeyDown(event);
        }

        return undefined;
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

    handleDecadeOnViewDateChange(dateString, { dateMoment, timestamp }) {
        const props = this.p;
        const currentViewMoment = props.viewMoment;

        if (currentViewMoment) {
            dateMoment.set('month', currentViewMoment.get('month'));
            dateString = this.format(dateMoment);
            timestamp = +dateMoment;
        }

        this.onViewDateChange(dateString, { dateMoment, timestamp });
    }

    handleDecadeOnActiveDateChange(dateString, { dateMoment, timestamp }) {
        const props = this.p;
        const currentViewMoment = props.viewMoment;

        if (currentViewMoment) {
            dateMoment.set('month', currentViewMoment.get('month'));
            dateString = this.format(dateMoment);
            timestamp = +dateMoment;
        }

        this.onActiveDateChange(dateString, { dateMoment, timestamp });
    }

    handleDecadeOnChange(dateString, { dateMoment, timestamp }, event) {
        const props = this.p;
        const currentViewMoment = props.viewMoment;

        if (currentViewMoment) {
            dateMoment.set('month', currentViewMoment.get('month'));
            dateString = this.format(dateMoment);
            timestamp = +dateMoment;
        }

        this.onChange(dateString, { dateMoment, timestamp }, event);
    }

    handleYearViewOnChange(dateString, { dateMoment, timestamp }, event) {
        const props = this.p;
        const currentMoment = props.moment;

        if (currentMoment) {
            dateMoment.set('year', currentMoment.get('year'));
            dateString = this.format(dateMoment);
            timestamp = +dateMoment;
        }

        this.onChange(dateString, { dateMoment, timestamp }, event);
    }

    onViewDateChange(dateString, { dateMoment, timestamp }) {
        return onViewDateChange.call(this, { dateMoment, timestamp });
    }

    gotoViewDate({ dateMoment, timestamp }) {
        return gotoViewDate.call(this, { dateMoment, timestamp });
    }

    onActiveDateChange(dateString, { dateMoment, timestamp }) {
        return onActiveDateChange.call(this, { dateMoment, timestamp });
    }

    onChange(dateString, { dateMoment, timestamp }, event) {
        return onChange.call(this, { dateMoment, timestamp }, event);
    }
}

HistoryView.defaultProps = {
    okOnEnter: true,

    footer: true,
    theme: 'default',
    navigation: true,

    focusYearView: false,
    focusDecadeView: true,

    dateFormat: 'YYYY-MM-DD',

    adjustDateStartOf: 'month',
    adjustMinDateStartOf: 'month',
    adjustMaxDateStartOf: 'month'
};
