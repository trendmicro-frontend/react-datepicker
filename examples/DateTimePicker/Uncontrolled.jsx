import Anchor from '@trendmicro/react-anchor';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import DatePicker, { TimeInput, DateInput } from '../../src';

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
                <h3><Anchor href="https://github.com/trendmicro-frontend/react-datepicker/blob/master/examples/DateTimePicker/Uncontrolled.jsx" target="_blank">Uncontrolled Component</Anchor></h3>
                <p>Selected: {date} {time}</p>
                <div className="clearfix">
                    <div className="pull-left">
                        <DateInput
                            defaultValue={date}
                            onChange={value => {
                                this.setState(state => ({ date: value }));
                            }}
                        />
                    </div>
                    <div className="pull-left" style={{ marginLeft: 8 }}>
                        <TimeInput
                            defaultValue={time}
                            onChange={value => {
                                this.setState(state => ({ time: value }));
                            }}
                        />
                    </div>
                </div>
                <div>
                    <DatePicker
                        locale={locale}
                        defaultDate={date}
                        onSelect={date => {
                            this.setState(state => ({ date: date }));
                        }}
                    />
                </div>
            </div>
        );
    }
}
