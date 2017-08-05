import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import isTwelveHourTime from './lib/is-twelve-hour-time';
import replaceCharAt from './lib/replace-char-at';
import getGroupId from './lib/get-group-id';
import getGroups from './lib/get-groups';
import adder from './lib/time-string-adder';
import caret from './lib/caret';
import validate from './lib/validate';

const SILHOUETTE = '00:00:00:000 AM';

class TimeInput extends PureComponent {
    static defaultProps = {
        value: '00:00:00'
    };
    static propTypes = {
        className: PropTypes.string,
        value: PropTypes.string,
        onChange: PropTypes.func
    };

    input = null;
    mounted = false;
    state = {
        caretIndex: null
    };

    handleBlur = (event) => {
        if (this.mounted) {
            this.setState({ caretIndex: null });
        }
    };
    handleChange = (event) => {
        let value = this.props.value;
        let newValue = this.input.value;
        let diff = newValue.length - value.length;
        let end = caret.start(this.input);
        let insertion;
        let start = end - Math.abs(diff);

        event.preventDefault();

        if (diff > 0) {
            insertion = newValue.slice(end - diff, end);
            while (diff--) {
                const oldChar = value.charAt(start);
                const newChar = insertion.charAt(0);
                if (this.isSeparator(oldChar)) {
                    if (this.isSeparator(newChar)) {
                        insertion = insertion.slice(1);
                        start++;
                    } else {
                        start++;
                        diff++;
                        end++;
                    }
                } else {
                    value = replaceCharAt(value, start, newChar);
                    insertion = insertion.slice(1);
                    start++;
                }
            }
            newValue = value;
        } else {
            if (newValue.charAt(start) === ':') {
                start++;
            }
            // apply default to selection
            let result = value;
            for (let i = start; i < end; i++) {
                result = replaceCharAt(result, i, newValue.charAt(i));
            }
            newValue = result;
        }
        if (validate(newValue)) {
            if (newValue.charAt(end) === ':') {
                end++;
            }
            this.onChange(newValue, end);
        } else {
            const caretIndex = this.props.value.length - (newValue.length - end);
            if (this.mounted) {
                this.setState({ caretIndex: caretIndex });
            }
        }
    };
    handleKeyDown = (event) => {
        event.stopPropagation();

        if (event.which === 9) {
            this.handleTab(event);
            return;
        }
        if (event.which === 38 || event.which === 40) {
            this.handleArrows(event);
            return;
        }
        if (event.which === 8) {
            this.handleBackspace(event);
            return;
        }
        if (event.which === 46) {
            this.handleForwardspace(event);
            return;
        }
        if (event.which === 27) {
            this.handleEscape(event);
            return;
        }
    };

    componentDidMount () {
        this.mounted = true;
    }
    componentWillUnmount () {
        this.mounted = false;
    }
    componentDidUpdate() {
        const index = this.state.caretIndex;
        if (index || index === 0) {
            caret.set(this.input, index);
        }
    }
    render() {
        let className = 'TimeInput';

        if (this.props.className) {
            className += (' ' + this.props.className);
        }

        const value = this.format(this.props.value);

        return (
            <div className={className}>
                <input
                    className="TimeInput-input"
                    ref={node => {
                        this.input = node;
                    }}
                    type="text"
                    value={value}
                    onChange={this.handleChange}
                    onBlur={this.handleBlur}
                    onKeyDown={this.handleKeyDown}
                />
            </div>
        );
    }
    format(val) {
        if (isTwelveHourTime(val)) {
            val = val.replace(/^00/, '12');
        }
        return val.toUpperCase();
    }
    handleEscape() {
        if (this.mounted) {
            this.input.blur();
        }
    }
    handleTab(event) {
        const start = caret.start(this.input);
        const value = this.props.value;
        const groups = getGroups(value);
        let groupId = getGroupId(start);
        if (event.shiftKey) {
            if (!groupId) {
                return;
            }
            groupId--;
        } else {
            if (groupId >= (groups.length - 1)) {
                return;
            }
            groupId++;
        }

        event.preventDefault();

        let index = groupId * 3;
        if (this.props.value.charAt(index) === ' ') {
            index++;
        }
        if (this.mounted) {
            this.setState({ caretIndex: index });
        }
    }
    handleArrows(event) {
        event.preventDefault();
        const start = caret.start(this.input);
        let value = this.props.value;
        let amount = event.which === 38 ? 1 : -1;

        if (event.shiftKey) {
            amount *= 2;
            if (event.metaKey) {
                amount *= 2;
            }
        }

        value = adder(value, getGroupId(start), amount);
        this.onChange(value, start);
    }
    silhouette() {
        return this.props.value.replace(/\d/g, (val, i) => {
            return SILHOUETTE.charAt(i);
        });
    }
    handleBackspace(event) {
        event.preventDefault();

        let start = caret.start(this.input);
        let value = this.props.value;
        let end = caret.end(this.input);

        if (!start && !end) {
            return;
        }

        let diff = end - start;
        const silhouette = this.silhouette();
        if (!diff) {
            if (value[start - 1] === ':') {
                start--;
            }
            value = replaceCharAt(value, start - 1, silhouette.charAt(start - 1));
            start--;
        } else {
            while (diff--) {
                if (value[end - 1] !== ':') {
                    value = replaceCharAt(value, end - 1, silhouette.charAt(end - 1));
                }
                end--;
            }
        }
        if (value.charAt(start - 1) === ':') {
            start--;
        }
        this.onChange(value, start);
    }
    handleForwardspace(event) {
        event.preventDefault();

        let start = caret.start(this.input);
        let value = this.props.value;
        let end = caret.end(this.input);

        if (start === end === (value.length - 1)) {
            return;
        }

        let diff = end - start;
        const silhouette = this.silhouette();

        if (!diff) {
            if (value[start] === ':') {
                start++;
            }
            value = replaceCharAt(value, start, silhouette.charAt(start));
            start++;
        } else {
            while (diff--) {
                if (value[end - 1] !== ':') {
                    value = replaceCharAt(value, start, silhouette.charAt(start));
                }
                start++;
            }
        }
        if (value.charAt(start) === ':') {
            start++;
        }
        this.onChange(value, start);
    }
    isSeparator(char) {
        return /[:\s]/.test(char);
    }
    onChange(str, caretIndex) {
        if (this.props.onChange) {
            this.props.onChange(this.format(str));
        }
        if (this.mounted && typeof caretIndex === 'number') {
            this.setState({ caretIndex: caretIndex });
        }
    }
}

export default TimeInput;
