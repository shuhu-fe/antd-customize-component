import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Form, Button } from 'antd';
import NumericInput from './components/numericInput';
import ImgUpload from './components/imgUpload';

class Demo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {
        number: 1,
      }
    };

    this.cacheFormData = this.state.formData;
    this.showFormData = this.showFormData.bind(this);
  }

  componentWillMount() {
    this.props.form.setFieldsValue(this.state.formData);
  }

  submit() {
    this.showFormData();
  }

  reset() {
    this.props.form.setFieldsValue(this.cacheFormData);
    this.showFormData();
  }

  clear() {
    this.props.form.resetFields();
    this.showFormData();
  }

  showFormData() {
    const formData = this.props.form.getFieldsValue();
    this.setState({formData});
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const FormItem = Form.Item;

    return (
        <div>
          <Form>
            {/*

            // 在 ImgUpload 中添加自己项目中上传文件的配置再使用

            <FormItem
                label="图片"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 8 }}
            >
              <ImgUpload />
            </FormItem>*/}

            <FormItem
                label="数值组件"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 8 }}
            >
              {getFieldDecorator('number', {
                rules: [{ required: true, message: '不能为空', whitespace: true }],
              })(
                  <NumericInput />
              )}
            </FormItem>

            <FormItem
              style={{ marginTop: 48 }}
              wrapperCol={{ span: 8, offset: 8 }}
            >
              <Button size="large" type="primary" onClick={this.submit.bind(this)}>
                确定
              </Button>
              <Button size="large" style={{ marginLeft: 8 }} onClick={this.reset.bind(this)}>
                重置
              </Button>
              <Button size="large" style={{ marginLeft: 8 }} onClick={this.clear.bind(this)}>
                清空
              </Button>
            </FormItem>

          </Form>
          <div>
            <div style={{marginLeft: 428, fontSize: 24, fontWeight: 'bold', marginTop: 78}}>
              <span>数值：</span>
              <span>{this.state.formData.number}</span>
            </div>
            <div style={{marginLeft: 428, fontSize: 24, fontWeight: 'bold', marginTop: 78}}>
              <span>
                注：这里只展示了 NumericInput 组件；
                ImgUpload 添加 action 配置即可使用，详看 ImgUpload 中 auploadConfig、baseUrl 配置
              </span>
            </div>
          </div>
        </div>
    );
  }
}
const WrappedSetAnency = Form.create()(Demo);

ReactDOM.render(<WrappedSetAnency />, document.getElementById('container'));
