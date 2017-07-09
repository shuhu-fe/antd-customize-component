/**
 * NumericInput 组件
 *
 * 说明：
 * 1. 基于 Input 组件, 属性的扩展:
 *      . numberType: 数值类型，integer 是整数，否则为负数
 *      . _onChange: 代替 onChange 属性, NumericInput 用 _onChange 绑定上传事件
 *      . 除上述两个属性的变更之外, Input 的其他属性均适用于 NumericInput
 *
 * 2. 可结合 form 表单使用，和其他 Input 表单组件使用方法一样简单:
 *      . 可以直接用表单的 getFieldsValue、setFieldsValue, resetFields... 等方法对 NumericInput 赋值、取值，返回 string 类型值
 *
 */

import React from 'react';
import { Input } from 'antd';

class NumericInput extends React.Component {
	constructor(props) {
		super(props);

    this.numberTypes = {
      'integer': /^-?(0|[1-9][0-9]*)?$/,
      'float': /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/,
    };
		this.initState = this.initState.bind(this);
    this.state = {
      inputProps: this.initState(),
    };
	}

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        value: nextProps.value,
      })
    }
  }

  onChange(e) {
    const { value } = e.target;
    const { _onChange } = this.props;
    const reg = this.props.numberType === 'integer' ? this.numberTypes['integer'] : this.numberTypes['float'];

    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      this.props.onChange(value);
    }

    if (_onChange) {
      _onChange(e);
    }
  }

  onBlur(e) {
    const { value, onBlur, onChange } = this.props;

    if (value.charAt(value.length - 1) === '.' || value === '-') {
      onChange({ value: value.slice(0, -1) });
    }

    if (onBlur) {
      onBlur(e);
    }
  }

  initState() {
    const filterProps = {};
    const defaultProps = {
      placeholder: '请输入数字',
      maxLength: '25',
    };

    for (let [index, ele] of Object.keys(this.props).entries()) {
      if (ele !== '_onChange' && ele !== 'numberType' && ele !== 'value') {
        filterProps[ele] = this.props[ele];
      }
    }

    return Object.assign(defaultProps, filterProps);
  }

  render() {
    return (
			<Input
          {...this.state.inputProps}
          value={this.state.value}
					onChange={this.onChange.bind(this)}
					onBlur={this.onBlur.bind(this)}
			/>
    );
  }
}

export default NumericInput;
