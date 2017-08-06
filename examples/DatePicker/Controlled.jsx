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
            date: moment(now).format('YYYY-MM-DD')
        };
    }
    render() {
        const { locale } = this.props;
        const { date } = this.state;

        return (
            <div>
                <h3><Anchor href="https://github.com/trendmicro-frontend/react-datepicker/blob/master/examples/DatePicker/Controlled.jsx" target="_blank">Controlled Component</Anchor></h3>
                <p>Selected: {date}</p>
                <DatePicker
                    locale={locale}
                    date={date}
                    onSelect={date => {
                        this.setState(state => ({ date: date }));
                    }}
                />
            </div>
        );
    }
}
