/**
 * ImgUpload 组件
 *
 * 说明：
 * 1. 基于 Upload 组件, 属性的扩展:
 *      . size: 可上传图片数量, 有效值为 > 0 的整数值, <= 0 为无效值
 *      . _onChange: 代替 onChange 属性, ImgUpload 用 _onChange 绑定上传事件
 *      . 除上述两个属性的变更之外, Upload 的其他属性均适用于 ImgUpload
 *
 * 2. 可结合 form 表单使用，和其他 Input 表单组件使用方法一样简单:
 *      . ImgUpload 的值是图片的 url:
 *            . 多张图片的值(属性size > 1)是数组 [url, url, url...]
 *            . 单张图片的值(属性size = 1)是字符串 'url'
 *      . 可以直接用表单的 getFieldsValue、setFieldsValue, resetFields... 等方法对 ImgUpload 赋值、取值
 *
 */

/**
 * External dependencies
 */
import React, {Component} from 'react';
import { Icon, Button, Upload, message } from 'antd';

/**
 * Internal dependencies
 */
//import { get } from '../../fetch/get';

class ImgUpload extends Component {

  constructor(props) {
    super(props);

    this.state = {
      size: parseInt(this.props.size) > 0 ? this.props.size : undefined,
      uploadConfig: {},           // 上传的配置，需要配置
      baseUrl: '',                // 上传后图片的域名，需要配置
      fileList: [],
    };
  }

  // 我们是项目中是从后台取 uploadConfig、baseUrl 的配置
  /*componentWillMount() {
    const _this = this,
        result = get('***', { type:'pic' });

    result.then(function(json) {
      const uploadConfig = {
        action: json.data.api,
        listType: 'picture',
        headers: {
          'X-Requested-With': null
        },
        data: json.data.form_data,
      };

      _this.setState({
        uploadConfig: uploadConfig,
        baseUrl: json.data.base_url + "/",
      });
    }).catch(function(ex) {
      console.error('获取图片上传配置失败: ', ex);
    })
  }*/

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps && !this.equlse(nextProps, this.state.fileList)) {
      this.setState({
        fileList: (this.props.fileList || this.receiveFileList(nextProps.value)).slice(0, this.state.size),
      });
    }
  }

  equlse(nextProps, fileList) {
    const nextPropsValue = nextProps.value,
          fileListValue = this.fileListToForm(fileList);

    if (typeof fileListValue === 'string' && typeof nextPropsValue === 'string' && nextPropsValue === fileListValue) {
      return true;
    }

    if (Array.isArray(nextPropsValue) && Array.isArray(fileListValue) && nextPropsValue.length === fileListValue.length) {
      for (let index of nextPropsValue.keys()) {
        if (nextPropsValue[index] !== fileListValue[index]) {
          return false;
        }
      }

      return true;
    }

    return false;
  }

  receiveFileList(value) {
    const fileList = [],
          reg = /[^\\\/]*[\\\/]+/g;

    if (value) {
      if (Array.isArray(value)) {
        value.forEach(function (file, index) {
          fileList.push({
            uid: -index,
            name: file.replace(reg, ''),
            status: 'done',
            url: file,
          });
        })
      } else if (typeof value === 'string') {
        fileList.push({
          uid: -1,
          name: value.replace(reg, ''),
          status: 'done',
          url: value,
        });
      }
    }

    return fileList;
  }

  imgChange(e) {
    const { onChange, _onChange } = this.props;

    // 如果 _onChange 绑定了事件，则执行父组件的 _onChange
    if (_onChange && typeof _onChange === 'function') {
      _onChange(e);
    } else if (e.file.response && e.file.status === 'done' && onChange) {
      onChange(this.fileListToForm(e.fileList));
    } else if (e.file.status === 'removed' && e.fileList.length === 0) {
      onChange([]);
    }

    this.setState({
      fileList: this.getLimitedFileList(e.fileList),
    });
  }

  beforeUpload(file) {
    const extensions = {};

    this.props.accept.split(',').forEach(function (ele) {
      const extension = trim(ele).replace(/./, '');

      if (extension === 'jpg' || extension === 'jpeg') {
        extensions['jpg'] = true;
        extensions['jpeg'] = true;
      }
      extensions[extension] = true;
    });

    if (!extensions[file.type.split('/')[1]]) {
      message.error('只能上传 ' + this.props.accept + ' 格式的图片！', 3);
      return false;
    }
  }

  fileListToForm(fileList) {
    const filesUrl = [],
          baseUrl = this.state.baseUrl,
          size = parseInt(this.state.size);

    this.getLimitedFileList(fileList).forEach(function(file) {
      filesUrl.push(file.url || (baseUrl + file.response.url));
    });

    return size === 1 ? filesUrl[0] : filesUrl;
  }

  getLimitedFileList(fileList) {
    const size = this.state.size && typeof parseInt(this.state.size) === 'number' ?
        -parseInt(this.state.size) :
        0;

    return fileList.slice(size);
  }

  render() {
    return (
      <Upload {...this.state.uploadConfig}
              {...this.props}
              fileList={this.state.fileList}
              onChange={this.imgChange.bind(this)}
              beforeUpload={this.props.beforeUpload || this.beforeUpload.bind(this)}>
        <Button>
          <Icon type="upload" /> 上传图片
        </Button>
      </Upload>
    )
  }
}

export function trim (str) {
  return str.replace(/(^\s*)|(\s*$)/g, '');
}

export default ImgUpload;