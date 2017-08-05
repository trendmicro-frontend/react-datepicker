import moment from 'moment';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { DateTimeRangePicker } from '../../src';

export default class extends PureComponent {
    static propTypes = {
        locale: PropTypes.string
    };

    state = this.getInitialState();

    getInitialState() {
        const now = moment();

        return {
            startDate: moment(now).format('YYYY-MM-DD'),
            startTime: moment(now).format('hh:mm:ss'),
            endDate: moment(now).add(7, 'days').format('YYYY-MM-DD'),
            endTime: moment(now).add(7, 'days').format('hh:mm:ss')
        };
    }
    render() {
        const { locale } = this.props;
        const { startDate, startTime, endDate, endTime } = this.state;

        return (
            <div>
                <h3>Uncontrolled Component</h3>
                <p>This example will not update invalid date/time range.</p>
                <DateTimeRangePicker
                    locale={locale}
                    defaultStartDate={startDate}
                    defaultStartTime={startTime}
                    defaultEndDate={endDate}
                    defaultEndTime={endTime}
                />
            </div>
        );
    }
}
