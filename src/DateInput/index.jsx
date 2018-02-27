import cx from 'classnames';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import uncontrollable from 'uncontrollable';
import replaceCharAt from './lib/replace-char-at';
import getGroupId from './lib/get-group-id';
import getGroups from './lib/get-groups';
import caret from './lib/caret';
import styles from './index.styl';

const SILHOUETTE = '0000-01-01';

class DateInput extends PureComponent {
    static propTypes = {
        className: PropTypes.string,
        value: PropTypes.string,
        onChange: PropTypes.func,
        rendeIcon: PropTypes.func
    };
    static defaultProps = {
        value: '0000-00-00',
        renderIcon: (props) => (
            <label className={props.className}>
                {props.children}
            </label>
        )
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
            if (newValue.charAt(start) === '-') {
                start++;
            }
            // apply default to selection
            let result = value;
            for (let i = start; i < end; i++) {
                result = replaceCharAt(result, i, newValue.charAt(i));
            }
            newValue = result;
        }

        const m = moment(newValue);
        if (m.isValid()) {
            if (newValue.charAt(end) === '-') {
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

    handleEscape = () => {
        if (this.mounted) {
            this.input.blur();
        }
    };

    handleTab = (event) => {
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

        let index = 0; // YYYY-MM-DD
        if (groupId === 1) {
            index = (4 + 1);
        }
        if (groupId === 2) {
            index = (4 + 1) + (2 + 1);
        }
        if (this.props.value.charAt(index) === ' ') {
            index++;
        }
        if (this.mounted) {
            this.setState({ caretIndex: index });
        }
    };

    handleArrows = (event) => {
        event.preventDefault();

        const start = caret.start(this.input);
        const groupId = getGroupId(start);
        const unit = {
            0: 'years',
            1: 'months',
            2: 'days'
        }[groupId];

        if (!unit) {
            return;
        }

        const m = moment(this.props.value);
        if (!m.isValid()) {
            return;
        }

        const UP = 38;
        const DOWN = 40;

        if (event.which === UP) {
            const value = m.add(1, unit).format('YYYY-MM-DD');
            this.onChange(value, start);
        } else if (event.which === DOWN) {
            const value = m.subtract(1, unit).format('YYYY-MM-DD');
            this.onChange(value, start);
        }
    };

    handleBackspace = (event) => {
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
            if (value[start - 1] === '-') {
                start--;
            }
            value = replaceCharAt(value, start - 1, silhouette.charAt(start - 1));
            start--;
        } else {
            while (diff--) {
                if (value[end - 1] !== '-') {
                    value = replaceCharAt(value, end - 1, silhouette.charAt(end - 1));
                }
                end--;
            }
            if (value.charAt(start - 1) === '-') {
                start--;
            }
        }

        this.onChange(value, start);
    };

    handleForwardspace = (event) => {
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
            if (value[start] === '-') {
                start++;
            }
            value = replaceCharAt(value, start, silhouette.charAt(start));
            start++;
        } else {
            while (diff--) {
                if (value[end - 1] !== '-') {
                    value = replaceCharAt(value, start, silhouette.charAt(start));
                }
                start++;
            }
        }

        if (value.charAt(start) === '-') {
            start++;
        }

        this.onChange(value, start);
    };

    isSeparator = (char) => {
        return /[:\s]/.test(char);
    };

    onChange = (str, caretIndex) => {
        const m = moment(str);
        if (m.isValid()) {
            this.props.onChange && this.props.onChange(str);
        }
        if (this.mounted && typeof caretIndex === 'number') {
            this.setState({ caretIndex: caretIndex });
        }
    };

    silhouette = () => {
        return this.props.value.replace(/\d/g, (val, i) => {
            return SILHOUETTE.charAt(i);
        });
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
        let className = 'DateInput';

        if (this.props.className) {
            className += (' ' + this.props.className);
        }

        const { value } = this.props;

        return (
            <div className={cx(className, styles.dateInputContainer)}>
                <div className={styles.dateInput}>
                    <input
                        className="DateInput-input"
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
                {this.props.renderIcon({
                    className: styles.dateInputIcon,
                    children: <i className="fa fa-calendar" />
                })}
            </div>
        );
    }
}

export default uncontrollable(DateInput, {
    // Define the pairs of prop/handlers you want to be uncontrollable
    value: 'onChange'
});
