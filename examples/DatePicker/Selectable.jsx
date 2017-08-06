import Anchor from '@trendmicro/react-anchor';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import DatePicker from '../../src';

export default class extends PureComponent {
    static propTypes = {
        locale: PropTypes.string
    };

    state = this.getInitialState();

    getInitialState() {
        const now = moment();

        return {
            date: moment(now).format('YYYY-MM-DD'),
            minDate: moment(now).subtract(7, 'days').format('YYYY-MM-DD'),
            maxDate: moment(now).add(7, 'days').format('YYYY-MM-DD')
        };
    }
    render() {
        const { locale } = this.props;
        const { date, minDate, maxDate } = this.state;

        return (
            <div>
                <h3><Anchor href="https://github.com/trendmicro-frontend/react-datepicker/blob/master/examples/DatePicker/Selectable.jsx" target="_blank">Selectable Date</Anchor> <span style={{ fontSize: '80%' }}>({minDate} ~ {maxDate})</span></h3>
                <p>Selected: {date}</p>
                <DatePicker
                    locale={locale}
                    defaultDate={date}
                    minDate={minDate}
                    maxDate={maxDate}
                    onSelect={date => {
                        this.setState(state => ({ date: date }));
                    }}
                />
            </div>
        );
    }
}
