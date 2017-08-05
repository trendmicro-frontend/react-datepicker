import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { DateField } from 'react-date-picker';
import uncontrollable from 'uncontrollable';
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
            <div className={cx(className, styles.dateInputContainer)}>
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
                    className={styles.dateInput}
                    {...props}
                />
            </div>
        );
    }
}

export default uncontrollable(DateInput, {
    // Define the pairs of prop/handlers you want to be uncontrollable
    value: 'onChange'
});
