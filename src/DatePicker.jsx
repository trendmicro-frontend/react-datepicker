import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { MonthView } from 'react-date-picker';
import 'react-date-picker/index.css';
import styles from './index.styl';

class DatePicker extends PureComponent {
    static defaultProps = {
        locale: 'en',
        date: null,
        startDate: null,
        endDate: null,
        onChange: (date /* moment */) => {},
        renderDay: (day, /* moment */ locale) => {
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
    static propTypes = {
        locale: PropTypes.string,
        date: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.string
        ]),
        startDate: PropTypes.object,
        endDate: PropTypes.object,
        onChange: PropTypes.func,
        renderDay: PropTypes.func,
        navArrows: PropTypes.shape({
            prev: PropTypes.node,
            next: PropTypes.node
        })
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
            startDate,
            endDate,
            onChange,
            navArrows,
            className,
            ...props
        } = this.props;

        delete props.renderDay;

        return (
            <MonthView
                {...props}
                className={cx(
                    className,
                    styles.container
                )}
                navBarArrows={{
                    prev: navArrows.prev,
                    next: navArrows.next
                }}
                locale={locale}
                date={date}
                minDate={startDate}
                maxDate={endDate}
                onChange={onChange}
                renderDay={this.renderDay}
                showDaysBeforeMonth={true}
                showDaysAfterMonth={true}
                enableHistoryView={false}
                highlightWeekends={true}
                highlightToday={true}
                weekNumbers={false}
                footer={false}
            />
        );
    }
}

export default DatePicker;
