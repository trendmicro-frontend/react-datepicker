import Anchor from '@trendmicro/react-anchor';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import DateTimeRangePicker from './DateTimeRangePicker';

export default class extends PureComponent {
    static propTypes = {
        locale: PropTypes.string
    };

    state = this.getInitialState();

    getInitialState() {
        const now = moment();

        return {
            minDate: '2000-01-01',
            maxDate: moment(now).format('YYYY-MM-DD'),
            startDate: moment(now).format('YYYY-MM-DD'),
            startTime: moment(now).format('hh:mm:ss'),
            endDate: moment(now).add(7, 'days').format('YYYY-MM-DD'),
            endTime: moment(now).add(7, 'days').format('hh:mm:ss')
        };
    }

    render() {
        const { locale } = this.props;
        const { minDate, maxDate, startDate, startTime, endDate, endTime } = this.state;

        return (
            <div>
                <h3><Anchor href="https://github.com/trendmicro-frontend/react-datepicker/blob/master/examples/DateTimeRangePicker/Uncontrolled.jsx" target="_blank">Uncontrolled Component</Anchor></h3>
                <p><b>Note:</b> This example will not update invalid date/time range.</p>
                <ul>
                    <li>Minimum: {minDate}</li>
                    <li>Maximum: {maxDate}</li>
                    <li>Range: {startDate} {startTime} ~ {endDate} {endTime}</li>
                </ul>
                <DateTimeRangePicker
                    locale={locale}
                    minDate={minDate}
                    maxDate={maxDate}
                    defaultStartDate={startDate}
                    defaultStartTime={startTime}
                    defaultEndDate={endDate}
                    defaultEndTime={endTime}
                />
            </div>
        );
    }
}
