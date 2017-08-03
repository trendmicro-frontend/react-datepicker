import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { DateField } from 'react-date-picker';
import 'react-date-picker/index.css';
import styles from './DateInput.styl';

class DateInput extends PureComponent {
    static propTypes = {
        locale: PropTypes.string,
        dateFormat: PropTypes.string,
        value: PropTypes.string,
        startDate: PropTypes.object,
        endDate: PropTypes.object,
        onChange: PropTypes.func,
        renderIcon: PropTypes.func
    };
    static defaultProps = {
        locale: 'en',
        dateFormat: 'YYYY-MM-DD',
        value: '',
        startDate: null,
        endDate: null,
        onChange: () => {}
    };

    render() {
        const {
            locale,
            dateFormat,
            value,
            startDate,
            endDate,
            onChange,
            className,
            ...props
        } = this.props;

        if (typeof props.renderIcon === 'function') {
            props.renderCalendarIcon = props.renderIcon;
            delete props.renderIcon;
        }

        return (
            <DateField
                locale={locale}
                dateFormat={dateFormat}
                expanded={false}
                collapseOnDateClick={false}
                forceValidDate={true}
                updateOnDateClick={true}
                clearIcon={false}
                minDate={startDate}
                maxDate={endDate}
                onChange={onChange}
                value={value}
                className={classNames(className, styles.dateInput)}
                {...props}
            />
        );
    }
}

export default DateInput;
