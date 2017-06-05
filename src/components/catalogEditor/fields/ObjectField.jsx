import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Immutable from 'immutable';
import trs from '../../../getTranslations';
import DropdownRemote from '../../common/DropdownRemote';
import editorActions from '../../../actions/editorActions';

const log = require('debug')('CRM:Component:ObjectField');

const ObjectField = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    field: React.PropTypes.object.isRequired,
    fieldIndex: React.PropTypes.number.isRequired,
    catalogs: React.PropTypes.object.isRequired,
    sectionId: React.PropTypes.string.isRequired,
    disabled: React.PropTypes.bool
  },

  getInitialState() {
    let items = [];
    if (this.props.field.getIn(['config', 'catalogs'])) {
      this.props.field.getIn(['config', 'catalogs']).toJS().map(c=> items.push({id: c.id, title: c.title}));
    }
    if (this.props.field.getIn(['config', 'views'])) {
      this.props.field.getIn(['config', 'views']).toJS().map(v=> items.push({id: 'view:' + v.id, title: v.title}));
    }
    return {
      values: items,
      accessOnly: this.props.field.getIn(['config', 'accessOnly']),
      multiselect: this.props.field.getIn(['config', 'multiselect'])
    };
  },

  onSelect(selectedItems) {
    let catalogs = [];
    let views = [];
    selectedItems.map((item)=> {
      let key = item.key.split(':');
      if (key[0] == 'view') {
        views.push({id: key[1]});
      } else {
        catalogs.push({id: item.key});
      }
    });

    editorActions.changeFieldConfig(this.props.sectionId, this.props.fieldIndex, {
      catalogs, views
    });
    this.setState({
      values : selectedItems.map(
        item => ({
          id : item.key,
          title: item.text
        })
      )
    });
  },

  onChangeCheckbox(e) {
    let value = e.target.checked;
    this.setState({
      [e.target.name]: value
    });
    editorActions.changeFieldConfig(this.props.sectionId, this.props.fieldIndex, {
      [e.target.name]: value
    });
  },

  render() {
    let items = [];
    if (this.props.field.getIn(['config', 'catalogs'])) {
      this.props.field.getIn(['config', 'catalogs']).toJS().map(c=> items.push({id: c.id, title: c.title}));
    }
    if (this.props.field.getIn(['config', 'views'])) {
      this.props.field.getIn(['config', 'views']).toJS().map(v=> items.push({id: 'view:' + v.id, title: v.title}));
    }
    return (
      <div className="field-type-object">
        <DropdownRemote
          type="catalogs"
          placeholder={trs('catalogEditor.field.object.namePlaceholder')}
          additionalItems={this.state.values.map(c=> ({key: c.id, text: c.title, icon: c.icon}))}
          disabled={this.props.disabled}
          multiselect={true}
          autocomplete={true}
          value={items.map(c=> ({key: c.id, text: c.title, icon: c.icon}))}
          withButton={false}
          onSelectItems={this.onSelect} />
          <label className="checkbox">
            <input disabled={this.props.disabled} type="checkbox" name="multiselect" checked={this.state.multiselect} onChange={this.onChangeCheckbox} />
            <span>{trs('fieldTypes.object.multiselect')}</span>
          </label>
          <label className="checkbox">
            <input disabled={this.props.disabled} type="checkbox" name="accessOnly" checked={this.state.accessOnly} onChange={this.onChangeCheckbox} />
            <span>{trs('fieldTypes.object.accessOnly')}</span>
          </label>
      </div>
    );
  }

});

export default ObjectField;