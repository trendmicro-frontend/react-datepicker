import moment from 'moment';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { DateTimePicker } from '../../src';

export default class extends PureComponent {
    static propTypes = {
        locale: PropTypes.string
    };

    state = this.getInitialState();

    getInitialState() {
        const now = moment();

        return {
            date: moment(now).format('YYYY-MM-DD'),
            time: moment(now).format('hh:mm:ss')
        };
    }
    render() {
        const { locale } = this.props;
        const { date, time } = this.state;

        return (
            <div>
                <h3>Uncontrolled Component</h3>
                <p>{date} {time}</p>
                <DateTimePicker
                    locale={locale}
                    defaultDate={date}
                    defaultTime={time}
                    onChangeDate={value => {
                        this.setState(state => ({ date: value }));
                    }}
                    onChangeTime={value => {
                        this.setState(state => ({ time: value }));
                    }}
                />
            </div>
        );
    }
}
