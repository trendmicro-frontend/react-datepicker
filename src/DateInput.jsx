import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import uncontrollable from 'uncontrollable';
import DateField from './DatePickerSrc/DateField';
import styles from './DateInput.styl';

class DateInput extends PureComponent {
    static propTypes = {
        locale: PropTypes.string,

        dateFormat: PropTypes.string,

        value: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.string
        ]),

        // The minimum selectable date. When set to null, there is no minimum.
        // Types supported:
        // * Date: A date object containing the minimum date.
        // * String: A date string defined by dateFormat.
        minDate: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.string
        ]),

        // The maximum selectable date. When set to null, there is no maximum.
        // Types supported:
        // * Date: A date object containing the maximum date.
        // * String: A date string defined by dateFormat.
        maxDate: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.string
        ]),

        // Called when the value changes.
        onChange: PropTypes.func,

        renderIcon: PropTypes.func
    };
    static defaultProps = {
        locale: 'en',
        dateFormat: 'YYYY-MM-DD',
        value: '',
        minDate: null,
        maxDate: null,
        onChange: () => {}
    };

    render() {
        const {
            locale,
            dateFormat,
            value,
            minDate,
            maxDate,
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
                    minDate={minDate}
                    maxDate={maxDate}
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
