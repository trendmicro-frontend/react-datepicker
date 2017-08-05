import moment from 'moment';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { DatePicker } from '../../src';

export default class extends PureComponent {
    static propTypes = {
        locale: PropTypes.string
    };

    state = this.getInitialState();

    getInitialState() {
        const now = moment();

        return {
            value: moment(now).format('YYYY-MM-DD'),
            minDate: moment(now).subtract(7, 'days').format('YYYY-MM-DD'),
            maxDate: moment(now).add(7, 'days').format('YYYY-MM-DD')
        };
    }
    render() {
        const { locale } = this.props;
        const { value, minDate, maxDate } = this.state;

        return (
            <div>
                <h3>Selectable Date <span style={{ fontSize: '80%' }}>({minDate} ~ {maxDate})</span></h3>
                <p>{value}</p>
                <DatePicker
                    locale={locale}
                    defaultValue={value}
                    minDate={minDate}
                    maxDate={maxDate}
                    onSelect={value => {
                        this.setState(state => ({ value: value }));
                    }}
                />
            </div>
        );
    }
}
