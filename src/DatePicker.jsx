import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import MonthView from 'react-date-picker/lib/MonthView';
import uncontrollable from 'uncontrollable';
import styles from './index.styl';

class DatePicker extends PureComponent {
    static propTypes = {
        locale: PropTypes.string,

        date: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.string
        ]),

        // The minimum selectable date. When set to null, there is no minimum.
        // Types supported:
        // * Date: A date object containing the minimum date.
        // * String: A date string in ISO 8601 format (i.e. YYYY-MM-DD).
        minDate: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.string
        ]),

        // The maximum selectable date. When set to null, there is no maximum.
        // Types supported:
        // * Date: A date object containing the maximum date.
        // * String: A date string in ISO 8601 format (i.e. YYYY-MM-DD).
        maxDate: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.string
        ]),

        // Called when a date is selected.
        onSelect: PropTypes.func,

        renderDay: PropTypes.func,

        navArrows: PropTypes.shape({
            prev: PropTypes.node,
            next: PropTypes.node
        })
    };
    static defaultProps = {
        locale: 'en',
        date: null,
        minDate: null,
        maxDate: null,
        onSelect: () => {},
        renderDay: (day, locale) => {
            if (typeof day === 'object' && typeof day.format === 'function') {
                return day.format('D', locale);
            }

            return day;
        },
        navArrows: {
            prev: <i className="fa fa-angle-left" />,
            next: <i className="fa fa-angle-right" />
        }
    };

    renderDay = (props) => {
        const { locale, renderDay } = this.props;

        if (!renderDay) {
            return null;
        }

        const day = renderDay(props.dateMoment, locale);
        const innerClassName = props.children && props.children.props && props.children.props.className || '';

        return (
            <div
                className={props.className}
                key={props.key}
                onClick={props.onClick}
            >
                <div className={innerClassName}>{day}</div>
            </div>
        );
    };

    render() {
        const {
            locale,
            date,
            minDate,
            maxDate,
            onSelect,
            navArrows,
            className,
            ...props
        } = this.props;

        delete props.renderDay;

        return (
            <MonthView
                {...props}
                className={cx(className, styles.datePickerContainer)}
                navBarArrows={{
                    prev: navArrows.prev,
                    next: navArrows.next
                }}
                locale={locale}
                date={date}
                minDate={minDate}
                maxDate={maxDate}
                onChange={onSelect}
                renderDay={this.renderDay}
                showDaysBeforeMonth={true}
                showDaysAfterMonth={true}
                enableHistoryView={true}
                highlightWeekends={true}
                highlightToday={true}
                weekNumbers={false}
                footer={false}
            />
        );
    }
}

export default uncontrollable(DatePicker, {
    // Define the pairs of prop/handlers you want to be uncontrollable
    date: 'onSelect'
});
