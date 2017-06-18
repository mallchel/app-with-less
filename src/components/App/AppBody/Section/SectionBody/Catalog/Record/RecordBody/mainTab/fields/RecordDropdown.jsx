import _ from 'lodash'
import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Reflux from 'reflux'
import Immutable from 'immutable'
import cn from 'classnames'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import DropdownRemote from '../../../../../../../../../common/DropdownRemote'
import { If } from '../../../../../../../../../common/ifc'
import ButtonClose from '../../../../../../../../../common/elements/ButtonClose'
import trs from '../../../../../../../../../../getTranslations'
import modalsActions from '../../../../../../../../../../actions/modalsActions'
import AddBtn from '../addBtn'
import recordActions from '../../../../../../../../../../actions/recordActions'
import FieldErrorsStore from '../../../../../../../../../../stores/FieldErrorsStore'

import styles from './fields.less'

const log = require('debug')('CRM:Component:Record:RemoteDropdown');

const RecordDropdown = React.createClass({
  mixins: [PureRenderMixin, Reflux.listenTo(FieldErrorsStore, "onFocusEvent")],

  propTypes: {
    value: PropTypes.object,
    config: PropTypes.object,
    searchable: PropTypes.bool,
    clickable: PropTypes.bool,
    remoteGroup: PropTypes.string.isRequired,
    onSave: PropTypes.func,
    onClickAddLinkedItem: PropTypes.func,
    requestParams: PropTypes.object,
    inMapper: PropTypes.func.isRequired,
    outMapper: PropTypes.func.isRequired,
    readOnly: PropTypes.bool
  },

  getInitialState() {
    let values = this.props.value || new Immutable.List();
    return {
      values: values,
      dropdownVisible: (values.size == 0),
      focus: false
    };
  },
  onSave(data) {
    if (this.props.onSave) {
      this.props.onSave(data);
    }
    if (this.props.error) {
      recordActions.clearErrorField(this.props.catalogId, this.props.recordId, this.props.fieldId);
    }
  },
  onClickRemoveUser(keyName) {
    let index = (this.state.values.toJS() || [])
      .map(this.props.inMapper)
      .findIndex((u) => u.key === keyName);

    let newValues = this.state.values.delete(index);

    this.setState({
      values: newValues,
      dropdownVisible: newValues.size === 0 ? false : this.state.dropdownVisible
    });

    this.onSave(newValues.toJS());

  },

  onClickAdd(e) {
    e.preventDefault();
    this.setState({
      dropdownVisible: true
    });
  },

  onClickUser(userId, e) {
    e.preventDefault();
  },

  onSelectItems(item) {
    log('item', item);
    item = item[0];

    if (!item) {
      return;
    }

    log('add', item);
    let values = [];
    if (this.state.values) {
      values = this.state.values.toJS() || [];
    }
    values = values.map(this.props.inMapper);

    if (!_.find(values, (it) => it.key === item.key)) {
      let newValues;
      if (this.props.config.get('multiselect')) {
        newValues = this.state.values.push(Immutable.fromJS(this.props.outMapper(item)));
        this.setState({
          values: newValues
        });
      } else {
        newValues = Immutable.fromJS([this.props.outMapper(item)]);
        this.setState({
          values: newValues
        });
      }
      this.onSave(newValues.toJS());
      recordActions.clearErrorField(this.props.catalogId, this.props.recordId, this.props.fieldId);
      this.setState({
        dropdownVisible: false
      });
    }
  },

  onBlurDropdown() {
    let firstValue = this.state.values && this.state.values.get(0);
    if (firstValue) {
      this.setState({
        dropdownVisible: false
      });
    }
    this.setState({
      focus: false
    });
  },

  openObjectInModal(item) {
    if (!item.item.sectionId) {
      return;
    }
    console.log(item)
    let { recordId, catalogId, recordTitle } = item.item;
    modalsActions.openRecordModal(catalogId, recordId, recordTitle);
  },

  onFocusEvent(eventObj) {
    let isFocusEvent = eventObj.event && eventObj.event == 'onFocus';
    let recordId = this.props.recordId;
    let isSelfEvent = eventObj.catalogId == this.props.catalogId
      && eventObj.recordId == recordId
      && eventObj.fieldId == this.props.fieldId;
    if (isFocusEvent && isSelfEvent) {
      this.setState({ focus: true, dropdownVisible: true });
    }
  },

  // onLoadItems(items) {
  //   this._items = items.slice();
  // },

  componentWillReceiveProps(nextProps) {
    if (!Immutable.is(nextProps.value, this.props.value)/* && nextProps.value */) {
      let newValues = Immutable.fromJS(nextProps.value) || new Immutable.List();
      this.setState({
        values: newValues
      });
    }
  },

  render() {
    let multiselect = this.props.config.get('multiselect');
    let firstValue = (this.state.values.size > 0) ? this.state.values.get(0) : null;
    let firstValueKey = firstValue && firstValue.get('id');
    let selectedKeys = {};
    let cx = cn({
      // 'record-user--with-dropdown': this.state.dropdownVisible,
      'record-user--multiselect': multiselect,
      'record-dropdown--readonly': this.props.readOnly
    });

    let values = this.props.value || [];
    if (this.props.value && this.props.value.toJS) {
      values = this.props.value.toJS();
    }

    return (
      <div className={cx}>
        <div className="record-user__items">
          {
            this.state.values.toJS().map(this.props.inMapper).map(item => {
              let disabled = _.get(item, 'item.isRemoved');
              selectedKeys[item.key] = true;
              if (!item.text) {
                return (
                  <span key={item.key} className={"record-user__item" + (disabled ? ' record-user__item-disabled' : '')}>
                    <img className="loading__gif" src="/modules/crm/images/loader.gif" />&nbsp;
                    <span className="loading__text">{trs('loadingText')}</span>
                  </span>
                );
              }
              return (
                <div key={item.key} className={cn(disabled ? styles.dropdownItemRowDisabled : '')}>
                  {
                    <Link to="/123" className={styles.dropdownLink} onClick={this.props.clickable && !disabled && this.openObjectInModal.bind(this, item)}>
                      <span className={cn('anticon-icon ' + item.icon, styles.dropdownItemIcon)} />
                      <span className={styles.dropdownItemText}>{item.text}</span>
                    </Link>
                  }
                  {
                    !disabled && <ButtonClose
                      onClick={() => this.onClickRemoveUser(item.key)}
                      small
                    />
                  }
                </div>
              );
            })
          }
          <If condition={!this.props.readOnly && (multiselect || !firstValue)}>
            <AddBtn
              style={this.state.dropdownVisible ? { display: 'none' } : null}
              //className="record-user__item record-user__item--add"
              icon="edition-25"
              caption={trs('record.fields.user.addUser')}
              onClick={this.onClickAdd} />
          </If>
          <If condition={this.state.dropdownVisible && !this.props.readOnly && (multiselect || !firstValue)}>
            <DropdownRemote
              {...this.props}
              type={this.props.remoteGroup}
              itemsMapper={this.props.itemsMapper}
              outMapper={null}
              requestParams={this.props.requestParams}
              autoFocus={this.state.focus || !!firstValue}
              filterFn={item => !selectedKeys[item.key]}
              onLoadItems={this.onLoadItems}
              additionalItems={values}
              onClickAddLinkedItem={this.props.onClickAddLinkedItem}
              autocomplete={true}
              searchable={this.props.searchable}
              clearOnSelect={multiselect}
              onBlur={this.onBlurDropdown}
              value={multiselect ? null : firstValueKey}
              onSelectItems={this.onSelectItems} />
          </If>
        </div>
      </div>
    );
  }
});

export default RecordDropdown;
