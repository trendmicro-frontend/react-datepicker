import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import Anchor from '@trendmicro/react-anchor';
import Dropdown from '@trendmicro/react-dropdown';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import DatePicker, { DateInput } from '../../src';

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
                <h3><Anchor href="https://github.com/trendmicro-frontend/react-datepicker/blob/master/examples/DatePicker/Dropdown.jsx" target="_blank">Dropdown</Anchor></h3>
                <p>Selected: {date}</p>
                <Dropdown>
                    <Dropdown.Toggle
                        btnStyle="link"
                        noCaret
                        style={{ padding: 0 }}
                    >
                        <DateInput
                            value={date}
                            onChange={value => {
                                this.setState(state => ({ date: value }));
                            }}
                        />
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={{ padding: 8 }}>
                        <DatePicker
                            locale={locale}
                            date={date}
                            onSelect={date => {
                                this.setState(state => ({ date: date }));
                            }}
                        />
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        );
    }
}
