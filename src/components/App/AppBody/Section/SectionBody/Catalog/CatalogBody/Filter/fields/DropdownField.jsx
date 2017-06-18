import _ from 'lodash'
import trs from '../../../../../../../../../getTranslations'
import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Immutable from 'immutable'
import { Tag } from 'antd'

import styles from './controls.less'

function getValuesMap(values) {
  let map = {};
  (values || []).forEach((v) => {
    map[v] = true;
  });
  return Immutable.fromJS(map);
}

const DropdownField = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    value: React.PropTypes.object,
    config: React.PropTypes.object,
    onSave: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      values: getValuesMap(this.props.value)
    };
  },

  onClickItem(itemId) {
    let newValues = this.state.values;

    newValues = newValues.set(itemId, !this.state.values.get(itemId));

    this.setState({
      values: newValues
    });

    let values = [];
    newValues.forEach((v, id) => {
      if (v) {
        values.push(id);
      }
    });

    this.props.onSave(this.props.fieldId, values);
  },

  componentWillReceiveProps(nextProps) {
    if (!Immutable.is(nextProps.value, this.props.value)) {
      this.setState({
        values: getValuesMap(nextProps.value)
      });
    }
  },

  render() {
    // get deleted values from
    let deletedValues = null;

    if (this.state.values) {
      let idsFromFilter = this.state.values.keySeq().toArray();
      let idsFromFieldConfig = this.props.config.get('items').map(item => item.get('id')).toArray();

      deletedValues = _.difference(idsFromFilter, idsFromFieldConfig).map(id => {
        return (
          <span
            key={id}
            onClick={_.bind(this.onClickItem, this, id)}
            className="record-dropdown__item  record-dropdown__item--selected">
            {trs('filter.field.removed')}</span>
        );
      });
    }

    return (
      <div className={styles.dropdownContainer}>
        {this.props.config.get('items').map((item) => {
          const id = item.get('id');
          const selected = this.state.values.get(id);
          return (
            <Tag
              key={id}
              onClick={_.bind(this.onClickItem, this, id)}
              style={selected ? { backgroundColor: '#' + item.get('color') } : { backgroundColor: 'transparent' }}
              className={styles.tags}
            >
              {item.get('name')}
            </Tag>
          );
        })}

        {deletedValues}
      </div>
    );
  }
});

export default DropdownField;
