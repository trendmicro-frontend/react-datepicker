import React from 'react';
import Component from 'react-class';
import assign from 'object-assign';

import TimeInput from './TimeInput';

import join from './join';


export default class TimePicker extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    // prepareDate(props){
    //   return toMoment(props.date, props)
    // }

    render() {
        const props = this.p = assign({}, this.props);
        props.children = React.Children.toArray(props.children);

        const timeFormat = props.timeFormat.toLowerCase();

        // props.date = this.prepareDate(props)
        props.hasTime = props.hasTime || timeFormat.indexOf('k') !== -1 || timeFormat.indexOf('h') !== -1;

        const className = join(
            props.className,
            'react-date-picker__time-picker',
            props.theme && `react-date-picker__time-picker--theme-${props.theme}`
        );

        return (<div
            inline
            column
            wrap={false}
            {...this.props}
            className={className}
        >
            {this.renderClock()}
            {this.renderInput()}
        </div>);
    }

    renderInput() {
        return (<TimeInput
            className="react-date-picker__time-picker-input"
            format={this.props.timeFormat || this.props.format}
            defaultValue={this.props.value || this.props.defaultValue}
            onChange={this.onTimeChange}
        />);
    }

    onTimeChange(value) {
        const time = value.split(':');

        let seconds = time[0] * 3600 + parseInt(time[1], 10) * 60;

        if (time[2]) {
            seconds += parseInt(time[2], 10);
        }

        this.setState({
            seconds
        });

        if (this.props.onChange) {
            this.props.onChange(value);
        }
    }

    renderClock() {
        const props = this.p;
        const clock = props.children
            .filter(child => child && child.props && child.props.isTimePickerClock)[0];

        const clockProps = {
            seconds: this.state.seconds,
            showSecondsHand: true
        };

        if (clock) {
            return React.cloneElement(clock, clockProps);
        }

        return <Clock {...clockProps} />;
    }
}

TimePicker.defaultProps = {
    format: 'HH:mm:ss a',
    theme: 'default',
    isTimePicker: true
};

TimePicker.propTypes = {
};
