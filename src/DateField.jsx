import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { DateField } from 'react-date-picker';
import 'react-date-picker/index.css';

class DateFieldComponent extends PureComponent {
    static propTypes = {
        locale: PropTypes.string,
        dateFormat: PropTypes.string,
        value: PropTypes.string,
        startDate: PropTypes.object,
        endDate: PropTypes.object,
        onChange: PropTypes.func
    };
    static defaultProps = {
        locale: 'en',
        dateFormat: 'YYYY-MM-DD',
        value: '',
        startDate: null,
        endDate: null,
        onChange: (date /* moment */) => {
            // noop
        }
    };

    render() {
        const {
            locale,
            dateFormat,
            value,
            startDate,
            endDate,
            onChange,
            ...props
        } = this.props;

        return (
            <DateField
                locale={locale}
                dateFormat={dateFormat}
                expanded={false}
                forceValidDate={true}
                updateOnDateClick={true}
                collapseOnDateClick={false}
                clearIcon={false}
                minDate={startDate}
                maxDate={endDate}
                onChange={onChange}
                value={value}
                {...props}
            />
        );
    }
}

export default DateFieldComponent;
